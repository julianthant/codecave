import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthService } from "../auth.service";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class BetterAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublicRoute(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const sessionToken = this.extractSessionToken(request);

    if (!sessionToken) {
      throw new UnauthorizedException("No session token provided");
    }

    await this.validateAndAttachSession(request, sessionToken);
    return true;
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async validateAndAttachSession(
    request: Request,
    sessionToken: string
  ): Promise<void> {
    try {
      const session = await this.authService.verifySession(sessionToken);

      if (!session.data?.session || !session.data?.user) {
        throw new UnauthorizedException("Invalid session");
      }

      // Attach user and session to request object
      request["user"] = session.data.user;
      request["session"] = session.data.session;
    } catch (error) {
      throw new UnauthorizedException("Session verification failed");
    }
  }

  private extractSessionToken(request: Request): string | undefined {
    // Try Authorization header first
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    // Try cookie as fallback (Better Auth default cookie name)
    return request.cookies?.["better-auth.session_token"];
  }
}
