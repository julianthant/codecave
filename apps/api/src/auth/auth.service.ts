/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { auth } from "./auth.config";
import { SessionResponse } from "./interfaces/auth.interface";

@Injectable()
export class AuthService {
  getAuth(): any {
    return auth;
  }

  async verifySession(token: string): Promise<SessionResponse> {
    try {
      const session = await auth.api.getSession({
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      });

      return {
        data: session,
        error: undefined,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
