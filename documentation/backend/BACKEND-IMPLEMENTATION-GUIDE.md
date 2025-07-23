# CodeCave Backend Implementation Guide

## 🎯 **Overview**

This guide documents the complete NestJS backend implementation for CodeCave, including new features that have been implemented but not previously documented.

## 🏗️ **Backend Architecture**

### **Technology Stack**

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth with OAuth (GitHub, Google)
- **Monitoring**: Sentry error tracking and performance monitoring
- **Validation**: class-validator and class-transformer
- **Security**: Global authentication guard with public route decorators

### **Project Structure**

```
apps/api/
├── src/
│   ├── app.module.ts              # Main application module
│   ├── app.controller.ts          # Basic endpoints + Sentry testing
│   ├── app.service.ts             # Basic application service
│   ├── main.ts                    # Application bootstrap
│   ├── instrument.ts              # Sentry initialization
│   │
│   ├── auth/                      # Authentication module
│   │   └── auth.controller.ts     # Better Auth route handler
│   │
│   ├── lib/                       # Shared libraries
│   │   └── auth.ts                # Better Auth configuration
│   │
│   ├── users/                     # User management
│   │   ├── users.controller.ts    # User endpoints
│   │   ├── users.service.ts       # User CRUD operations
│   │   ├── users.module.ts        # User module
│   │   └── entities/
│   │       ├── user.entity.ts     # User type definitions
│   │       └── oauth-profile.ts   # OAuth profile interface
│   │
│   ├── prisma/                    # Database module
│   │   ├── prisma.service.ts      # Prisma client service
│   │   └── prisma.module.ts       # Global Prisma module
│   │
│   └── types/                     # Type definitions
│       └── express.d.ts           # Express type augmentations
│
├── prisma/                        # Database schema and migrations
│   ├── schema.prisma              # Complete database schema
│   └── migrations/                # Database migrations
│       ├── 20250720081900_init/   # Initial migration
│       └── 001_better_auth_schema.sql # Better Auth schema
│
├── generated/                     # Generated Prisma client
├── Dockerfile.dev                 # Development container
├── Dockerfile.prod                # Production multi-stage build
└── package.json                   # Dependencies and scripts
```

## 🔐 **Authentication System**

### **Global Authentication Strategy**

The API implements a **global authentication guard** with opt-out public routes:

```typescript
// apps/api/src/app.module.ts
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Global authentication
    },
  ],
})
export class AppModule {}
```

#### **Protected by Default**

All routes are protected by default and require authentication:

```typescript
@Controller("users")
export class UsersController {
  @Get("profile")
  async getCurrentUserProfile(@Request() req: Request) {
    // ✅ Automatically requires authentication
    return { user: req.user };
  }
}
```

#### **Public Routes**

Use the `@Public()` decorator to opt-out of authentication:

```typescript
@Controller()
export class AppController {
  @Public() // ✅ Opt out of authentication
  @Get("health")
  getHealth() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Public() // ✅ Public Sentry test endpoint
  @Get("sentry-test")
  sentryTest(): string {
    // Test Sentry functionality
    return "Sentry test completed - check your dashboard!";
  }
}
```

### **Better Auth Integration**

#### **Hybrid Implementation**

The system uses `@thallesp/nestjs-better-auth` for seamless NestJS integration:

```typescript
// apps/api/src/app.module.ts
import { AuthModule, AuthGuard } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";

@Module({
  imports: [
    AuthModule.forRoot(auth, {
      disableExceptionFilter: false,
      disableTrustedOriginsCors: false,
      disableBodyParser: false,
    }),
  ],
})
```

#### **Better Auth Configuration**

```typescript
// apps/api/src/lib/auth.ts
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://codecave.tech",
    "https://www.codecave.tech",
    "https://api.codecave.tech",
  ],

  emailAndPassword: {
    enabled: false, // OAuth only
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
```

#### **Auth Route Handler**

