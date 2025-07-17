"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryExampleController = void 0;
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/nestjs");
let SentryExampleController = class SentryExampleController {
    async getUserWithSpan(userId) {
        return Sentry.startSpan({
            op: "http.server",
            name: `GET /sentry-examples/custom-span/${userId}`,
        }, async (span) => {
            const metric = Math.random() * 100;
            span.setAttribute("userId", userId);
            span.setAttribute("responseTime", metric);
            span.setAttribute("endpoint", "getUserWithSpan");
            await new Promise(resolve => setTimeout(resolve, metric));
            return {
                userId,
                data: `User data for ${userId}`,
                responseTime: metric,
                timestamp: new Date().toISOString(),
            };
        });
    }
    async processDataWithTracing(data) {
        return Sentry.startSpan({
            op: "business.logic",
            name: "Process User Data",
        }, async (span) => {
            const processingTime = Math.random() * 500;
            span.setAttribute("dataSize", JSON.stringify(data).length);
            span.setAttribute("processingTime", processingTime);
            span.setAttribute("operation", "processData");
            Sentry.addBreadcrumb({
                message: 'Processing user data',
                level: 'info',
                data: { dataSize: JSON.stringify(data).length }
            });
            await new Promise(resolve => setTimeout(resolve, processingTime));
            return {
                success: true,
                processedData: data,
                processingTime,
                timestamp: new Date().toISOString(),
            };
        });
    }
    loggerExamples() {
        const { logger } = Sentry;
        const userId = 'user_123';
        const orderId = 'order_456';
        logger.trace("Starting database connection", { database: "users" });
        logger.debug(logger.fmt `Cache miss for user: ${userId}`);
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
    testExceptionCapture() {
        try {
            throw new Error('This is a test exception for Sentry capture');
        }
        catch (error) {
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
    breadcrumbsDemo() {
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
};
exports.SentryExampleController = SentryExampleController;
__decorate([
    (0, common_1.Get)('custom-span/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SentryExampleController.prototype, "getUserWithSpan", null);
__decorate([
    (0, common_1.Post)('process-data'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SentryExampleController.prototype, "processDataWithTracing", null);
__decorate([
    (0, common_1.Get)('logger-examples'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SentryExampleController.prototype, "loggerExamples", null);
__decorate([
    (0, common_1.Get)('exception-test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SentryExampleController.prototype, "testExceptionCapture", null);
__decorate([
    (0, common_1.Get)('breadcrumbs-demo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SentryExampleController.prototype, "breadcrumbsDemo", null);
exports.SentryExampleController = SentryExampleController = __decorate([
    (0, common_1.Controller)('sentry-examples')
], SentryExampleController);
//# sourceMappingURL=sentry-example.controller.js.map