import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { auth } from "./better-auth.config";
import { Public } from "./decorators/public.decorator";

@Controller("api/auth")
export class AuthController {
  @Public() // Allow public access to auth endpoints
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    return auth.handler(req, res);
  }
}
