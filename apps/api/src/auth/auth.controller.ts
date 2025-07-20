import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // Supabase OAuth callback - handles all providers (GitHub, Google, LinkedIn)
  @Post("supabase/callback")
  async supabaseCallback(
    @Body() body: { access_token: string; refresh_token?: string }
  ) {
    try {
      if (!body.access_token) {
        throw new UnauthorizedException("Access token is required");
      }

      // Verify the Supabase token and get/create user
      const user = await this.authService.handleSupabaseAuth(body.access_token);

      // Generate your app's JWT tokens
      const tokens = await this.authService.generateAuthTokens(user);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        tokens,
      };
    } catch (error) {
      console.error("Supabase callback error:", error);
      throw new UnauthorizedException("Authentication failed");
    }
  }

  // Token refresh endpoint
  @Post("refresh")
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      if (!body.refreshToken) {
        throw new UnauthorizedException("Refresh token is required");
      }

      const tokens = await this.authService.refreshToken(body.refreshToken);
      return { success: true, tokens };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new UnauthorizedException("Token refresh failed");
    }
  }

  // Get current user info
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = req.user as User;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Logout endpoint
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request) {
    // For now, just return success since JWTs are stateless
    // In the future, you might want to implement token blacklisting
    return { success: true, message: "Logged out successfully" };
  }
}
