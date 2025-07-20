/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { SupabaseService } from "../../supabase/supabase.service";
import { UsersService } from "../../users/users.service";
import { AuthProvider } from "../../users/entities/user.entity";
import { OAuthProfile } from "../interfaces/auth.interface";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, "supabase") {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
    private usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("SUPABASE_JWT_SECRET"), // You'll need this from Supabase
      passReqToCallback: true,
    });
  }

  async validate(req: any) {
    try {
      const token = this.extractToken(req);
      const supabaseUser = await this.verifyTokenWithSupabase(token);
      const user = await this.findOrCreateUser(supabaseUser);
      return user;
    } catch (error) {
      throw new UnauthorizedException("Token validation failed");
    }
  }

  private extractToken(req: any): string {
    // Extract the token from the request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }
    return token;
  }

  private async verifyTokenWithSupabase(token: string): Promise<any> {
    // Verify with Supabase
    const supabaseUser = await this.supabaseService.verifySupabaseToken(token);

    if (!supabaseUser) {
      throw new UnauthorizedException("Invalid token");
    }
    return supabaseUser;
  }

  private async findOrCreateUser(supabaseUser: any): Promise<any> {
    let user = await this.usersService.findByEmail(supabaseUser.email);

    if (!user) {
      const provider = this.getProviderFromSupabaseUser(supabaseUser);
      const profile = this.convertSupabaseUserToProfile(supabaseUser);

      user = await this.usersService.createUser(profile, provider);
    }
    return user;
  }

  private convertSupabaseUserToProfile(supabaseUser: any): OAuthProfile {
    return this.extractOAuthProfile(supabaseUser);
  }

  private extractOAuthProfile(supabaseUser: any): OAuthProfile {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: this.extractName(supabaseUser),
      avatar: supabaseUser.user_metadata?.avatar_url,
      bio: supabaseUser.user_metadata?.bio,
      website: supabaseUser.user_metadata?.website,
      location: supabaseUser.user_metadata?.location,
      company: supabaseUser.user_metadata?.company,
      githubUsername: supabaseUser.user_metadata?.user_name,
      linkedinProfile: supabaseUser.user_metadata?.linkedin_profile,
    };
  }

  private extractName(supabaseUser: any): string {
    return supabaseUser.user_metadata?.full_name || supabaseUser.email;
  }

  private getProviderFromSupabaseUser(supabaseUser: any): AuthProvider {
    // Check identities array for the provider
    if (supabaseUser.identities && supabaseUser.identities.length > 0) {
      const identity = supabaseUser.identities[0];
      return this.mapProvider(identity.provider);
    }

    // Check app_metadata for provider
    if (supabaseUser.app_metadata?.provider) {
      return this.mapProvider(supabaseUser.app_metadata.provider);
    }

    // Default fallback
    return AuthProvider.GITHUB;
  }

  private mapProvider(provider: string): AuthProvider {
    switch (provider.toLowerCase()) {
      case "github":
        return AuthProvider.GITHUB;
      case "google":
        return AuthProvider.GOOGLE;
      case "linkedin":
        return AuthProvider.LINKEDIN;
      default:
        return AuthProvider.GITHUB; // Default fallback
    }
  }
}
