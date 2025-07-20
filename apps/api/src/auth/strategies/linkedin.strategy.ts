import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-linkedin-oauth2";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";
import { AuthProvider } from "../../users/entities/user.entity";

interface LinkedInProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  _json?: {
    summary?: string;
    siteStandardProfileRequest?: { url: string };
    location?: { name: string };
    positions?: {
      _total: number;
      values?: Array<{
        company?: { name: string };
      }>;
    };
    publicProfileUrl?: string;
  };
}

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, "linkedin") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get<string>("LINKEDIN_CLIENT_ID"),
      clientSecret: configService.get<string>("LINKEDIN_CLIENT_SECRET"),
      callbackURL: configService.get<string>("LINKEDIN_CALLBACK_URL"),
      scope: ["r_emailaddress", "r_liteprofile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: LinkedInProfile,
    done: (error: Error | null, user?: Express.User | false) => void
  ): Promise<void> {
    try {
      const oauthProfile = this.extractOAuthProfile(profile);
      const user = await this.authService.validateOAuthUser.call(
        this,
        oauthProfile,
        AuthProvider.LINKEDIN
      );
      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }

  private extractOAuthProfile(profile: LinkedInProfile) {
    const email = this.extractEmail(profile);
    const company = this.extractCompany(profile);
    const website = this.extractWebsite(profile);
    const location = this.extractLocation(profile);

    return {
      id: profile.id,
      email: email,
      name: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      bio: profile._json?.summary,
      website: website,
      location: location,
      company: company,
      linkedinProfile: profile._json?.publicProfileUrl,
    };
  }

  private extractEmail(profile: LinkedInProfile): string {
    return profile.emails?.[0]?.value || "";
  }

  private extractCompany(profile: LinkedInProfile): string | undefined {
    return profile._json?.positions && profile._json.positions._total > 0
      ? profile._json.positions.values?.[0]?.company?.name
      : undefined;
  }

  private extractWebsite(profile: LinkedInProfile): string | undefined {
    return profile._json?.siteStandardProfileRequest?.url;
  }

  private extractLocation(profile: LinkedInProfile): string | undefined {
    return profile._json?.location?.name;
  }
}
