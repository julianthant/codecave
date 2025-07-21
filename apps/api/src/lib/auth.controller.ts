import { Controller, Get, All, Request, Response, } from '@nestjs/common';
import { Public } from '@thallesp/nestjs-better-auth';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth';
import type { Request as ExpressRequest } from 'express';
import type { Response as ExpressResponse } from 'express';


@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService<typeof auth>) {}
  
  @Get('test')
  @Public()
  async testAuth() {
    return { status: 'Auth controller is working!' };
  }

  
  @All('*')
  @Public()
  async handleAuth(@Request() req: ExpressRequest,@Response() res: ExpressResponse) {
  
    // Extract path after /api/auth
    const path = req.url.replace(/^\/api\/auth\/?/, '');
    
    try {
      // Pass request to better-auth
      const response = await auth.handleRequest({
        method: req.method,
        url: `/${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`,
        headers: fromNodeHeaders(req.headers as Record<string, string>),
        body: req.body || {},
      });
      
      // Set response headers
      Object.entries(response.headers).forEach(([key, value]) => {
        if (value !== undefined) {
          res.setHeader(key, value as string | string[]);
        }
      });
      
      // Send response
      return res.status(response.status).send(response.body);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({
        message: 'Authentication service error',
        error: error.message,
      });
    }
  }
} 