# Third-Party Tools Setup Guide

## 🎯 **Overview**

This guide covers setting up third-party tools for CodeCave based on your PROJECT-SETUP.md requirements.

## ✅ **Already Configured Tools**

### **Sentry (Error Monitoring)**
- ✅ **Status**: Already integrated in your codebase
- ✅ **Files**: `apps/api/src/instrument.ts`, `apps/web/src/instrumentation.ts`
- ✅ **Environment**: `SENTRY_DSN_API`, `SENTRY_DSN_WEB` in Doppler

### **Doppler (Secret Management)**  
- ✅ **Status**: Fully integrated in deployment system
- ✅ **Configuration**: `codecave → prod_all`
- ✅ **Integration**: GitHub Actions, deployment script

## 🔄 **Tools Needing Setup**

### **1. ConfigCat (Feature Flags)**

**Purpose**: Manage feature flags for safe feature rollouts

**Setup Steps:**
```bash
# 1. Create ConfigCat account
# Go to: https://configcat.com/

# 2. Create new Product named "CodeCave"

# 3. Create Config for your environments

# 4. Get SDK Key from dashboard

# 5. Add to Doppler
# CONFIGCAT_SDK_KEY=your_sdk_key_here
```

**Integration Code** (add to your NestJS app):
```typescript
// apps/api/src/config/configcat.service.ts
import { Injectable } from '@nestjs/common';
import * as configcat from 'configcat-node';

@Injectable()
export class ConfigCatService {
  private client: configcat.IConfigCatClient;

  constructor() {
    this.client = configcat.getClient(process.env.CONFIGCAT_SDK_KEY);
  }

  async isFeatureEnabled(key: string, userId?: string): Promise<boolean> {
    const user = userId ? { identifier: userId } : undefined;
    return await this.client.getValueAsync(key, false, user);
  }

  async getFeatureValue<T>(key: string, defaultValue: T, userId?: string): Promise<T> {
    const user = userId ? { identifier: userId } : undefined;
    return await this.client.getValueAsync(key, defaultValue, user);
  }
}
```

**Environment Variables**:
```bash
CONFIGCAT_SDK_KEY=your_sdk_key_here
```

### **2. Blackfire.io (Performance Profiling)**

**Purpose**: Performance profiling for NestJS backend

**Setup Steps:**
```bash
# 1. Create Blackfire.io account
# Go to: https://blackfire.io/

# 2. Create new Environment for "codecave-production"

# 3. Get credentials from Settings → Credentials

# 4. Add to Doppler
# BLACKFIRE_SERVER_ID=your_server_id
# BLACKFIRE_SERVER_TOKEN=your_server_token
```

**Docker Integration** (add to `apps/api/Dockerfile.prod`):
```dockerfile
# Add after the production stage
RUN curl -A "Docker" -o /tmp/blackfire-probe.tar.gz -D - -L -s https://blackfire.io/api/v1/releases/probe/php/alpine/amd64/72 \
    && mkdir -p /tmp/blackfire \
    && tar zxpf /tmp/blackfire-probe.tar.gz -C /tmp/blackfire \
    && mv /tmp/blackfire/blackfire-*.so $(php -r "echo ini_get ('extension_dir');")/blackfire.so

# Add Blackfire configuration
COPY --from=builder /tmp/blackfire/blackfire.ini /usr/local/etc/php/conf.d/blackfire.ini
```

**Environment Variables**:
```bash
BLACKFIRE_SERVER_ID=your_server_id
BLACKFIRE_SERVER_TOKEN=your_server_token
```

## 🤖 **GitHub Apps (One-time Install)**

### **3. ImgBot (Automated Image Optimization)**

**Purpose**: Automatically optimize images in your repository

**Setup Steps:**
```bash
# 1. Go to GitHub Marketplace
# https://github.com/marketplace/imgbot

# 2. Click "Set up a plan" → Choose free plan

# 3. Install and authorize for codecave repository

# 4. ImgBot will automatically create PRs for image optimization
```

**Configuration** (optional - create `.imgbotconfig`):
```json
{
  "schedule": "weekly",
  "ignoredFiles": [
    "*.ico",
    "public/logos/*"
  ],
  "aggressiveCompression": false
}
```

### **4. CodeScene (Code Health Analysis)**

**Purpose**: Deep code analysis for technical debt identification

**Setup Steps:**
```bash
# 1. Sign up with GitHub account
# Go to: https://codescene.com/

# 2. Authorize CodeScene to access repositories

# 3. Create new analysis project

# 4. Link codecave repository

# 5. Run initial analysis
```

**Benefits**:
- ✅ Identifies code hotspots
- ✅ Technical debt visualization  
- ✅ Code complexity analysis
- ✅ Development trends tracking

## 🔧 **Integration Priority**

### **High Priority (Immediate Setup)**
1. **ConfigCat** - Feature flags for safe deployments
2. **ImgBot** - Automatic image optimization

### **Medium Priority (This Month)**  
3. **Blackfire.io** - Performance profiling for optimization
4. **CodeScene** - Code health monitoring

## 📝 **Environment Variables Summary**

Add these to your Doppler `codecave → prod_all` config:

```bash
# ConfigCat
CONFIGCAT_SDK_KEY=your_configcat_sdk_key

# Blackfire.io  
BLACKFIRE_SERVER_ID=your_blackfire_server_id
BLACKFIRE_SERVER_TOKEN=your_blackfire_server_token
```

## 🚀 **Next Steps**

### **1. Immediate Actions**
```bash
# Set up ConfigCat
1. Create account and get SDK key
2. Add CONFIGCAT_SDK_KEY to Doppler
3. Add ConfigCat service to NestJS

# Install ImgBot
1. Install from GitHub Marketplace
2. Configure .imgbotconfig if needed
```

### **2. Integration Testing**
```bash
# Test ConfigCat integration
curl https://api.codecave.tech/feature-flags/test

# Verify ImgBot installation  
# Check for automatic PR creation when images are added
```

### **3. Monitoring Setup**
```bash
# CodeScene analysis
# Review code health reports weekly

# Blackfire profiling
# Set up performance baselines
# Monitor API response times
```

## 🔍 **Verification Steps**

### **ConfigCat Verification**
```typescript
// Test feature flag in your API
@Get('feature-test')
async testFeature(@Query('userId') userId: string) {
  const isEnabled = await this.configCat.isFeatureEnabled('new_feature', userId);
  return { featureEnabled: isEnabled };
}
```

### **Blackfire Verification**
```bash
# Profile API endpoint
blackfire curl https://api.codecave.tech/health

# View results in Blackfire dashboard
```

### **ImgBot Verification**
```bash
# Add an unoptimized image to your repo
git add public/test-image.png
git commit -m "test: add test image for ImgBot"
git push origin main

# ImgBot should create a PR within 24 hours
```

## 📊 **Expected Benefits**

### **ConfigCat**
- 🚀 Safe feature rollouts with instant rollback
- 👥 A/B testing capabilities
- 🎯 Targeted feature releases by user segments

### **ImgBot**  
- ⚡ Faster page load times
- 📱 Better mobile experience
- 💾 Reduced bandwidth usage

### **Blackfire.io**
- 🔍 Identify performance bottlenecks
- 📈 Track performance improvements
- 🚀 Optimize API response times

### **CodeScene**
- 🧹 Reduce technical debt
- 📊 Monitor code quality trends
- 🎯 Focus refactoring efforts

This setup will give you enterprise-grade monitoring, optimization, and feature management capabilities for CodeCave. 