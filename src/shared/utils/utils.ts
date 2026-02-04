import { ITEM_HEIGHT } from '@/shared/constants/other'
import { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { ApiErrorResponse } from '../types/api.type'
import { RNFile } from '../types/file.type'

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function getIndexFromOffset(offsetY: number, itemCount: number) {
  const raw = Math.round(offsetY / ITEM_HEIGHT)
  return clamp(raw, 0, Math.max(0, itemCount - 1))
}

export const isApiError = (error: unknown): error is ApiErrorResponse =>
  typeof error === 'object' && //
  error !== null &&
  typeof (error as any).code === 'number' &&
  (error as any).code !== 200

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<{
      message: string
      statusCode: number
      timestamp: string
      error?: string | null
      errorDescription?: string | null
    }>(error) && error.response?.headers['token-expired'] === 'true'
  )
}

export const isRNFile = (value: unknown): value is RNFile => {
  return typeof value === 'object' && value !== null && 'uri' in value
}

export const isChangedText = (current?: string | null, initial?: string | null) => (current ?? '') !== (initial ?? '')

export const isChangedNumber = (current?: number | null, initial?: number | null) => (current ?? 0) !== (initial ?? 0)

// export const isUnauthorizedError = (error: unknown): error is ApiErrorResponse =>
//   isApiError(error) && //
//   (error as ApiErrorResponse).code === 401

// export const isExpiredTokenError = (response: AxiosResponse<unknown>): response is AxiosResponse<ApiErrorResponse> => {
//   return isUnauthorizedError(response.data) && response.headers?.['token-expired'] === 'true'
// }

// export const isAxiosError = <T = unknown>(error: unknown): error is AxiosError<T> => axios.isAxiosError(error)

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString + 'Z')
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}
