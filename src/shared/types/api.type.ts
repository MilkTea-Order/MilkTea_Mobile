export interface ApiResponse<T> {
  code: number
  message: string | null
  description: string
  data: T
}
export type ErrorData = Record<string, string | string[]>

export type ApiErrorResponse = ApiResponse<ErrorData>

export function isSuccessResponse<T>(response: ApiResponse<T>): response is ApiResponse<T> & { code: 200 } {
  return response.code === 200
}

export function isErrorResponse(response: ApiResponse<unknown>): response is ApiErrorResponse {
  return response.code !== 200
}
