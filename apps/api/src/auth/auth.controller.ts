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
    const user = req.user as User;
    const tokens = await this.authService.generateAuthTokens(user);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;

    res.redirect(redirectUrl);
  }

  // Google OAuth routes
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // This route initiates the Google OAuth flow
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const tokens = await this.authService.generateAuthTokens(user);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;

    res.redirect(redirectUrl);
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
    const user = req.user as User;
    const tokens = await this.authService.generateAuthTokens(user);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const redirectUrl = `${frontendUrl}/auth/callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`;

    res.redirect(redirectUrl);
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
