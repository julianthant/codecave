import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller"; // Use the main controller
import { UsersModule } from "../users/users.module";
import { PrismaModule } from "../prisma/prisma.module";
import { SupabaseModule } from "../supabase/supabase.module";

// Strategies
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SupabaseStrategy } from "./strategies/supabase.strategy";

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    PrismaModule,
    SupabaseModule,
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
    SupabaseStrategy,
    // Removed individual OAuth strategies since we're using Supabase
  ],
  exports: [AuthService],
})
export class AuthModule {}
