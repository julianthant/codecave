import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { DatabaseRouter } from "./lib/database-router";
import { Public } from "@thallesp/nestjs-better-auth";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    private readonly databaseRouter: DatabaseRouter
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get("health")
  async getHealth() {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const memoryUsedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const memoryTotalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    // Check database connectivity
    let databaseStatus = "healthy";
    let replicaHealth = null;

    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      // Check read replica health
      replicaHealth = await this.databaseRouter.healthCheck();
    } catch (error) {
      databaseStatus = "unhealthy";
    }

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      environment: process.env.NODE_ENV || "development",
      services: {
        database: databaseStatus,
        replicas: replicaHealth,
        memory: {
          used: `${memoryUsedMB}MB`,
          total: `${memoryTotalMB}MB`,
          percentage: Math.round((memoryUsedMB / memoryTotalMB) * 100),
        },
        version: process.env.npm_package_version || "0.1.0",
      },
    };
  }

  @Public()
  @Get("health/live")
  async getLiveness() {
    return {
      status: "alive",
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get("health/ready")
  async getReadiness() {
    // Check if the service is ready to accept traffic
    let ready = true;
    let dbConnected = false;
    let replicasHealthy = 0;

    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      dbConnected = true;

      // Check read replicas
      const replicaHealth = await this.databaseRouter.healthCheck();
      replicasHealthy = replicaHealth.healthyReplicas;
    } catch (error) {
      ready = false;
    }

    return {
      status: ready ? "ready" : "not ready",
      timestamp: new Date().toISOString(),
      ready,
      checks: {
        database: dbConnected,
        replicas: {
          healthy: replicasHealthy,
          total: 2,
        },
      },
    };
  }

  @Get("sentry-test")
  getSentryTest() {
    throw new Error("This is a test error for Sentry");
  }

  @Get("sentry-error")
  getSentryError() {
    try {
      throw new Error("This is a test error for Sentry");
    } catch (error) {
      // Handle error gracefully but still track it
      return { error: "An error occurred and was logged to Sentry" };
    }
  }
}
