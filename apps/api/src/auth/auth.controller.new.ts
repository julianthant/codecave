import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.config";
import { Public } from "./decorators/public.decorator";

/**
 * AuthController - Handles Better Auth endpoints using proper Node.js handler
 */
@Controller("auth")
export class AuthController {
  /**
   * Better Auth main handler - handles all auth routes using toNodeHandler
   * This is the recommended way per Better Auth documentation
   */
  @Public()
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return toNodeHandler(auth)(req, res);
  }
}
