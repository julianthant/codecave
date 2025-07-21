import { Controller, Get } from "@nestjs/common";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { BetterAuthUser } from "../auth/interfaces/better-auth.interface";

@Controller("users")
export class UsersController {
  @Get("profile")
  async getCurrentUserProfile(@CurrentUser() user: BetterAuthUser) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        bio: user.bio,
        website: user.website,
        location: user.location,
        company: user.company,
        githubUsername: user.githubUsername,
        linkedinProfile: user.linkedinProfile,
        twitterHandle: user.twitterHandle,
        skills: user.skills,
        experience: user.experience,
        portfolioUrl: user.portfolioUrl,
      },
    };
  }
}
