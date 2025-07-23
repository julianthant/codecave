import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { SentryModule, SentryGlobalFilter } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule, AuthGuard } from "@thallesp/nestjs-better-auth";
import { UsersModule } from "./users/users.module";
import { auth } from "./lib/auth";
import { DatabaseRouterModule } from "./lib/database-router.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SentryModule.forRoot(),
    PrismaModule,
    DatabaseRouterModule,
    AuthModule.forRoot(auth, {
      disableExceptionFilter: false,
      disableTrustedOriginsCors: false,
      disableBodyParser: false,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
