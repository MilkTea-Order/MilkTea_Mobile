import { ERROR_CODE } from '@/shared/constants/errorCode'
import { getErrorMessage } from '@/shared/resources/errorMessages'
import { ApiErrorResponse } from '@/shared/types/api.type'

export type OrderErrorResult =
  | { type: 'item'; menuId: number; sizeId: number; message: string }
  | { type: 'items'; items: { menuId: number; sizeId: number; message: string }[]; message?: string }
  | { type: 'alert'; message: string; code?: string; field?: string }

/**
 * Parse CreateOrder/AddItems error từ ApiErrorResponse
 * @param error - ApiErrorResponse từ interceptor
 * @returns CreateOrderErrorResult
 */
export function parseOrderError(error: ApiErrorResponse): OrderErrorResult {
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

  const meta = errorData.meta as unknown as Record<string, unknown> | undefined

  // if (errorCode === 'E0036' && fieldLower === 'items' && Array.isArray(fieldValue) && fieldValue.length === 0) {
  // Trường hợp items rỗng (E0036) -> trả về items rỗng
  if (errorCode === ERROR_CODE.E0036 && fieldLower === 'items') {
    const message = getErrorMessage(errorCode, 'order', fieldLower)
    return { type: 'items', items: [], message }
  }

  // Trường hợp có meta và field là menu/price/quantity → lỗi item đơn
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

  // Trường hợp có nhiều item lỗi (meta array) → items
  if (
    meta &&
    typeof meta === 'object' &&
    Array.isArray(meta.items) &&
    meta.items.every((it: any) => typeof it === 'object' && it.menuId != null && it.sizeId != null)
  ) {
    const items = (meta.items as { menuId: number; sizeId: number }[]).map((it) => ({
      menuId: Number(it.menuId),
      sizeId: Number(it.sizeId),
      message: getErrorMessage(errorCode, 'order', fieldLower)
    }))
    const message = getErrorMessage(errorCode, 'order', fieldLower)
    return { type: 'items', items, message }
  }

  const message = getErrorMessage(errorCode, 'order', fieldLower)
  return { type: 'alert', message, code: errorCode, field: fieldLower }
}
