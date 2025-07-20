import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthProvider } from "../../users/entities/user.entity";

interface OAuthProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
}

interface GoogleProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  _json?: {
    bio?: string;
    url?: string;
    location?: string;
  };
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback
  ): Promise<void> {
    try {
      const oauthProfile = this.createOauthProfile(profile);

      const user = await this.authService.validateOAuthUser(
        oauthProfile,
        AuthProvider.GOOGLE
      );

      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }

  private createOauthProfile(profile: GoogleProfile): OAuthProfile {
    return this.buildOAuthProfile(profile);
  }

  private buildOAuthProfile(profile: GoogleProfile): OAuthProfile {
    return {
      id: profile.id,
      email: this.extractEmail(profile),
      name: profile.displayName,
      avatar: this.extractAvatar(profile),
      bio: this.extractBio(profile),
      website: this.extractWebsite(profile),
      location: this.extractLocation(profile),
    };
  }

  private extractEmail(profile: GoogleProfile): string {
    return profile.emails?.[0]?.value || "";
  }

  private extractAvatar(profile: GoogleProfile): string | undefined {
    return profile.photos?.[0]?.value;
  }

  private extractBio(profile: GoogleProfile): string {
    return profile._json?.bio;
  }

  private extractWebsite(profile: GoogleProfile): string {
    return profile._json?.url;
  }

  private extractLocation(profile: GoogleProfile): string {
    return profile._json?.location;
  }
}
