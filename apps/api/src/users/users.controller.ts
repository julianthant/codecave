import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import type { Request as ExpressRequest } from 'express';

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  @Get("profile")
  async getCurrentUserProfile(@Request() req: ExpressRequest) {
    return { user: req.user };
  }
}

