import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User, AuthProvider, CreateUserInput } from "./entities/user.entity";
import { OAuthProfile } from "../auth/interfaces/auth.interface";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByProviderAndId(
    provider: AuthProvider,
    providerId: string
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  async createUser(
    profile: OAuthProfile,
    provider: AuthProvider
  ): Promise<User> {
    const userData: CreateUserInput = {
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      bio: profile.bio,
      website: profile.website,
      location: profile.location,
      company: profile.company,
      skills: [],
      provider,
      providerId: profile.id,
      githubUsername: profile.githubUsername,
    };

    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.prisma.user.update({
      where: { id },
      data: updates,
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getUserStats(id: string): Promise<{
    projectsCount: number;
    followersCount: number;
    followingCount: number;
  }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      projectsCount: user.projectsCount,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    };
  }
}
