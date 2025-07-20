import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthProvider } from "../../users/entities/user.entity";

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
      const oauthProfile = {
        id: profile.id,
        email: profile.emails?.[0]?.value || "",
        name: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        bio: profile._json?.bio,
        website: profile._json?.url,
        location: profile._json?.location,
      };

      const user = await this.authService.validateOAuthUser(
        oauthProfile,
        AuthProvider.GOOGLE
      );

      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
