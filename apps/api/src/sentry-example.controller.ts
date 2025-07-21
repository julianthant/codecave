import { Controller, Get } from "@nestjs/common";

@Controller("sentry")
export class SentryExampleController {
  @Get("test-error")
  testError(): Record<string, unknown> {
    throw new Error("This is a test error for Sentry");
  }

  @Get("test-success")
  testSuccess(): Record<string, unknown> {
    return { message: "Sentry is working correctly" };
  }
}
