import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { User, AuthProvider } from "../users/entities/user.entity";
import { JwtPayload, OAuthProfile } from "./interfaces/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
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
}
