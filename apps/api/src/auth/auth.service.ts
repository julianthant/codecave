/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

/**
 * Legacy AuthService - Minimal implementation for backward compatibility
 * Better Auth handles most authentication logic now
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
  ) {}

  /**
   * Validate user by ID - used for legacy endpoints
   * @param id User ID
   * @returns User entity
   */
  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user || !user.isActive) {
      throw new UnauthorizedException("User not found or inactive");
    }
    return user;
  }

  /**
   * @deprecated Use Better Auth for token refresh
   */
  async refreshToken(): Promise<any> {
    throw new Error(
      "JWT refresh token functionality is deprecated. Please use Better Auth for authentication."
    );
  }
}
