import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { BetterAuthUser } from "../auth/interfaces/auth.interface";

@Controller("users")
export class UsersController {
  @Get("profile")
  async getCurrentUserProfile(@CurrentUser() user: BetterAuthUser) {
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        location: user.location,
        company: user.company,
        githubUsername: user.githubUsername,
        skills: user.skills,
        projectsCount: user.projectsCount,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        isActive: user.isActive,
        isPro: user.isPro,
      },
    };
  }
}
