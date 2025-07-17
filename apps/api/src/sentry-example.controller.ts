import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

@Controller('sentry-examples')
export class SentryExampleController {
  
  @Get('custom-span/:userId')
  async getUserWithSpan(@Param('userId') userId: string) {
    return Sentry.startSpan(
      {
        op: "http.server",
        name: `GET /sentry-examples/custom-span/${userId}`,
      },
      async (span) => {
        const metric = Math.random() * 100;
        
        // Add attributes to the span
        span.setAttribute("userId", userId);
        span.setAttribute("responseTime", metric);
        span.setAttribute("endpoint", "getUserWithSpan");

        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, metric));

        return {
          userId,
          data: `User data for ${userId}`,
          responseTime: metric,
          timestamp: new Date().toISOString(),
        };
      },
    );
  }

  @Post('process-data')
  async processDataWithTracing(@Body() data: any) {
    return Sentry.startSpan(
      {
        op: "business.logic",
        name: "Process User Data",
      },
      async (span) => {
        const processingTime = Math.random() * 500;
        
        span.setAttribute("dataSize", JSON.stringify(data).length);
        span.setAttribute("processingTime", processingTime);
        span.setAttribute("operation", "processData");

        // Add breadcrumb for tracking
        Sentry.addBreadcrumb({
          message: 'Processing user data',
          level: 'info',
          data: { dataSize: JSON.stringify(data).length }
        });

        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, processingTime));

        return {
          success: true,
          processedData: data,
          processingTime,
          timestamp: new Date().toISOString(),
        };
      },
    );
  }

  @Get('logger-examples')
  loggerExamples() {
    const { logger } = Sentry;
    const userId = 'user_123';
    const orderId = 'order_456';

    // Various log levels as shown in cursor rules
    logger.trace("Starting database connection", { database: "users" });
    logger.debug(logger.fmt`Cache miss for user: ${userId}`);
    logger.info("Updated profile", { profileId: 345 });
    logger.warn("Rate limit reached for endpoint", {
      endpoint: "/api/sentry-examples/",
      isEnterprise: false,
    });
    logger.error("Failed to process payment", {
      orderId,
      amount: 99.99,
    });

    return {
      message: "Logger examples executed - check Sentry logs!",
      timestamp: new Date().toISOString(),
    };
  }

  @Get('exception-test')
  testExceptionCapture() {
    try {
      // Simulate an error
      throw new Error('This is a test exception for Sentry capture');
    } catch (error) {
      // Capture the exception with additional context
      Sentry.withScope((scope) => {
        scope.setTag('errorType', 'test');
        scope.setContext('errorDetails', {
          endpoint: '/sentry-examples/exception-test',
          userAgent: 'test-agent',
          timestamp: new Date().toISOString(),
        });
        Sentry.captureException(error);
      });

      return {
        message: 'Exception captured and sent to Sentry',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('breadcrumbs-demo')
  breadcrumbsDemo() {
    // Add multiple breadcrumbs to track user journey
    Sentry.addBreadcrumb({
      message: 'User started breadcrumbs demo',
      level: 'info',
      category: 'user.action',
    });

    Sentry.addBreadcrumb({
      message: 'Processing demo request',
      level: 'info',
      category: 'system.process',
      data: { step: 1 }
    });

    Sentry.addBreadcrumb({
      message: 'Demo processing completed',
      level: 'info',
      category: 'system.complete',
      data: { step: 2, success: true }
    });

    return {
      message: 'Breadcrumbs demo completed',
      breadcrumbsAdded: 3,
      timestamp: new Date().toISOString(),
    };
  }
} 