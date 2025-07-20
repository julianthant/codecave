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
      const oauthProfile = this.createOAuthProfile(profile);
      const user = await this.authService.validateOAuthUser.call(
        this,
        oauthProfile,
        AuthProvider.GITHUB
      );

      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }

  private createOAuthProfile(profile: GitHubProfile) {
    return {
      id: profile.id,
      email: this.extractEmail(profile),
      name: this.extractName(profile),
      avatar: this.extractAvatar(profile),
      bio: this.extractBio(profile),
      website: this.extractWebsite(profile),
      location: this.extractLocation(profile),
      company: this.extractCompany(profile),
      githubUsername: profile.username,
    };
  }

  private extractEmail(profile: GitHubProfile): string {
    return profile.emails?.[0]?.value || "";
  }

  private extractName(profile: GitHubProfile): string {
    return profile.displayName || profile.username;
  }

  private extractAvatar(profile: GitHubProfile): string {
    return profile.photos?.[0]?.value || undefined;
  }

  private extractBio(profile: GitHubProfile): string {
    return profile._json?.bio || undefined;
  }

  private extractWebsite(profile: GitHubProfile): string {
    return profile._json?.blog || undefined;
  }

  private extractLocation(profile: GitHubProfile): string {
    return profile._json?.location || undefined;
  }

  private extractCompany(profile: GitHubProfile): string {
    return profile._json?.company || undefined;
  }
}