```typescript
// apps/api/src/auth/auth.controller.ts
@Controller("api/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Public() // All auth routes are public
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.log(`Auth request: ${req.method} ${req.url}`);
      this.logger.log(`User-Agent: ${req.headers["user-agent"]}`);
      this.logger.log(`Origin: ${req.headers.origin}`);

      const handler = toNodeHandler(auth);
      return handler(req, res);
    } catch (error) {
      this.logger.error(`Auth error: ${error.message}`, error.stack);
      res.status(500).json({
        error: "Authentication failed",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
}
```

## 📊 **Sentry Integration**

### **Complete Error Tracking & Performance Monitoring**

#### **Sentry Initialization**

```typescript
// apps/api/src/instrument.ts
import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: "your-sentry-dsn-here",

  // Enable PII data collection
  sendDefaultPii: true,

  // Enable logging integration
  _experiments: {
    enableLogs: true,
  },

  // Console integration for automatic log capture
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ["log", "error", "warn"],
    }),
  ],
});
```

#### **Application Integration**

```typescript
// apps/api/src/main.ts
// IMPORTANT: Must be imported first
import "./instrument";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Required for Better Auth
  });

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`API Server running on port ${port}`);
}

bootstrap();
```

#### **Global Sentry Filter**

```typescript
// apps/api/src/app.module.ts
import { SentryModule, SentryGlobalFilter } from "@sentry/nestjs/setup";

@Module({
  imports: [
    SentryModule.forRoot(), // Sentry module
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter, // Global error capture
    },
  ],
})
export class AppModule {}
```

### **Sentry Features Implemented**

#### **Error Capture with Context**

```typescript
// apps/api/src/app.controller.ts
@Get("sentry-error")
sentryError(): void {
  try {
    throw new Error("This is a test error for Sentry!");
  } catch (error) {
    Sentry.captureException(error);
    throw error; // Re-throw to trigger the global filter
  }
}
```

#### **Custom Spans & Performance Monitoring**

```typescript
@Get("sentry-test")
sentryTest(): string {
  // Add breadcrumb for user journey tracking
  Sentry.addBreadcrumb({
    message: "Sentry test endpoint called",
    level: "info",
  });

  // Set custom tags for filtering
  Sentry.setTag("endpoint", "sentry-test");

  // Set context for additional metadata
  Sentry.setContext("test", {
    environment: "development",
    feature: "sentry-testing",
  });

  return "Sentry test completed - check your Sentry dashboard!";
}
```

#### **Performance Monitoring with Custom Spans**

```typescript
// Example: Custom span for business logic
async processUserData(userId: string) {
  return Sentry.startSpan({
    op: "http.server",
    name: "Process User Data",
  }, async (span) => {
    span.setAttribute("user.id", userId);
    span.setAttribute("operation", "user-processing");

    // Your business logic here
    const userData = await this.usersService.findById(userId);

    span.setStatus("ok");
    return userData;
  });
}
```

## 🗄️ **Database & ORM Implementation**

### **Prisma Setup**

#### **Global Prisma Module**

```typescript
// apps/api/src/prisma/prisma.module.ts
import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global() // Makes PrismaService available globally
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

#### **Prisma Service**

```typescript
// apps/api/src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### **Database Schema**

#### **Complete Data Model**

```prisma
// apps/api/prisma/schema.prisma

// Better Auth User Model with CodeCave extensions
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  emailVerified Boolean  @default(false)
  image         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // CodeCave-specific fields
  avatar         String?
  bio            String?
  website        String?
  location       String?
  company        String?
  skills         String[]     @default([])
  provider       AuthProvider @default(GITHUB)
  providerId     String?
  githubUsername String?
  projectsCount  Int          @default(0)
  followersCount Int          @default(0)
  followingCount Int          @default(0)
  isActive       Boolean      @default(true)
  isPro          Boolean      @default(false)

  // Relations
  sessions Session[]
  accounts Account[]
  projects Project[]
  comments Comment[]
  likes    Like[]
  followers Follow[] @relation("UserFollowers")
  following Follow[] @relation("UserFollowing")

  @@map("user")
}

// Complete project management system
model Project {
  id          String   @id @default(uuid())
  title       String
  description String?
  content     String?
  tags        String[] @default([])
  language    String?
  isPublic    Boolean  @default(true)
  viewCount   Int      @default(0)
  likeCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  authorId String
  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  comments Comment[]
  likes    Like[]

  @@map("projects")
}

// Social features
model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  authorId  String
  author    User    @relation(fields: [authorId], references: [id], onDelete: Cascade)
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("comments")
}

model Like {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([userId, projectId])
  @@map("likes")
}

model Follow {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())

  followerId  String
  follower    User   @relation("UserFollowing", fields: [followerId], references: [id], onDelete: Cascade)
  followingId String
  following   User   @relation("UserFollowers", fields: [followingId], references: [id], onDelete: Cascade)

  @@unique([followerId, followingId])
  @@map("follows")
}
```

