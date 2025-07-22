import { Controller, All, Req, Res } from "@nestjs/common";
import { Public } from "@thallesp/nestjs-better-auth";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import type { Request as ExpressRequest } from "express";
import type { Response as ExpressResponse } from "express";

@Controller("api/auth")
export class AuthController {
  @Public() // Mark all auth routes as public
  @All("*")
  async handleAuth(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const handler = toNodeHandler(auth);
    return handler(req, res);
  }
}
