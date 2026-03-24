import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
import {
  ChangePasswordApiResponse,
  ChangePasswordPayload,
  MeApiResponse,
  UpdateProfileApiResponse,
  UpdateProfilePayload,
  User
} from '../types/user.type'

export const userApi = {
  getMe(): Promise<AxiosResponse<MeApiResponse>> {
    return http.get<MeApiResponse>(URL.USER_ME)
  },
  getUserList(): Promise<AxiosResponse<ApiResponse<{ users: User[] }>>> {
    return http.get<ApiResponse<{ users: User[] }>>(URL.USER_LIST)
  },

  changePassword(body: ChangePasswordPayload): Promise<AxiosResponse<ChangePasswordApiResponse>> {
    return http.patch<ChangePasswordApiResponse>(URL.CHANGE_PASSWORD, body)
  },

  updateProfile(body: UpdateProfilePayload): Promise<AxiosResponse<UpdateProfileApiResponse>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    return http.patch<UpdateProfileApiResponse>(URL.UPDATE_PROFILE, body, config)
  }
}
