import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { PrismaModule } from "../prisma/prisma.module";

// Strategies
import { JwtStrategy } from "./strategies/jwt.strategy";
import { GitHubStrategy } from "./strategies/github.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { LinkedInStrategy } from "./strategies/linkedin.strategy";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "24h"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GitHubStrategy,
    GoogleStrategy,
    LinkedInStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
