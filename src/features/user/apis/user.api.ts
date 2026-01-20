import { URL } from '@/shared/constants/urls'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
import {
  ChangePasswordApiResponse,
  ChangePasswordPayload,
  MeApiResponse,
  UpdateProfileApiResponse,
  UpdateProfilePayload
} from '../types/user.type'

export const userApi = {
  getMe(): Promise<AxiosResponse<MeApiResponse>> {
    return http.get<MeApiResponse>(URL.USER_ME)
  },

  changePassword(body: ChangePasswordPayload): Promise<AxiosResponse<ChangePasswordApiResponse>> {
    return http.put<ChangePasswordApiResponse>(URL.CHANGE_PASSWORD, body)
  },

  updateProfile(body: UpdateProfilePayload): Promise<AxiosResponse<UpdateProfileApiResponse>> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    return http.put<UpdateProfileApiResponse>(URL.UPDATE_PROFILE, body, config)
  }
}
