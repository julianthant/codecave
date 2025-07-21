/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { SessionResponse } from "./interfaces/better-auth.interface";

@Injectable()
export class BetterAuthService {
  private auth: any;

  constructor(private configService: ConfigService) {
    this.auth = betterAuth({
      database: new Pool({
        connectionString: this.configService.get<string>("DATABASE_URL"),
      }),
      socialProviders: {
        github: {
          clientId: this.configService.get<string>("GITHUB_CLIENT_ID") || "",
          clientSecret:
            this.configService.get<string>("GITHUB_CLIENT_SECRET") || "",
        },
        google: {
          clientId: this.configService.get<string>("GOOGLE_CLIENT_ID") || "",
          clientSecret:
            this.configService.get<string>("GOOGLE_CLIENT_SECRET") || "",
        },
      },
      user: {
        additionalFields: {
          bio: {
            type: "string",
            required: false,
          },
          website: {
            type: "string",
            required: false,
          },
          location: {
            type: "string",
            required: false,
          },
          company: {
            type: "string",
            required: false,
          },
          githubUsername: {
            type: "string",
            required: false,
          },
          twitterHandle: {
            type: "string",
            required: false,
          },
          skills: {
            type: "string",
            required: false,
          },
          experience: {
            type: "string",
            required: false,
          },
          portfolioUrl: {
            type: "string",
            required: false,
          },
        },
      },
      secret:
        this.configService.get<string>("BETTER_AUTH_SECRET") ||
        "fallback-secret-for-development-only",
      baseURL:
        this.configService.get<string>("BETTER_AUTH_URL") ||
        "http://localhost:3000",
    });
  }

  getAuth(): any {
    return this.auth;
  }

  async verifySession(token: string): Promise<SessionResponse> {
    return this.auth.api.getSession({
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
}
