import { getErrorMessage } from '@/shared/resources/errorMessages'
import { ApiErrorResponse } from '@/shared/types/api.type'

export type CreateOrderErrorResult =
  | { type: 'item'; menuId: number; sizeId: number; message: string }
  | { type: 'alert'; message: string }

/**
 * Parse CreateOrder error từ ApiErrorResponse (đã được throw từ interceptor)
 * @param error - ApiErrorResponse từ interceptor
 * @returns CreateOrderErrorResult
 */
export function parseCreateOrderError(error: ApiErrorResponse): CreateOrderErrorResult {
  const errorData = error.data

  // Lấy error code đầu tiên (bỏ qua meta, LOG_DATA)
  const skip = new Set(['meta', 'LOG_DATA'])
  const errorCode = Object.keys(errorData).find((k) => !skip.has(k))

  if (!errorCode) {
    return { type: 'alert', message: 'Đã xảy ra lỗi. Vui lòng thử lại.' }
  }

  const fieldValue = errorData[errorCode]
  const fields: string[] = Array.isArray(fieldValue) ? fieldValue : typeof fieldValue === 'string' ? [fieldValue] : []
  const fieldName = fields.length > 0 ? fields[0] : undefined
  const fieldLower = fieldName?.toLowerCase()

  // Kiểm tra có meta và field là menu/price/quantity → lỗi item
  const meta = errorData.meta as unknown as Record<string, unknown> | undefined
  if (
    meta &&
    typeof meta === 'object' &&
    meta.menuId != null &&
    meta.sizeId != null &&
    fieldLower &&
    ['menu', 'price', 'quantity'].includes(fieldLower)
  ) {
    const message = getErrorMessage(errorCode, 'order', fieldLower)
    return {
      type: 'item',
      menuId: Number(meta.menuId),
      sizeId: Number(meta.sizeId),
      message
    }
  }
  const message = getErrorMessage(errorCode, 'order', fieldLower)
  return { type: 'alert', message }
}