## 👥 **User Management System**

### **User Service Implementation**

```typescript
// apps/api/src/users/users.service.ts
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
        followers: true,
        following: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(
    profile: OAuthProfile,
    provider: AuthProvider
  ): Promise<User> {
    const userData: CreateUserInput = {
      email: profile.email,
      name: profile.name,
      emailVerified: true, // OAuth users are email verified
      image: profile.avatar,
      avatar: profile.avatar,
      bio: profile.bio,
      website: profile.website,
      location: profile.location,
      company: profile.company,
      skills: [],
      provider,
      providerId: profile.id,
      githubUsername: profile.githubUsername,
    };

    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
```

### **User Controller**

```typescript
// apps/api/src/users/users.controller.ts
@Controller("users")
@UseGuards(AuthGuard) // Optional - already global
export class UsersController {
  @Get("profile")
  async getCurrentUserProfile(@Request() req: Request) {
    // req.user is automatically populated by auth guard
    return { user: req.user };
  }

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Put("profile")
  async updateProfile(
    @Request() req: Request,
    @Body() updateData: UpdateUserInput
  ) {
    return this.usersService.updateUser(req.user.id, updateData);
  }
}
```

### **Type Definitions**

```typescript
// apps/api/src/users/entities/user.entity.ts
import { User as PrismaUser } from "../../../generated/prisma";

export { AuthProvider } from "../../../generated/prisma";

export interface User extends PrismaUser {}

export type CreateUserInput = Omit<
  PrismaUser,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "projectsCount"
  | "followersCount"
  | "followingCount"
  | "isActive"
  | "isPro"
>;

export type UpdateUserInput = Partial<
  Omit<PrismaUser, "id" | "createdAt" | "updatedAt">
>;
```

```typescript
// apps/api/src/users/entities/oauth-profile.ts
export interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  company?: string;
  githubUsername?: string;
}
```

## 🐳 **Docker Implementation**

### **Multi-Stage Production Build**

```dockerfile
# apps/api/Dockerfile.prod
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@8.15.0

# Copy package files for dependency resolution
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/api/package*.json ./apps/api/

# Install ALL dependencies (including dev dependencies for build)
RUN pnpm install --filter @codecave/api --no-frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client before building
RUN cd apps/api && npx prisma generate --schema=./prisma/schema.prisma

# Build the API
RUN pnpm --filter @codecave/api build

# ===================================================
# Production Stage
FROM node:22-alpine AS production

WORKDIR /app

# Install system dependencies and pnpm
RUN apk add --no-cache curl && \
    npm install -g pnpm@8.15.0

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/api/package*.json ./apps/api/

# Install ONLY production dependencies
RUN pnpm install --filter @codecave/api --prod --no-frozen-lockfile

# Copy built application from builder stage
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/generated ./apps/api/generated
COPY --from=builder /app/apps/api/package*.json ./apps/api/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3001

# Health check for container monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["pnpm", "--filter", "@codecave/api", "start:prod"]
```

## 🔧 **Configuration & Environment**

### **CORS Configuration**

```typescript
// apps/api/src/main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true, // Required for cookies/session
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
```

### **Environment Validation**

```typescript
// apps/api/src/lib/auth.ts
const requiredEnvVars = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}
```

## 📡 **API Endpoints**

### **Public Endpoints**

