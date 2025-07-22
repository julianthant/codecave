import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { SentryModule, SentryGlobalFilter } from "@sentry/nestjs/setup";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { UsersModule } from "./users/users.module";
import { auth } from "./lib/auth";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SentryModule.forRoot(),
    PrismaModule,
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
    // Temporarily remove global auth guard to test basic functionality
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
})
export class AppModule {}
