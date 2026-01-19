import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
import { LoginPayload, LoginResponse } from '../types/auth.type'

export const authApi = {
  loginAccount(body: LoginPayload): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
    return http.post<ApiResponse<LoginResponse>>(URL.LOGIN, body)
  },

  logout(): Promise<AxiosResponse<{ code: number; message: string }>> {
    return http.post<{ code: number; message: string }>(URL.LOGOUT)
  }
}
