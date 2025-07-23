/**
 * Database Router Service for Read/Write Splitting
 *
 * Automatically routes:
 * - READ operations → Read Replicas (for performance)
 * - WRITE operations → Main Database (for consistency)
 */

import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma";

@Injectable()
export class DatabaseRouter {
  private readonly logger = new Logger(DatabaseRouter.name);

  // Main database for writes
  private readonly writeDb: PrismaClient;

  // Read replicas for reads
  private readonly readDbPrimary: PrismaClient;
  private readonly readDbEast: PrismaClient;

  // Connection tracking
  private readReplicaIndex = 0;
  private readonly availableReadReplicas: PrismaClient[] = [];

  constructor() {
    // Initialize main database connection (writes)
    this.writeDb = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_WRITE_POOL_URL || process.env.DATABASE_URL,
        },
      },
      log: ["error", "warn"],
    });

    // Initialize read replica connections
    this.readDbPrimary = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.DATABASE_READ_REPLICA_PRIMARY_URL ||
            process.env.DATABASE_URL,
        },
      },
      log: ["error"],
    });

    this.readDbEast = new PrismaClient({
      datasources: {
        db: {
          url:
            process.env.DATABASE_READ_REPLICA_EAST_URL ||
            process.env.DATABASE_URL,
        },
      },
      log: ["error"],
    });

    // Build available replicas list
    this.availableReadReplicas.push(this.readDbPrimary);
    if (process.env.DATABASE_READ_REPLICA_EAST_URL) {
      this.availableReadReplicas.push(this.readDbEast);
    }

    this.logger.log(
      `Database Router initialized with ${this.availableReadReplicas.length} read replicas`
    );
  }

  /**
   * Get database connection for WRITE operations
   * Routes to main database with connection pooling
   */
  getWriteConnection(): PrismaClient {
    this.logger.debug("Routing to WRITE database (main)");
    return this.writeDb;
  }

  /**
   * Get database connection for READ operations
   * Routes to read replicas with load balancing
   */
  getReadConnection(): PrismaClient {
    // Round-robin load balancing across read replicas
    const replica = this.availableReadReplicas[this.readReplicaIndex];
    this.readReplicaIndex =
      (this.readReplicaIndex + 1) % this.availableReadReplicas.length;

    this.logger.debug(
      `Routing to READ replica ${this.readReplicaIndex}/${this.availableReadReplicas.length}`
    );
    return replica;
  }

  /**
   * Execute a read query with automatic replica routing
   */
  async executeRead<T>(query: (db: PrismaClient) => Promise<T>): Promise<T> {
    const startTime = Date.now();
    const readDb = this.getReadConnection();

    try {
      const result = await query(readDb);
      const duration = Date.now() - startTime;
      this.logger.debug(`Read query executed in ${duration}ms on replica`);
      return result;
    } catch (error) {
      this.logger.error(
        "Read query failed on replica, falling back to main database",
        error
      );
      // Fallback to main database on replica failure
      return await query(this.writeDb);
    }
  }

  /**
   * Execute a write query with automatic main database routing
   */
  async executeWrite<T>(query: (db: PrismaClient) => Promise<T>): Promise<T> {
    const startTime = Date.now();
    const writeDb = this.getWriteConnection();

    try {
      const result = await query(writeDb);
      const duration = Date.now() - startTime;
      this.logger.debug(
        `Write query executed in ${duration}ms on main database`
      );
      return result;
    } catch (error) {
      this.logger.error("Write query failed on main database", error);
      throw error; // Don't fallback for writes - data consistency is critical
    }
  }

  /**
   * Health check for all database connections
   */
  async healthCheck(): Promise<{
    main: boolean;
    readPrimary: boolean;
    readEast: boolean;
    totalReplicas: number;
    healthyReplicas: number;
  }> {
    const results = {
      main: false,
      readPrimary: false,
      readEast: false,
      totalReplicas: this.availableReadReplicas.length,
      healthyReplicas: 0,
    };

    // Check main database
    try {
      await this.writeDb.$queryRaw`SELECT 1`;
      results.main = true;
    } catch (error) {
      this.logger.error("Main database health check failed", error);
    }

    // Check primary read replica
    try {
      await this.readDbPrimary.$queryRaw`SELECT 1`;
      results.readPrimary = true;
      results.healthyReplicas++;
    } catch (error) {
      this.logger.error("Primary read replica health check failed", error);
    }

    // Check east read replica
    try {
      await this.readDbEast.$queryRaw`SELECT 1`;
      results.readEast = true;
      results.healthyReplicas++;
    } catch (error) {
      this.logger.error("East read replica health check failed", error);
    }

    return results;
  }

  /**
   * Close all database connections
   */
  async onModuleDestroy() {
    await Promise.all([
      this.writeDb.$disconnect(),
      this.readDbPrimary.$disconnect(),
      this.readDbEast.$disconnect(),
    ]);
    this.logger.log("All database connections closed");
  }
}
