import { ERROR_CODE } from "../constants/errorCode";

// Error messages mapping
// Format: ERROR_CODE -> default message
// Note: Some errors may have dynamic messages based on field name
export const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODE.E0001]: "Không tồn tại hoặc không khớp với dữ liệu",
  [ERROR_CODE.E0002]: "Đã tồn tại",
  [ERROR_CODE.E0004]: "Yêu cầu một trong các mục: Code hoặc Email hoặc Phone",
  [ERROR_CODE.E0005]:
    "Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên.",
  [ERROR_CODE.E0012]:
    "Mật khẩu trùng với {X} lần gần nhất. Vui lòng chọn mật khẩu khác.",
  [ERROR_CODE.E0027]: "Lỗi xử lý. Vui lòng thử lại.",
  [ERROR_CODE.E0029]: "Trạng thái không hợp lệ cho thao tác này.",
  [ERROR_CODE.E0036]: "Dữ liệu không hợp lệ.",
  [ERROR_CODE.E0040]: "Món không có sẵn.",
  [ERROR_CODE.E0041]: "Không đủ nguyên liệu trong kho.",
  [ERROR_CODE.E0042]:
    "Không thể hủy đơn - Trạng thái đơn hàng không cho phép hủy.",
  [ERROR_CODE.E0043]:
    "Không có quyền truy cập - Token đã bị thu hồi hoặc hết hạn",
  [ERROR_CODE.E9999]: "Lỗi hệ thống. Vui lòng thử lại sau.",
};

// Field-specific error messages
// Format: ERROR_CODE -> field name -> message
export const FIELD_ERROR_MESSAGES: Record<string, Record<string, string>> = {
  [ERROR_CODE.E0001]: {
    username: "Tên đăng nhập không tồn tại",
    email: "Email không tồn tại",
    phone: "Số điện thoại không tồn tại",
    password: "Mật khẩu không đúng",
    // Add more field-specific messages as needed
  },
  [ERROR_CODE.E0002]: {
    username: "Tên đăng nhập đã tồn tại",
    email: "Email đã tồn tại",
    phone: "Số điện thoại đã tồn tại",
    // Add more field-specific messages as needed
  },
  // Add more error codes with field-specific messages as needed
};

/**
 * Get error message for an error code
 * @param errorCode - The error code (e.g., "E0001")
 * @param fieldName - Optional field name (e.g., "username") for field-specific messages
 * @returns Error message string
 */
export function getErrorMessage(errorCode: string, fieldName?: string): string {
  // Try to get field-specific message first
  if (fieldName && FIELD_ERROR_MESSAGES[errorCode]?.[fieldName]) {
    return FIELD_ERROR_MESSAGES[errorCode][fieldName];
  }

  // Fallback to default message
  return ERROR_MESSAGES[errorCode] || "Có lỗi xảy ra. Vui lòng thử lại.";
}

/**
 * Get error message from error data structure
 * Error data format: { "E0001": "username" } or { "E0001": ["username", "email"] }
 * @param errorData - Error data object
 * @returns Error message string
 */
export function getErrorMessageFromData(
  errorData: Record<string, string | string[]>
): string {
  const firstKey = Object.keys(errorData)[0];
  if (!firstKey) return "Có lỗi xảy ra. Vui lòng thử lại.";

  const firstValue = errorData[firstKey];
  const fieldName = Array.isArray(firstValue) ? firstValue[0] : firstValue;

  return getErrorMessage(firstKey, fieldName);
}

/**
 * Get error message from ApiErrorResponse
 * @param errorResponse - ApiErrorResponse object
 * @returns Error message string
 */
export function getErrorMessageFromResponse(errorResponse: {
  data: Record<string, string | string[]>;
}): string {
  return getErrorMessageFromData(errorResponse.data);
}
