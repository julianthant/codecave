/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { User, AuthProvider } from "../users/entities/user.entity";
import { JwtPayload, OAuthProfile } from "./interfaces/auth.interface";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private supabaseService: SupabaseService
  ) {}

  async validateOAuthUser(
    profile: OAuthProfile,
    provider: AuthProvider
  ): Promise<User> {
    try {
      console.log(`Validating OAuth user for ${provider}:`, profile);

      // Check if user exists by provider and ID
      let user = await this.usersService.findByProviderAndId(
        provider,
        profile.id
      );

      if (!user) {
        // Check if user exists by email (for linking accounts)
        const existingUser = await this.usersService.findByEmail(profile.email);

        if (existingUser) {
          console.log(
            `User exists with email ${profile.email} and provider ${existingUser.provider}`
          );
          // User exists with different provider - throw error to redirect with message
          const providerNames = {
            [AuthProvider.GITHUB]: "GitHub",
            [AuthProvider.GOOGLE]: "Google",
            [AuthProvider.LINKEDIN]: "LinkedIn",
          };

          const existingProviderName =
            providerNames[existingUser.provider] || existingUser.provider;
          const currentProviderName = providerNames[provider] || provider;

          throw new Error(
            `ACCOUNT_EXISTS_WITH_DIFFERENT_PROVIDER:${existingProviderName}:${currentProviderName}`
          );
        } else {
          console.log(`Creating new user for ${profile.email}`);
          // Create new user
          user = await this.usersService.createUser(profile, provider);
        }
      } else {
        console.log(
          `Updating existing user ${user.id} with latest profile info`
        );
        // Update existing user with latest profile info
        user = await this.usersService.updateUser(user.id, {
          name: profile.name,
          avatar: profile.avatar,
          bio: profile.bio,
          website: profile.website,
          location: profile.location,
          company: profile.company,
          githubUsername: profile.githubUsername,
          linkedinProfile: profile.linkedinProfile,
        });
      }

      // Update last login
      await this.usersService.updateLastLogin(user.id);

      console.log(`OAuth validation successful for user ${user.id}`);
      return user;
    } catch (error) {
      console.error(`OAuth validation error for ${provider}:`, error);
      throw error;
    }
  }

  async generateAuthTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "providerId">;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN", "24h"),
    });

    // Generate refresh token with longer expiration
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: "7d",
        secret: this.configService.get<string>(
          "JWT_REFRESH_SECRET",
          this.configService.get<string>("JWT_SECRET")
        ),
      }
    );

    // Remove sensitive data from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { providerId: _, ...userWithoutSensitiveData } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutSensitiveData,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive");
    }
    return user;
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>(
          "JWT_REFRESH_SECRET",
          this.configService.get<string>("JWT_SECRET")
        ),
      });

      const user = await this.validateUser(decoded.sub);
      const tokens = await this.generateAuthTokens(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async handleSupabaseAuth(accessToken: string): Promise<User> {
    try {
      const supabaseUser = await this.verifySupabaseToken(accessToken);

      const provider = this.getProviderFromSupabaseUser(supabaseUser);

      const user = await this.findOrCreateUser(supabaseUser, provider);

      return user;
    } catch (error) {
      console.error("Supabase auth error:", error);
      throw new UnauthorizedException("Supabase authentication failed");
    }
  }

  private async verifySupabaseToken(accessToken: string): Promise<any> {
    const supabaseUser =
      await this.supabaseService.verifySupabaseToken(accessToken);
    if (!supabaseUser) {
      throw new UnauthorizedException("Invalid Supabase token");
    }
    return supabaseUser;
  }

  private async findOrCreateUser(
    supabaseUser: any,
    provider: AuthProvider
  ): Promise<User> {
    let user = await this.usersService.findByEmail(supabaseUser.email);
    if (!user) {
      user = await this.createUser(supabaseUser, provider);
    } else {
      user = await this.updateUserIfNeeded(user, supabaseUser, provider);
    }
    return user;
  }

  private async createUser(
    supabaseUser: any,
    provider: AuthProvider
  ): Promise<User> {
    const profileData: OAuthProfile = this.extractProfileData(supabaseUser);
    return await this.usersService.createUser(profileData, provider);
  }

  private extractProfileData(supabaseUser: any): OAuthProfile {
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
    return (
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      supabaseUser.email
    );
  }

  private async updateUserIfNeeded(
    user: User,
    supabaseUser: any,
    provider: AuthProvider
  ): Promise<User> {
    if (user.provider !== provider || user.providerId !== supabaseUser.id) {
      return await this.usersService.updateUser(user.id, {
        provider,
        providerId: supabaseUser.id,
      });
    }
    return user;
  }

  private getProviderFromSupabaseUser(supabaseUser: any): AuthProvider {
    const identityProvider = this.getProviderFromIdentities(supabaseUser);
    if (identityProvider) return identityProvider;

    const metadataProvider = this.getProviderFromMetadata(supabaseUser);
    if (metadataProvider) return metadataProvider;

    return AuthProvider.GITHUB; // Default fallback
  }

  private getProviderFromIdentities(supabaseUser: any): AuthProvider | null {
    if (supabaseUser.identities && supabaseUser.identities.length > 0) {
      const identity = supabaseUser.identities[0];
      return this.mapProvider(identity.provider);
    }
    return null;
  }

  private getProviderFromMetadata(supabaseUser: any): AuthProvider | null {
    if (supabaseUser.app_metadata?.provider) {
      return this.mapProvider(supabaseUser.app_metadata.provider);
    }
    return null;
  }

  private mapProvider(provider: string): AuthProvider {
    switch (provider) {
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
