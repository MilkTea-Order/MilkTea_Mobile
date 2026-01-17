import { getErrorMessage } from "@/shared/resources/errorMessages";
import { isErrorResponse } from "@/shared/types/api.type";

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Extract field errors from API error response
 * @param error - Error object from API call (can be from axios or direct error)
 * @param fieldMapping - Optional mapping function to map API field names to form field names
 * @returns Array of field errors with field name and message
 */
export function extractFieldErrors(
  error: any,
  fieldMapping?: (apiFieldName: string) => string
): FieldError[] {
  const errorResponse = error?.response?.data || error;
  const fieldErrors: FieldError[] = [];

  if (isErrorResponse(errorResponse)) {
    const errorData = errorResponse.data;

    Object.keys(errorData).forEach((errorCode) => {
      const fieldValue = errorData[errorCode];

      // Nếu là array, xử lý từng field
      if (Array.isArray(fieldValue)) {
        fieldValue.forEach((fieldName) => {
          const errorMessage = getErrorMessage(
            errorCode,
            fieldName.toLowerCase()
          );
          const targetField = fieldMapping
            ? fieldMapping(fieldName)
            : fieldName.toLowerCase();

          fieldErrors.push({
            field: targetField,
            message: errorMessage,
          });
        });
      } else {
        // Nếu là string, xử lý một field
        const errorMessage = getErrorMessage(
          errorCode,
          fieldValue.toLowerCase()
        );
        const targetField = fieldMapping
          ? fieldMapping(fieldValue)
          : fieldValue.toLowerCase();

        fieldErrors.push({
          field: targetField,
          message: errorMessage,
        });
      }
    });
  }

  return fieldErrors;
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
    setFieldError(field, message);
  });
}
