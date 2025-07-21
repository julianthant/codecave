import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { BetterAuthService } from "./better-auth.service";
import { Public } from "./decorators/public.decorator";

@Controller("api/auth")
export class BetterAuthController {
  constructor(private betterAuthService: BetterAuthService) {}

  @Public()
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const auth = this.betterAuthService.getAuth();
    return auth.handler(req, res);
  }
}