```typescript
// Basic application endpoints
GET  /              # Hello world
GET  /health        # Health check with timestamp

// Sentry testing endpoints
GET  /sentry-test   # Test Sentry functionality
GET  /sentry-error  # Test error capture

// Authentication endpoints (handled by Better Auth)
POST /api/auth/sign-in/social  # Initiate OAuth flow
GET  /api/auth/callback/github # GitHub OAuth callback
GET  /api/auth/callback/google # Google OAuth callback
GET  /api/auth/session         # Get current session
POST /api/auth/sign-out        # Sign out user
```

### **Protected Endpoints**

```typescript
// User management (requires authentication)
GET  /users/profile  # Current user profile
GET  /users          # All users (development)
PUT  /users/profile  # Update user profile
```

## 📊 **Health Monitoring**

### **Health Check Endpoint**

```typescript
// apps/api/src/app.controller.ts
@Public()
@Get("health")
getHealth(): { status: string; timestamp: string } {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
  };
}
```

### **Enhanced Health Check (Future)**

```typescript
// Example of comprehensive health check
@Public()
@Get("health")
async getHealthDetailed() {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      meilisearch: await this.checkMeilisearch(),
      sentry: this.checkSentry(),
    },
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  };
}
```

## 🧪 **Testing Strategy**

### **Unit Testing**

```typescript
// Example test structure
describe("UsersService", () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should find user by id", async () => {
    const mockUser = { id: "1", email: "test@example.com" };
    jest.spyOn(prisma.user, "findUnique").mockResolvedValue(mockUser);

    const result = await service.findById("1");
    expect(result).toEqual(mockUser);
  });
});
```

### **Integration Testing**

```typescript
// Example E2E test
describe("AuthController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/health (GET)", () => {
    return request(app.getHttpServer())
      .get("/health")
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe("ok");
        expect(res.body.timestamp).toBeDefined();
      });
  });

  it("/api/auth/session (GET) - unauthenticated", () => {
    return request(app.getHttpServer()).get("/api/auth/session").expect(401);
  });
});
```

## 🔐 **Security Implementation**

### **Security Headers**

```typescript
// apps/api/src/main.ts
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Body parser configuration
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
}
```

### **Input Validation**

```typescript
// Example DTO with validation
import { IsEmail, IsString, IsOptional, MaxLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;
}
```

## 📈 **Performance Optimizations**

### **Database Query Optimization**

```typescript
// Efficient user queries with relations
async findUserWithProjects(id: string) {
  return this.prisma.user.findUnique({
    where: { id },
    include: {
      projects: {
        take: 10,
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          projects: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}
```

### **Caching Strategy** (Future Implementation)

```typescript
// Example Redis caching
@Injectable()
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}
```

## 🚀 **Future Enhancements**

### **Planned Features**

1. **Project Management API**
   - CRUD operations for projects
   - Project search and filtering
   - File upload integration

2. **Social Features API**
   - Comment system
   - Like/favorite functionality
   - User following system

3. **Advanced Authentication**
   - Role-based access control (RBAC)
   - API key authentication
   - Rate limiting per user

4. **Performance Features**
   - Redis caching layer
   - Database query optimization
   - Image optimization API

5. **Monitoring Enhancements**
   - Custom metrics with Prometheus
   - Advanced Sentry configuration
   - Performance profiling integration

### **Technical Debt & Improvements**

1. **Testing Coverage**
   - Increase unit test coverage to 90%+
   - Add comprehensive E2E tests
   - Integration test suite

2. **Documentation**
   - OpenAPI/Swagger integration
   - API documentation generation
   - Code documentation standards

3. **Performance**
   - Database indexing optimization
   - Query performance monitoring
   - Response time optimization

## 📚 **Additional Resources**

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Better Auth Documentation](https://better-auth.com/)
- [Sentry NestJS Integration](https://docs.sentry.io/platforms/node/guides/nestjs/)
- [Docker Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/)

---

**💡 Pro Tip**: The backend is designed with security and scalability in mind. All routes are protected by default, and the global auth guard ensures consistent authentication across the API.

**Last Updated**: January 2025
