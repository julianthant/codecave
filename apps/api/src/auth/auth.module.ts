import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller"; // Use the main controller
import { BetterAuthController } from "./better-auth.controller";
import { BetterAuthGuard } from "./guards/better-auth.guard";
import { UsersModule } from "../users/users.module";
import { PrismaModule } from "../prisma/prisma.module";
import { BetterAuthModule } from "./better-auth.module";

@Module({
  imports: [ConfigModule, UsersModule, PrismaModule, BetterAuthModule],
  controllers: [AuthController, BetterAuthController],
  providers: [
    AuthService,
    BetterAuthGuard,
    {
      provide: APP_GUARD,
      useClass: BetterAuthGuard,
    },
  ],
  exports: [AuthService, BetterAuthGuard],
})
export class AuthModule {}
