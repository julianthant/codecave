import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthProvider } from "../../users/entities/user.entity";

interface GitHubProfile {
  id: string;
  username: string;
  displayName: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  _json?: {
    bio?: string;
    blog?: string;
    location?: string;
    company?: string;
  };
}

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, "github") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID"),
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GITHUB_CALLBACK_URL"),
      scope: ["user:email", "read:user"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
    done: (error: Error | null, user?: Express.User | false) => void
  ): Promise<void> {
    try {
      const oauthProfile = {
        id: profile.id,
        email: profile.emails?.[0]?.value || "",
        name: profile.displayName || profile.username,
        avatar: profile.photos?.[0]?.value,
        bio: profile._json?.bio,
        website: profile._json?.blog,
        location: profile._json?.location,
        company: profile._json?.company,
        githubUsername: profile.username,
      };

      const user = await this.authService.validateOAuthUser(
        oauthProfile,
        AuthProvider.GITHUB
      );

      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
