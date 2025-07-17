export declare class SentryExampleController {
    getUserWithSpan(userId: string): Promise<{
        userId: string;
        data: string;
        responseTime: number;
        timestamp: string;
    }>;
    processDataWithTracing(data: any): Promise<{
        success: boolean;
        processedData: any;
        processingTime: number;
        timestamp: string;
    }>;
    loggerExamples(): {
        message: string;
        timestamp: string;
    };
    testExceptionCapture(): {
        message: string;
        error: any;
        timestamp: string;
    };
    breadcrumbsDemo(): {
        message: string;
        breadcrumbsAdded: number;
        timestamp: string;
    };
}
