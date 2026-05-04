import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  ResendOtpPayload,
  ResetPasswordApiResponse,
  ResetPasswordPayload,
  VerifyOtpApiResponse,
  VerifyOtpPayload
} from '../types/auth.type'

export const authApi = {
  loginAccount(body: LoginPayload): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    return http.post<ApiResponse<LoginResponse>>(URL.LOGIN, body)
  },

  logout(): Promise<AxiosResponse<{ code: number; message: string }>> {
    return http.post<{ code: number; message: string }>(URL.LOGOUT)
  },

  forgotPassword(body: ForgotPasswordPayload): Promise<AxiosResponse<ForgotPasswordResponse>> {
    return http.post<ForgotPasswordResponse>(URL.FORGOT_PASSWORD, { email: body.email, function: 'RESET_PASSWORD' })
  },

  verifyOtp(body: VerifyOtpPayload, sessionId: number): Promise<AxiosResponse<VerifyOtpApiResponse>> {
    return http.post<VerifyOtpApiResponse>(URL.FORGOT_PASSWORD_VERIFY + sessionId + '/verify', body)
  },

  // resendOtp(body: ResendOtpPayload, sessionId: number): Promise<AxiosResponse<ForgotPasswordResponse>> {
  //   return http.post<ForgotPasswordResponse>(URL.FORGOT_PASSWORD_RESEND + sessionId + '/resend', body)
  // },
  resendOtp(
    body: ResendOtpPayload,
    sessionId: number,
    idempotencyKey: string
  ): Promise<AxiosResponse<ForgotPasswordResponse>> {
    return http.post<ForgotPasswordResponse>(`${URL.FORGOT_PASSWORD_RESEND}${sessionId}/resend`, body, {
      headers: {
        'Idempotency-Key': idempotencyKey
      }
    })
  },
  resetPassword(body: ResetPasswordPayload): Promise<AxiosResponse<ResetPasswordApiResponse>> {
    return http.post<ResetPasswordApiResponse>(URL.FORGOT_PASSWORD_RESET, body)
  }
}
