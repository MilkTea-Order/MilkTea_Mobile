import { getErrorMessage } from '@/shared/resources/errorMessages'
import { isErrorResponse } from '@/shared/types/api.type'
import { ErrorDomain } from '../constants/errorCode'

export interface FieldError {
  field: string
  message: string
}

/**
 * Extract field errors from API error response
 * @param error - Error object from API call (can be from axios or direct error)
 * @param domain - Domain context ("auth", "user", or "common")
 * @param fieldMapping - Mapping API field names to form field names
 *   - Function: (apiFieldName) => formFieldName - For dynamic mapping
 *   - Object: { apiFieldName: formFieldName } - For static mapping
 *   - String: Map all fields to single field name
 * @returns Array of field errors with field name and message
 */
export function extractFieldErrors(
  error: any,
  domain: ErrorDomain = 'common',
  fieldMapping?: ((apiFieldName: string) => string) | Record<string, string> | string
): FieldError[] {
  const errorResponse = error?.response?.data || error
  const fieldErrors: FieldError[] = []

  if (isErrorResponse(errorResponse)) {
    const errorData = errorResponse.data

    Object.keys(errorData).forEach((errorCode) => {
      const fieldValue = errorData[errorCode]

      // Helper function để map field name
      const mapFieldName = (apiFieldName: string): string => {
        if (!fieldMapping) {
          return apiFieldName.toLowerCase()
        }

        if (typeof fieldMapping === 'string') {
          // String: Map tất cả về 1 field
          return fieldMapping
        }

        if (typeof fieldMapping === 'function') {
          // Function: Dynamic mapping
          return fieldMapping(apiFieldName)
        }

        // Object: Static mapping
        return fieldMapping[apiFieldName] || apiFieldName.toLowerCase()
      }

      // Nếu là array, xử lý từng field
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((fieldName) => {
          const errorMessage = getErrorMessage(errorCode, domain, fieldName.toLowerCase())
          const targetField = mapFieldName(fieldName)

          fieldErrors.push({
            field: targetField,
            message: errorMessage
          })
        })
      } else {
        // Nếu là string, xử lý một field
        const errorMessage = getErrorMessage(errorCode, domain, fieldValue.toLowerCase())
        const targetField = mapFieldName(fieldValue)

        fieldErrors.push({
          field: targetField,
          message: errorMessage
        })
      }
    })
  }

  return fieldErrors
}

/**
 * Set field errors to Formik form
 * @param setFieldError - Formik's setFieldError function
 * @param fieldErrors - Array of field errors to set
 */
export function setFormikFieldErrors(
  setFieldError: (field: string, message: string) => void,
  fieldErrors: FieldError[]
): void {
  fieldErrors.forEach(({ field, message }) => {
    setFieldError(field, message)
  })
}
