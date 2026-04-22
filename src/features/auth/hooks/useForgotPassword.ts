import { extractFieldErrors } from '@/shared/utils/formErrors'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { Alert } from 'react-native'
import { authApi } from '../apis/auth.api'
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResendOtpPayload,
  ResetPasswordApiResponse,
  ResetPasswordPayload,
  VerifyOtpApiResponse,
  VerifyOtpPayload
} from '../types/auth.type'

// ─── Forgot Password Hook ─────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
      const response = await authApi.forgotPassword({
        email: payload.email
      })
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword', {
        Email: 'email',
        Function: 'function',
        SendOTP: 'sendotp'
      })
      const functionError = fieldErrors.find((field) => field.field === 'function' || field.field === 'sendotp')
      if (fieldErrors.length > 0) {
        if (functionError) {
          Alert.alert('Thông báo', functionError.message, [
            { text: 'OK', onPress: () => router.replace('/login' as any) }
          ])
        }
        error.fieldErrors = fieldErrors.filter((field) => field.field !== 'function' && field.field !== 'sendotp')
      }
    }
  })
}

// ─── Verify OTP Hook ──────────────────────────────────────────────────────
export function useVerifyOtp(sessionId: number) {
  return useMutation({
    mutationFn: async (payload: VerifyOtpPayload): Promise<VerifyOtpApiResponse> => {
      const response = await authApi.verifyOtp(payload, sessionId)
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword', {
        sessionId: 'sessionId',
        OtpCode: 'otp',
        VerifyOtp: 'verifyotp',
        User: 'user'
      })
      const criticalError = fieldErrors.find(
        (field) => field.field === 'sessionId' || field.field === 'verifyotp' || field.field === 'user'
      )
      if (criticalError) {
        Alert.alert('Thông báo', criticalError.message, [
          { text: 'OK', onPress: () => router.replace('/login' as any) }
        ])
      }
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors.filter(
          (field) => field.field !== 'sessionId' && field.field !== 'verifyotp' && field.field !== 'user'
        )
      }
    }
  })
}

// ─── Resend OTP Hook ──────────────────────────────────────────────────────
type ResendOtpMutationInput = {
  payload: ResendOtpPayload
  idempotencyKey: string
}

export function useResendOtp(sessionId: number) {
  return useMutation({
    mutationFn: async ({ payload, idempotencyKey }: ResendOtpMutationInput): Promise<ForgotPasswordResponse> => {
      const response = await authApi.resendOtp(payload, sessionId, idempotencyKey)
      return response.data
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'forgotPassword', {
        SessionId: 'sessionid',
        Channel: 'channel',
        IdempotencyKey: 'idempotencykey',
        ResendOtp: 'resendotp'
      })
      const criticalError = fieldErrors.find(
        (field) =>
          field.field === 'sessionid' ||
          field.field === 'channel' ||
          field.field === 'idempotencykey' ||
          field.field === 'resendotp'
      )
      if (criticalError) {
        Alert.alert('Thông báo', criticalError.message, [
          { text: 'OK', onPress: () => router.replace('/login' as any) }
        ])
      }
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors.filter(
          (field) =>
            field.field !== 'sessionid' &&
            field.field !== 'channel' &&
            field.field !== 'idempotencykey' &&
            field.field !== 'resendotp'
        )
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
