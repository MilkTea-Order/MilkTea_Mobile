import { extractFieldErrors } from '@/shared/utils/formErrors'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../apis/auth.api'
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordApiResponse,
  ResetPasswordPayload,
  VerifyOtpApiResponse,
  VerifyOtpPayload
} from '../types/auth.type'

// ─── Forgot Password Hook ─────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      const response = await authApi.forgotPassword(payload)
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword', (field) => {
        if (field.includes('Email')) return 'email'
        return field
      })
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors
      }
    }
  })
}

// ─── Verify OTP Hook ──────────────────────────────────────────────────────

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload): Promise<VerifyOtpApiResponse> => {
      const response = await authApi.verifyOtp(payload)
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword', (field) => {
        if (field.includes('Otp')) return 'otp'
        return field
      })
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors
      }
    }
  })
}

// ─── Resend OTP Hook ──────────────────────────────────────────────────────

export function useResendOtp() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      const response = await authApi.resendOtp(payload)
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword')
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors
      }
    }
  })
}

// ─── Reset Password Hook ──────────────────────────────────────────────────

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload): Promise<ResetPasswordApiResponse> => {
      const response = await authApi.resetPassword(payload)
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword', (field) => {
        // Map API field names to form field names
        console.log(field)
        if (field.includes('token')) return 'resetPasswordToken'
        if (field.includes('NewPassword') && !field.includes('confirm')) return 'newPassword'
        if (field.includes('ConfirmPassword')) return 'confirmPassword'
        return field
      })
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors
      }
    }
  })
}
