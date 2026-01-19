import { ApiResponse } from '@/shared/types/api.type'

export interface User {
  userId: number
  userName: string
  employeeId: number
  employeeCode: string
  fullName: string
  genderID: number
  genderName: string
  birthDay: string
  identityCode: string
  email: string
  address?: string
  cellPhone: string
  positionID: number
  positionName: string
  statusID: number
  statusName: string
  startWorkingDate: string
  endWorkingDate?: string
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
  bankQRCode?: string
  createdDate?: string
  lastUpdatedDate: string
}

export type MeResponseData = User

export type MeApiResponse = ApiResponse<MeResponseData>

export interface ChangePasswordPayload {
  password: string
  newPassword: string
  confirmPassword: string
}

export interface ChangePasswordResponse {
  status: boolean
}

export type ChangePasswordApiResponse = ApiResponse<ChangePasswordResponse>
