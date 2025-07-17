import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as Sentry from '@sentry/nestjs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('sentry-test')
  sentryTest(): string {
    // Test Sentry functionality
    Sentry.addBreadcrumb({
      message: 'Sentry test endpoint called',
      level: 'info',
    });

    Sentry.setTag('endpoint', 'sentry-test');
    Sentry.setContext('test', {
      environment: 'development',
      feature: 'sentry-testing',
    });

    return 'Sentry test completed - check your Sentry dashboard!';
  }

  @Get('sentry-error')
  sentryError(): void {
    // Test error capture
    try {
      throw new Error('This is a test error for Sentry!');
    } catch (error) {
      Sentry.captureException(error);
      throw error; // Re-throw to trigger the global filter
    }
  }
} 