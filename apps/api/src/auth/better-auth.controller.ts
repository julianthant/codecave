import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { BetterAuthService } from "./better-auth.service";
import { Public } from "./decorators/public.decorator";

@Controller("auth")
export class BetterAuthController {
  constructor(private betterAuthService: BetterAuthService) {}

  @Public()
  @All("*")
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Convert Express request to Better Auth request format
    const url = new URL(req.url, `${req.protocol}://${req.get("host")}`);
    const betterAuthRequest = new Request(url, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const auth = this.betterAuthService.getAuth();
    const response = await auth.handler(betterAuthRequest);

    // Convert Better Auth response to Express response
    res.status(response.status);

    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    const responseText = await response.text();
    return res.send(responseText);
  }
}
