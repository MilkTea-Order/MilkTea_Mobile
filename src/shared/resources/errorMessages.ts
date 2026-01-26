import { ERROR_CODE, ErrorCode, ErrorDomain } from '../constants/errorCode'

export const COMMON_ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODE.E0001]: 'Không tồn tại hoặc không khớp với dữ liệu',
  [ERROR_CODE.E0002]: 'Đã tồn tại',
  [ERROR_CODE.E0004]: 'Yêu cầu một trong các mục: Code hoặc Email hoặc Phone',
  [ERROR_CODE.E0005]: 'Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên.',
  [ERROR_CODE.E0027]: 'Lỗi xử lý. Vui lòng thử lại.',
  [ERROR_CODE.E0029]: 'Trạng thái không hợp lệ cho thao tác này.',
  [ERROR_CODE.E0036]: 'Dữ liệu không hợp lệ.',
  [ERROR_CODE.E0040]: 'Món không có sẵn.',
  [ERROR_CODE.E0041]: 'Không đủ nguyên liệu trong kho.',
  [ERROR_CODE.E0042]: 'Không thể hủy đơn - Trạng thái đơn hàng không cho phép hủy.',
  [ERROR_CODE.E0043]: 'Không có quyền truy cập - Token đã bị hết hạn',
  [ERROR_CODE.E0044]: 'Không có quyền truy cập - Token đã bị thu hồi hoặc không hợp lệ',
  [ERROR_CODE.E9999]: 'Lỗi hệ thống. Vui lòng thử lại sau.'
}

export const FIELD_ERROR_MESSAGES: Record<ErrorDomain, Partial<Record<ErrorCode, Record<string, string>>>> = {
  auth: {
    [ERROR_CODE.E0001]: {
      username: 'Thông tin đăng nhập không đúng',
      password: 'Thông tin đăng nhập không đúng'
    },
    [ERROR_CODE.E0002]: {
      username: 'Tên đăng nhập đã tồn tại',
      email: 'Email đã tồn tại',
      phone: 'Số điện thoại đã tồn tại'
    }
  },
  user: {
    [ERROR_CODE.E0001]: {
      password: 'Mật khẩu không đúng',
      newpassword: 'Mật khẩu mới không hợp lệ. Không được để trống và phải từ 6 ký tự trở lên'
    },
    [ERROR_CODE.E0002]: {
      email: 'Email đã được sử dụng',
      cellphone: 'Số điện thoại đã được sử dụng'
    },
    [ERROR_CODE.E0012]: {
      newpassword: 'Mật khẩu mới không được giống mật khẩu cũ',
      confirmpassword: 'Mật khẩu xác nhận không khớp với mật khẩu mới'
    },
    [ERROR_CODE.E0036]: {
      fullname: 'Họ và tên phải từ 2 kí tự trở lên',
      gender: 'Chọn giới tính không hợp lệ',
      genderid: 'Chọn giới tính không hợp lệ',
      email: 'Email không hợp lệ',
      birthday: 'Tuổi phải nằm trong khoảng từ 10 đến 100',
      cellphone: 'Số điện thoại phải có độ dài từ 8 đến 15',
      identitycode: 'Số căn cước không hợp lệ',
      indentitycode: 'Số căn cước không hợp lệ',
      bankaccountnumber: 'Số thẻ ngân hàng không hợp lệ',
      bankqrcode: 'Mã QR không hợp lệ',
      bankaccountname: 'Tên thẻ không hợp lệ',
      bankname: 'Tên ngân hàng không hợp lệ'
    },
    [ERROR_CODE.E9999]: {
      updatepassword: 'Cập nhật mật khẩu không thành công',
      employeeupdateprofile: 'Cập nhật thông tin cá nhân không thành công'
    }
  },
  order: {
    [ERROR_CODE.E0036]: {
      dinnerTableId: 'Bàn không hợp lệ (không tìm thấy or đang bán)',
      orderedBy: 'Nếu có giá trị nhưng bé hơn 0',
      items: 'danh sách rỗng',
      menu: 'món chọn không hợp lệ',
      quantity: 'món chọn không hợp lệ',
      price: 'món chọn không hợp lệ'
    },
    [ERROR_CODE.E9999]: {
      createorder: 'Tạo order không thành công'
    }
  },
  common: {}
}

