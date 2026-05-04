import { ERROR_CODE, ErrorCode, ErrorDomain } from '../constants/errorCode'

export const COMMON_ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODE.E0001]: 'Không tồn tại hoặc không khớp với dữ liệu',
  [ERROR_CODE.E0002]: 'Đã tồn tại',
  [ERROR_CODE.E0004]: 'Yêu cầu một trong các mục: Code hoặc Email hoặc Phone',
  [ERROR_CODE.E0012]: 'Mật khẩu mới không được giống mật khẩu cũ.',
  [ERROR_CODE.E0027]: 'Lỗi xử lý. Vui lòng thử lại.',
  [ERROR_CODE.E0036]: 'Dữ liệu không hợp lệ.',
  [ERROR_CODE.E0041]: 'Nguyên liệu không đủ số lượng để xuất.',
  [ERROR_CODE.E0042]: 'Không thể hủy đơn - Trạng thái đơn hàng không cho phép hủy.',

  // Forgot Password Errors
  [ERROR_CODE.E0050]: 'Mã xác minh đã hết hạn. Vui lòng gửi lại mã mới.',
  [ERROR_CODE.E0051]: 'Mã xác minh không chính xác.',
  [ERROR_CODE.E0052]: 'Bạn đã nhập sai quá nhiều lần. Vui lòng gửi lại mã mới.',
  [ERROR_CODE.E0053]: 'Liên kết đặt lại mật khẩu đã hết hạn.',
  [ERROR_CODE.E0054]: 'Liên kết đặt lại mật khẩu không hợp lệ.',
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
  forgotPassword: {
    // Send OTP
    [ERROR_CODE.E0001]: {
      email: 'Email không đúng hoặc không tồn tại, hãy nhập lại',
      otpcode: 'OTP không đúng, hãy nhập lại',
      sessionid: 'Có lỗi xảy ra vui lòng liên hệ admin để được hỗ trợ',
      idempotencykey: 'Có lỗi xảy ra vui lòng liên hệ admin để được hỗ trợ'
    },
    [ERROR_CODE.E0002]: {
      newpassword: 'Mật khẩu mới không được sử dụng lại mật khẩu đã dùng gần đây',
      confirmpassword: 'Mật khẩu xác nhận không khớp với mật khẩu mới'
    },
    [ERROR_CODE.E0004]: {
      email: 'Có lỗi xãy ra vui lòng liên hệ admin để được hỗ trợ',
      phone: 'Có lỗi xãy ra vui lòng liên hệ admin để được hỗ trợ'
    },
    [ERROR_CODE.E0036]: {
      function: 'Có lỗi xảy ra vui lòng liên hệ admin để được hỗ trợ',
      channel: 'Có lỗi xảy ra vui lòng liên hệ admin để được hỗ trợ',
      email: 'Email không hợp lệ',
      newpassword: 'Mật khẩu mới không hợp lệ'
    },
    [ERROR_CODE.E0042]: {
      sessionid: 'Phiên đã được xác thực vui lòng tạo một phiên mới để tiếp tục'
    },
    [ERROR_CODE.E0043]: {
      otp: 'OTP đã hết hạn',
      sessionid: 'Phiên đã hết hạn vui lòng tạo một phiên mới để tiếp tục'
    },
    [ERROR_CODE.E0044]: {
      sessionid: 'Không thể gữi lại mã vì bạn đã vượt quá số lần cho phép'
    },
    [ERROR_CODE.E9999]: {
      sendotp: 'Không thể gửi mã xác minh. Vui lòng thử lại.',
      resendotp: 'Gữi lại mã thất bại, vui lòng thử lại.',
      resetpassword: 'Đặt lại mật khẩu không thành công. Vui lòng thử lại.'
    }
  },
  user: {
    [ERROR_CODE.E0001]: {
      password: 'Mật khẩu không đúng',
      newpassword: 'Mật khẩu mới không hợp lệ. Không được để trống và phải từ 6 ký tự trở lên'
    },
    [ERROR_CODE.E0002]: {
      email: 'Email đã được sử dụng',
      cellphone: 'Số điện thoại đã được sử dụng',
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
      bankqrcode: 'Ảnh không hợp lệ. Hãy tải ảnh (jpg, jpeg, png) lên.',
      bankaccountname: 'Tên thẻ không hợp lệ',
      bankname: 'Tên ngân hàng không hợp lệ'
    },
    [ERROR_CODE.E9999]: {
      updatepassword: 'Cập nhật mật khẩu không thành công',
      employeeupdateprofile: 'Cập nhật thông tin cá nhân không thành công'
    }
  },
  order: {
    [ERROR_CODE.E0001]: {
      orderid: 'Đơn hàng không tồn tại',
      orderdetailid: 'Hủy món không hợp lệ',
      sourcetableid: 'Bàn muốn gộp không tồn tại'
    },
    [ERROR_CODE.E0002]: {
      sourcetableid: 'Không thể gộp bàn vào chính nó.'
    },
    [ERROR_CODE.E0036]: {
      orderid: 'Đơn hàng không tồn tại',
      orderdetailid: 'Hủy món không hợp lệ',
      dinnerTableId: 'Bàn không hợp lệ (không tìm thấy or đang bán)',
      orderedBy: 'Nếu có giá trị nhưng bé hơn 0',
      items: 'danh sách rỗng',
      menu: 'món chọn không hợp lệ',
      quantity: 'món chọn không hợp lệ',
      price: 'món chọn không hợp lệ'
    },
    [ERROR_CODE.E0042]: {
      orderid: 'Đơn hàng phải có trạng thái chưa thanh toán mới thực hiện thao tác này',
      orderdetailid: 'Món này đã hủy trước đó',
      newdinnertableid: 'Bàn không hợp lệ (không tìm thấy hoặc đang bán tại thời điểm này)',
      sourcetableid: 'Không thể gộp vì bàn muốn gộp không hợp lệ.'
    },
    [ERROR_CODE.E9999]: {
      dinnerTableId: 'Bàn không hợp lệ (không tìm thấy hoặc đang bán tại thời điểm này)',
      orderedBy: 'Nếu có giá trị nhưng bé hơn 0',
      items: 'danh sách rỗng',
      menu: 'món chọn không hợp lệ',
      quantity: 'món chọn không hợp lệ',
      price: 'món chọn không hợp lệ',
      createorder: 'Tạo order không thành công',
      cancelorderdetail: 'Hủy món thất bại',
      changetable: 'Chuyển bàn thất bại',
      mergetable: 'Gộp bàn thất bại'
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
