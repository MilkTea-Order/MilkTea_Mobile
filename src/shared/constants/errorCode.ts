export type ErrorDomain = 'auth' | 'user' | 'common'

export const ERROR_CODE = {
  // General Errors (E0001-E0009)
  E0001: 'E0001', // Not exists or not matching with data
  E0002: 'E0002', // Already exists
  E0004: 'E0004', // Required one of these items: Code or Email or Phone
  E0005: 'E0005', // Your account is not active. Please contact the administrator.

  // Validation Errors (E0010-E0019)
  E0012: 'E0012', // New Password equal current password

  // Business Logic Errors (E0020-E0029)
  E0027: 'E0027', // Processing error - General processing failure
  E0029: 'E0029', // Status invalid - The provided status is not valid for this operation

  // Data Validation Errors (E0030-E0039)
  E0036: 'E0036', // Data is invalid

  // Order/Product Errors (E0040-E0049)
  E0040: 'E0040', // Item not available - The requested menu item is not available
  E0041: 'E0041', // Insufficient material stock - Not enough stock to fulfill the order
  E0042: 'E0042', // Cannot cancel order - Order status does not allow cancellation

  // Authentication Errors (E0043-E0049)
  E0043: 'E0043', // Unauthorized - Token has been expired
  E0044: 'E0044', // Unauthorized - Token has been revoked or invalid

  // System Errors
  E9999: 'E9999' // Internal server error - Unexpected system error
} as const

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE]
