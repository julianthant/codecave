import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./decorators/public.decorator";

/**
 * Legacy AuthController - Minimal implementation for backward compatibility
 * Better Auth handles most authentication endpoints now
 */
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * @deprecated Use Better Auth refresh endpoint
   */
  @Public()
  @Post("refresh")
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      if (!body.refreshToken) {
        throw new UnauthorizedException("Refresh token is required");
      }

      // Call the deprecated method
      const tokens = await this.authService.refreshToken();
      return { success: true, tokens };
    } catch (error) {
      console.error("Token refresh error:", error);
      throw new UnauthorizedException("Token refresh failed");
    }
  }

  /**
   * @deprecated Use Better Auth user endpoint
   */
  @Public()
  @Get("me")
  async getProfile() {
    throw new UnauthorizedException(
      "This endpoint is deprecated. Use Better Auth /api/auth/session endpoint instead."
    );
  }

  /**
   * @deprecated Use Better Auth logout endpoint
   */
  @Public()
  @Post("logout")
  async logout() {
    throw new UnauthorizedException(
      "This endpoint is deprecated. Use Better Auth /api/auth/sign-out endpoint instead."
    );
  }
}
