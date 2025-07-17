# CodeCave API

NestJS API application with Sentry monitoring and error tracking.

## Sentry Configuration

This API is configured with Sentry for comprehensive monitoring, error tracking, and performance monitoring.

### Setup

The Sentry SDK is initialized in `src/instrument.ts` and imported at the top of `src/main.ts` to ensure early initialization.

### Configuration Files

- `src/instrument.ts` - Sentry initialization with DSN and configuration
- `src/main.ts` - Main application entry point with Sentry import
- `src/app.module.ts` - Module configuration with SentryModule and global filter

### Features Enabled

- **Error Capture**: Automatic exception capture via global filter
- **Performance Monitoring**: Custom spans for API endpoints
- **Logging**: Structured logging with Sentry integration
- **Breadcrumbs**: User journey tracking
- **Console Integration**: Automatic console.log, console.error, console.warn capture

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start:prod
```

## API Endpoints

### Basic Endpoints

- `GET /` - Hello world endpoint
- `GET /health` - Health check endpoint

### Sentry Test Endpoints

- `GET /sentry-test` - Basic Sentry functionality test
- `GET /sentry-error` - Error capture test

### Sentry Examples

- `GET /sentry-examples/custom-span/:userId` - Custom span instrumentation demo
- `POST /sentry-examples/process-data` - Business logic tracing demo
- `GET /sentry-examples/logger-examples` - Structured logging demo
- `GET /sentry-examples/exception-test` - Exception capture with context
- `GET /sentry-examples/breadcrumbs-demo` - Breadcrumbs tracking demo

## Sentry Features Demonstrated

### Custom Spans
```typescript
Sentry.startSpan({
  op: "http.server",
  name: "API Operation",
}, (span) => {
  span.setAttribute("key", "value");
  // Your code here
});
```

### Exception Capture
```typescript
try {
  // Code that might throw
} catch (error) {
  Sentry.captureException(error);
}
```

### Structured Logging
```typescript
const { logger } = Sentry;
logger.info("Operation completed", { userId: 123 });
logger.error("Operation failed", { error: "details" });
```

### Breadcrumbs
```typescript
Sentry.addBreadcrumb({
  message: 'User action performed',
  level: 'info',
  category: 'user.action',
});
```

## Environment

The application runs on port `3001` by default. 