/**
 * Get error message for an error code based on domain
 * @param errorCode - The error code (e.g., "E0001")
 * @param domain - Domain context ("auth", "user", or "common")
 * @param fieldName - Optional field name (e.g., "username") for field-specific messages
 * @returns Error message string
 */
export function getErrorMessage(errorCode: string, domain: ErrorDomain = 'common', fieldName?: string): string {
  const validErrorCode = errorCode as ErrorCode
  // Nếu có fieldName, tìm message cụ thể cho field đó trong domain
  // console.log("fieldName: ", fieldName);
  // console.log("domain: ", domain);
  // console.log("validErrorCode: ", validErrorCode);
  if (fieldName && domain !== 'common' && FIELD_ERROR_MESSAGES[domain]?.[validErrorCode]?.[fieldName]) {
    // console.log("FIELD_ERROR_MESSAGES: ", FIELD_ERROR_MESSAGES[domain][validErrorCode][fieldName]);
    return FIELD_ERROR_MESSAGES[domain][validErrorCode][fieldName]
  }
  // Nếu không có fieldName hoặc không tìm thấy, fallback về common message
  // Không lấy message của field khác để tránh nhầm lẫn
  return COMMON_ERROR_MESSAGES[validErrorCode] || 'Có lỗi xảy ra. Vui lòng thử lại.'
}

/**
 * Get ALL error messages from error data structure
 * Error data format: { "E0001": "username" } or { "E0001": ["username", "email"] }
 * @param errorData - Error data object
 * @param domain - Domain context ("auth", "user", or "common")
 * @returns Array of ALL error messages
 */
export function getAllErrorMessagesFromData(
  errorData: Record<string, string | string[]>,
  domain: ErrorDomain = 'common'
): string[] {
  const messages: string[] = []
  // Lặp qua tất cả error code
  Object.keys(errorData).forEach((errorCode) => {
    // Lấy tất cả field của error code đó
    const fieldValue = errorData[errorCode]

    // Nếu là array, lấy message cho từng field
    if (Array.isArray(fieldValue)) {
      fieldValue.forEach((fieldName) => {
        const message = getErrorMessage(errorCode, domain, fieldName.toLowerCase())
        messages.push(message)
      })
    } else {
      // Nếu là string, lấy message cho một field
      const message = getErrorMessage(errorCode, domain, fieldValue.toLowerCase())
      messages.push(message)
    }
  })
  return messages
}

/**
 * Get single error message from error data structure (for backward compatibility)
 * Returns first error message only
 * @param errorData - Error data object
 * @param domain - Domain context ("auth", "user", or "common")
 * @returns First error message string
 */
export function getErrorMessageFromData(
  errorData: Record<string, string | string[]>,
  domain: ErrorDomain = 'common'
): string {
  const messages = getAllErrorMessagesFromData(errorData, domain)
  return messages[0] || 'Có lỗi xảy ra. Vui lòng thử lại.'
}

/**
 * Get ALL error messages from ApiErrorResponse
 * @param errorResponse - ApiErrorResponse object
 * @param domain - Domain context ("auth", "user", or "common")
 * @returns Array of ALL error messages
 */
export function getAllErrorMessagesFromResponse(
  errorResponse: {
    data: Record<string, string | string[]>
  },
  domain: ErrorDomain = 'common'
): string[] {
  return getAllErrorMessagesFromData(errorResponse.data, domain)
}

/**
 * Get single error message from ApiErrorResponse (for backward compatibility)
 * Returns first error message only
 * @param errorResponse - ApiErrorResponse object
 * @param domain - Domain context ("auth", "user", or "common")
 * @returns First error message string
 */
export function getErrorMessageFromResponse(
  errorResponse: {
    data: Record<string, string | string[]>
  },
  domain: ErrorDomain = 'common'
): string {
  return getErrorMessageFromData(errorResponse.data, domain)
}
