import { NextResponse } from 'next/server'
import { ZodError, ZodIssue } from 'zod'

// Standard API error response format
export interface ApiErrorResponse {
  error: string
  message?: string
  details?: unknown
  code?: string
}

// HTTP status codes for common error scenarios
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Format Zod validation errors for user-friendly display
export function formatZodError(error: ZodError): {
  message: string
  details: Record<string, string[]>
} {
  const details: Record<string, string[]> = {}
  
  error.issues.forEach((issue: ZodIssue) => {
    const path = issue.path.join('.')
    if (!details[path]) {
      details[path] = []
    }
    details[path].push(issue.message)
  })

  const fieldCount = Object.keys(details).length
  const message = fieldCount === 1
    ? `Validation failed for ${Object.keys(details)[0]}`
    : `Validation failed for ${fieldCount} fields`

  return { message, details }
}

// Create standardized error responses
export function createErrorResponse(
  error: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown,
  code?: string
): NextResponse<ApiErrorResponse> {
  const response: ApiErrorResponse = { error }
  if (details !== undefined) {
    response.details = details
  }
  if (code) {
    response.code = code
  }
  
  return NextResponse.json(response, { status })
}

// Handle Zod validation errors specifically
export function createValidationErrorResponse(
  zodError: ZodError
): NextResponse<ApiErrorResponse> {
  const { message, details } = formatZodError(zodError)
  
  return NextResponse.json(
    {
      error: 'Validation failed',
      message,
      details,
      code: 'VALIDATION_ERROR',
    },
    { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
  )
}

// Common error responses
export const ErrorResponses = {
  // Authentication errors
  unauthorized: (message = 'Authentication required') =>
    createErrorResponse(message, HTTP_STATUS.UNAUTHORIZED, undefined, 'UNAUTHORIZED'),
  
  forbidden: (message = 'Access forbidden') =>
    createErrorResponse(message, HTTP_STATUS.FORBIDDEN, undefined, 'FORBIDDEN'),
  
  // Resource errors
  notFound: (resource = 'Resource', id?: string) =>
    createErrorResponse(
      `${resource} not found${id ? ` with ID: ${id}` : ''}`,
      HTTP_STATUS.NOT_FOUND,
      { resource, id },
      'NOT_FOUND'
    ),
  
  conflict: (message = 'Resource already exists') =>
    createErrorResponse(message, HTTP_STATUS.CONFLICT, undefined, 'CONFLICT'),
  
  // Validation errors
  validation: (zodError: ZodError) => createValidationErrorResponse(zodError),
  
  badRequest: (message = 'Invalid request') =>
    createErrorResponse(message, HTTP_STATUS.BAD_REQUEST, undefined, 'BAD_REQUEST'),
  
  // Server errors
  internal: (message = 'Internal server error', error?: Error) =>
    createErrorResponse(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      'INTERNAL_ERROR'
    ),
  
  // Database errors
  database: (operation: string, error?: Error) =>
    createErrorResponse(
      `Database ${operation} failed`,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development' ? error?.message : undefined,
      'DATABASE_ERROR'
    ),
}

// Async error handler wrapper for API routes
export function handleApiError<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return ErrorResponses.validation(error)
      }
      
      // Handle known error types
      if (error instanceof Error) {
        // Check for specific database errors
        if (error.message.includes('unique constraint')) {
          return ErrorResponses.conflict('Resource already exists')
        }
        
        if (error.message.includes('foreign key constraint')) {
          return ErrorResponses.badRequest('Invalid reference')
        }
        
        // Generic error with message
        return ErrorResponses.internal(error.message, error)
      }
      
      // Fallback for unknown errors
      return ErrorResponses.internal()
    }
  }
}

// Validation helper for API route parameters
export function validateApiInput<T>(
  schema: { parse: (input: unknown) => T },
  input: unknown
): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof ZodError) {
      throw error // Re-throw to be caught by handleApiError
    }
    throw new Error('Invalid input format')
  }
}

// Success response helper
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<{ data: T; message?: string }> {
  const response: { data: T; message?: string } = { data }
  if (message) {
    response.message = message
  }
  
  return NextResponse.json(response, { status })
}

// Type guards for error handling
export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError
}

export function isApiError(error: unknown): error is Error {
  return error instanceof Error
}