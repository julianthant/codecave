import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { User } from "../users/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // GitHub OAuth routes
  @Get("github")
  @UseGuards(AuthGuard("github"))
  async githubAuth() {
    // This route initiates the GitHub OAuth flow
  }

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    try {
      console.log("GitHub callback - req.user:", req.user);

      if (!req.user) {
        console.error("No user found in request");
        throw new Error("No user found in request");
      }

      const user = req.user as User;
      console.log("Generating tokens for user:", user.id);

      const tokens = await this.authService.generateAuthTokens(user);
      console.log("Tokens generated successfully");

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;

      console.log("Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("GitHub callback error:", error);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      let errorUrl;

      // Check if it's the specific "account exists with different provider" error
      if (
        error.message &&
        error.message.startsWith("ACCOUNT_EXISTS_WITH_DIFFERENT_PROVIDER:")
      ) {
        const [, existingProvider, attemptedProvider] =
          error.message.split(":");
        errorUrl = `${frontendUrl}/auth/callback?error=account_exists&existing_provider=${existingProvider}&attempted_provider=${attemptedProvider}`;
      } else {
        errorUrl = `${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message || "Authentication failed")}`;
      }

      res.redirect(errorUrl);
    }
  } // Google OAuth routes
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // This route initiates the Google OAuth flow
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    try {
      console.log("Google callback - req.user:", req.user);

      if (!req.user) {
        console.error("No user found in request");
        throw new Error("No user found in request");
      }

      const user = req.user as User;
      console.log("Generating tokens for user:", user.id);

      const tokens = await this.authService.generateAuthTokens(user);
      console.log("Tokens generated successfully");

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;

      console.log("Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("Google callback error:", error);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      let errorUrl;

      // Check if it's the specific "account exists with different provider" error
      if (
        error.message &&
        error.message.startsWith("ACCOUNT_EXISTS_WITH_DIFFERENT_PROVIDER:")
      ) {
        const [, existingProvider, attemptedProvider] =
          error.message.split(":");
        errorUrl = `${frontendUrl}/auth/callback?error=account_exists&existing_provider=${existingProvider}&attempted_provider=${attemptedProvider}`;
      } else {
        errorUrl = `${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message || "Authentication failed")}`;
      }

      res.redirect(errorUrl);
    }
  }

  // LinkedIn OAuth routes
  @Get("linkedin")
  @UseGuards(AuthGuard("linkedin"))
  async linkedinAuth() {
    // This route initiates the LinkedIn OAuth flow
  }

  @Get("linkedin/callback")
  @UseGuards(AuthGuard("linkedin"))
  async linkedinCallback(@Req() req: Request, @Res() res: Response) {
    try {
      console.log("LinkedIn callback - req.user:", req.user);

      if (!req.user) {
        console.error("No user found in request");
        throw new Error("No user found in request");
      }

      const user = req.user as User;
      console.log("Generating tokens for user:", user.id);

      const tokens = await this.authService.generateAuthTokens(user);
      console.log("Tokens generated successfully");

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;

      console.log("Redirecting to:", redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error("LinkedIn callback error:", error);

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      let errorUrl;

      // Check if it's the specific "account exists with different provider" error
      if (
        error.message &&
        error.message.startsWith("ACCOUNT_EXISTS_WITH_DIFFERENT_PROVIDER:")
      ) {
        const [, existingProvider, attemptedProvider] =
          error.message.split(":");
        errorUrl = `${frontendUrl}/auth/callback?error=account_exists&existing_provider=${existingProvider}&attempted_provider=${attemptedProvider}`;
      } else {
        errorUrl = `${frontendUrl}/auth/callback?error=${encodeURIComponent(error.message || "Authentication failed")}`;
      }

      res.redirect(errorUrl);
    }
  }

  // Token refresh endpoint
  @Post("refresh")
  async refreshToken(@Body("refreshToken") refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is required");
    }

    return this.authService.refreshToken(refreshToken);
  }

  // Get current user profile
  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  // Logout endpoint
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Res() res: Response) {
    // For JWT, logout is typically handled on the frontend by removing tokens
    // You could implement token blacklisting here if needed
    res.json({ message: "Logged out successfully" });
  }
}
