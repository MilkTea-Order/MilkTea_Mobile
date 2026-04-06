import * as Yup from 'yup'

// ─── Forgot Password Schema ───────────────────────────────────────────────

export const forgotPasswordValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email không hợp lệ').required('Vui lòng nhập email')
})

export type ForgotPasswordSchema = Yup.InferType<typeof forgotPasswordValidationSchema>

// ─── Verify OTP Schema ────────────────────────────────────────────────────

export const verifyOtpValidationSchema = Yup.object({
  email: Yup.string().trim().email('Email không hợp lệ').required('Vui lòng nhập email'),

  otp: Yup.string()
    .length(6, 'Mã xác minh phải gồm 6 chữ số')
    .matches(/^\d{6}$/, 'Mã xác minh chỉ bao gồm chữ số')
    .required('Vui lòng nhập mã xác minh')
})

export type VerifyOtpSchema = Yup.InferType<typeof verifyOtpValidationSchema>

// ─── Reset Password Schema ────────────────────────────────────────────────

export const resetPasswordValidationSchema = Yup.object({
  resetPasswordToken: Yup.string().required('Token không hợp lệ'),

  newPassword: Yup.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').required('Vui lòng nhập mật khẩu mới'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu')
})

export type ResetPasswordSchema = Yup.InferType<typeof resetPasswordValidationSchema>
