# 🔥 Blackfire Continuous Profiler Setup for CodeCave API

This guide will help you set up Blackfire continuous profiling for the CodeCave API to monitor performance, identify bottlenecks, and optimize your application.

## 📋 Prerequisites

1. **Blackfire Account**: Sign up at [blackfire.io](https://blackfire.io)
2. **Blackfire Agent**: Install the Blackfire Agent on your server/machine
3. **Node.js Environment**: Ensure you're running Node.js 14+ 

## 🚀 Quick Setup

### 1. Install Blackfire Agent

**For macOS (using Homebrew):**
```bash
brew install blackfire-agent
```

**For Ubuntu/Debian:**
```bash
wget -qO- https://packages.blackfire.io/gpg.key | sudo apt-key add -
echo "deb https://packages.blackfire.io/debian any main" | sudo tee /etc/apt/sources.list.d/blackfire.list
sudo apt-get update
sudo apt-get install blackfire-agent
```

**For Docker:**
```dockerfile
FROM node:18-alpine
RUN apk add --no-cache wget
RUN wget -O - https://packages.blackfire.io/gpg.key | apk add --allow-untrusted - \
    && echo "https://packages.blackfire.io/alpine/any/main" >> /etc/apk/repositories \
    && apk add --no-cache blackfire-agent
```

### 2. Configure Blackfire Agent

Create or update your Blackfire Agent configuration:

```bash
# /etc/blackfire/agent
[agent]
server-id=your-server-id
server-token=your-server-token
```

Start the Blackfire Agent:
```bash
sudo systemctl start blackfire-agent
sudo systemctl enable blackfire-agent
```

### 3. Configure Environment Variables

Update your `.env` file with Blackfire settings:

```env
# Blackfire Continuous Profiler
BLACKFIRE_ENABLED=true
BLACKFIRE_APP_NAME=codecave-api-production
BLACKFIRE_DURATION_MILLIS=45000
BLACKFIRE_CPU_PROFILE_RATE=100
BLACKFIRE_UPLOAD_TIMEOUT_MILLIS=10000
```

### 4. Install Dependencies

The Blackfire package is already installed in your project:

```bash
# Already installed via pnpm add @blackfireio/node-tracing
```

## 🔧 Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BLACKFIRE_ENABLED` | `false` | Enable/disable Blackfire profiling |
| `BLACKFIRE_APP_NAME` | `codecave-api` | Application name in Blackfire dashboard |
| `BLACKFIRE_DURATION_MILLIS` | `45000` | Profiling session duration (milliseconds) |
| `BLACKFIRE_CPU_PROFILE_RATE` | `100` | CPU sampling rate (Hz) |
| `BLACKFIRE_UPLOAD_TIMEOUT_MILLIS` | `10000` | Upload timeout (milliseconds) |

### Advanced Configuration

You can customize the profiler configuration in `src/instrument.ts`:

```typescript
const blackfireConfig = {
  appName: process.env.BLACKFIRE_APP_NAME || 'codecave-api',
  durationMillis: parseInt(process.env.BLACKFIRE_DURATION_MILLIS || '45000'),
  cpuProfileRate: parseInt(process.env.BLACKFIRE_CPU_PROFILE_RATE || '100'),
  uploadTimeoutMillis: parseInt(process.env.BLACKFIRE_UPLOAD_TIMEOUT_MILLIS || '10000'),
  labels: {
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
    service: 'codecave-api',
    instance: process.env.HOSTNAME || 'unknown'
  }
};
```

## 🧪 Testing the Setup

### 1. Run the Example Application

Test Blackfire with the provided example:

```bash
cd apps/api
BLACKFIRE_ENABLED=true node blackfire-example.js
```

Visit the test endpoints:
- `http://localhost:3002/` - Basic CPU-intensive operation
- `http://localhost:3002/heavy-computation` - Heavy computation test
- `http://localhost:3002/memory-test` - Memory allocation test
- `http://localhost:3002/health` - Health check

### 2. Run Your NestJS Application

Start your main application with profiling enabled:

```bash
# Development
BLACKFIRE_ENABLED=true pnpm run dev

# Production
NODE_ENV=production BLACKFIRE_ENABLED=true pnpm run start:prod
```

## 📊 Monitoring and Analysis

### Blackfire Dashboard

1. Visit your [Blackfire dashboard](https://blackfire.io/dashboard)
2. Navigate to your application profiles
3. Analyze performance data, flame graphs, and bottlenecks

### Key Metrics to Monitor

- **CPU Usage**: Identify CPU-intensive functions
- **Memory Allocation**: Track memory usage patterns  
- **I/O Operations**: Monitor database and external API calls
- **Function Call Trees**: Understand execution flow
- **Performance Trends**: Track improvements over time

## 🚀 Production Deployment

### Docker Setup

Add Blackfire to your Dockerfile:

```dockerfile
FROM node:18-alpine

# Install Blackfire Agent
RUN apk add --no-cache wget \
    && wget -O - https://packages.blackfire.io/gpg.key | apk add --allow-untrusted - \
    && echo "https://packages.blackfire.io/alpine/any/main" >> /etc/apk/repositories \
    && apk add --no-cache blackfire-agent

# Copy your application
COPY . /app
WORKDIR /app

# Install dependencies
RUN npm install

# Start both agent and application
CMD ["sh", "-c", "blackfire-agent --config=/etc/blackfire/agent & npm run start:prod"]
```

### Environment-Specific Configuration

**Development:**
```env
BLACKFIRE_ENABLED=false  # Usually disabled in dev
BLACKFIRE_APP_NAME=codecave-api-dev
```

**Staging:**
```env
BLACKFIRE_ENABLED=true
BLACKFIRE_APP_NAME=codecave-api-staging
BLACKFIRE_DURATION_MILLIS=30000
```

**Production:**
```env
BLACKFIRE_ENABLED=true
BLACKFIRE_APP_NAME=codecave-api-production
BLACKFIRE_DURATION_MILLIS=60000
BLACKFIRE_CPU_PROFILE_RATE=50  # Lower rate for production
```

## 🔒 Security Considerations

1. **Environment Variables**: Keep Blackfire credentials secure
2. **Agent Configuration**: Restrict access to Blackfire agent configuration
3. **Network Security**: Ensure secure communication with Blackfire servers
4. **Data Privacy**: Review what data is being profiled and sent

## 🐛 Troubleshooting

### Common Issues

**Blackfire Agent Not Running:**
```bash
sudo systemctl status blackfire-agent
sudo systemctl start blackfire-agent
```

**Connection Issues:**
- Verify server-id and server-token
- Check network connectivity to Blackfire servers
- Review agent logs: `tail -f /var/log/blackfire/agent.log`

**Profiling Not Working:**
- Ensure `BLACKFIRE_ENABLED=true`
- Check application logs for Blackfire initialization messages
- Verify the agent is accepting connections

### Debug Mode

Enable debug logging:

```typescript
// In instrument.ts
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 Blackfire config:', blackfireConfig);
}
```

## 📚 Additional Resources

- [Blackfire Documentation](https://docs.blackfire.io/)
- [Node.js Profiling Guide](https://docs.blackfire.io/integrations/paas/node-js)
- [Continuous Profiling Best Practices](https://docs.blackfire.io/continuous-profiling/index)
- [Performance Optimization Tips](https://docs.blackfire.io/testing-cookbooks/tests)

## 🤝 Integration with Other Tools

### Sentry Integration

Blackfire works alongside Sentry (already configured in your project):
- Sentry handles error tracking and monitoring
- Blackfire provides performance profiling and optimization insights
- Both tools complement each other for comprehensive application monitoring

### CI/CD Integration

Add performance profiling to your deployment pipeline:

```yaml
# In your CI/CD pipeline
- name: Run Performance Tests
  run: |
    BLACKFIRE_ENABLED=true npm run test:performance
    # Analyze results and fail if performance degrades
```

---

**Note**: Remember to adjust profiling frequency and duration based on your application's needs and resource constraints. Continuous profiling should provide insights without significantly impacting performance. 