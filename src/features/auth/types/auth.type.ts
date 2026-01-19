import { ApiResponse } from '@/shared/types/api.type'
import { Permission } from './permission.type'
import { User } from './user.type'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: User
  permissions: Permission[]
}

export type LoginApiResponse = ApiResponse<LoginResponse>
