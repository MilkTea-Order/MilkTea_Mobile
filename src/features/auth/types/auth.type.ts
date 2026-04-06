import { ApiResponse } from '@/shared/types/api.type'
import { Permission } from './permission.type'
import { User } from './user.type'

export interface LoginPayload {
  username: string
  password: string
}

export interface Token {
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface Profile {
  user: User
  permissions: Permission[]
}

export interface LoginResponse extends Token, Profile {}

export type LoginApiResponse = ApiResponse<LoginResponse>

// ─── Forgot Password Types ─────────────────────────────────────────────────

export interface ForgotPasswordPayload {
  email: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface ResetPasswordPayload {
  resetPasswordToken: string
  newPassword: string
  confirmPassword: string
}

export interface VerifyOtpResponseData {
  resetPasswordToken: string
  expiresAt: string
}

export type ForgotPasswordResponse = ApiResponse<{ expiresAt: string }>
export type VerifyOtpApiResponse = ApiResponse<VerifyOtpResponseData>
export type ResetPasswordApiResponse = ApiResponse<null>
