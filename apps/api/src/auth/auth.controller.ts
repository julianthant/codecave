import { Controller, All, Req, Res, Logger } from "@nestjs/common";
import { Public } from "@thallesp/nestjs-better-auth";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import type { Request as ExpressRequest } from "express";
import type { Response as ExpressResponse } from "express";

@Controller("api/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @Public() // Mark all auth routes as public
  @All("*")
  async handleAuth(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    try {
      this.logger.log(`Auth request: ${req.method} ${req.url}`);
      this.logger.log(`User-Agent: ${req.headers["user-agent"]}`);
      this.logger.log(`Origin: ${req.headers.origin}`);

      const handler = toNodeHandler(auth);
      return handler(req, res);
    } catch (error) {
      this.logger.error(`Auth error: ${error.message}`, error.stack);
      res.status(500).json({
        error: "Authentication failed",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Internal server error",
      });
    }
  }
}
