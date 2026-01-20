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
