import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { BetterAuthGuard } from "./guards/auth.guard";
import { UsersModule } from "../users/users.module";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [ConfigModule, UsersModule, PrismaModule],
  controllers: [AuthController],
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
