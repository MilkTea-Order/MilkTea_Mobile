import { getErrorMessage } from '@/shared/resources/errorMessages'
import { isErrorResponse } from '@/shared/types/api.type'
import { ErrorCode, ErrorDomain } from '../constants/errorCode'

export interface FieldError {
  field: string
  message: string
}

export interface ErrorDetail {
  code: string | ErrorCode
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
  return extractErrorDetails(error, domain, fieldMapping).map(({ field, message }) => ({ field, message }))
}

export function extractErrorDetails(
  error: any,
  domain: ErrorDomain = 'common',
  fieldMapping?: ((apiFieldName: string) => string) | Record<string, string> | string
): ErrorDetail[] {
  const errorResponse = error?.response?.data || error
  const details: ErrorDetail[] = []
  if (!isErrorResponse(errorResponse)) return details
  const errorData = errorResponse.data ?? {}

  const mapFieldName = (apiFieldNameRaw: string): string => {
    const raw = String(apiFieldNameRaw)
    if (!fieldMapping) return raw

    if (typeof fieldMapping === 'string') return fieldMapping

    //Function
    if (typeof fieldMapping === 'function') return fieldMapping(raw)

    // Record
    const mappingLower =
      fieldMapping && typeof fieldMapping === 'object'
        ? Object.fromEntries(Object.entries(fieldMapping).map(([k, v]) => [k.toLowerCase(), v]))
        : undefined
    return mappingLower?.[raw.toLowerCase()] ?? raw
  }

  const toFieldNames = (v: unknown): string[] => {
    if (typeof v === 'string') return [v]
    if (Array.isArray(v)) return v.map((x) => String(x))
    return []
  }

  Object.keys(errorData).forEach((errorCode) => {
    const fieldValue = errorData[errorCode]
    const fieldNames = toFieldNames(fieldValue)

    fieldNames.forEach((raw) => {
      const normalizedForMessage = String(raw).toLowerCase()
      const errorMessage = getErrorMessage(errorCode, domain, normalizedForMessage)
      const targetField = mapFieldName(String(raw))
      details.push({ code: errorCode, field: targetField, message: errorMessage })
    })
  })

  return details
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
