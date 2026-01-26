/**
 * Map CreateOrder API error (Data từ SendError) sang dạng dùng trên FE.
 *
 * - request: lỗi validate request (DinnerTableID, OrderedBy, Items) → Alert + back home
 * - item: lỗi validate item (menuId, sizeId) có meta → ở lại, hiện đỏ dưới món đó
 * - material: E0041 thiếu nguyên liệu → ở lại, hiện đỏ dưới từng (menuId, sizeId) kèm tên nguyên liệu
 * - other: E9999, v.v. → Alert + back home
 */

export type MappedCreateOrderError =
  | { type: 'request'; code: string; message: string }
  | { type: 'item'; code: string; menuId: number; sizeId: number; message: string }
  | { type: 'material'; items: { menuId: number; sizeId: number; materialNames: string[] }[] }
  | { type: 'other'; code: string; message: string }

const REQUEST_FIELDS = ['DinnerTableID', 'OrderedBy', 'Items']

function getMessageForCode(code: string, _fields?: string[]): string {
  switch (code) {
    case 'E0001':
      return 'Dữ liệu không tồn tại hoặc không hợp lệ.'
    case 'E0036':
      return 'Dữ liệu không hợp lệ.'
    case 'E0041':
      return 'Không đủ nguyên liệu cho đơn hàng.'
    case 'E9999':
      return 'Lỗi hệ thống. Vui lòng thử lại.'
    default:
      return 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }
}

function parseE0041Item(s: string): { menuId: number; sizeId: number; materialNames: string[] } {
  const parts = String(s || '').split('|')
  if (parts.length < 3) return { menuId: 0, sizeId: 0, materialNames: [] }
  const materialNames = (parts[2] || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
  return {
    menuId: parseInt(parts[0], 10) || 0,
    sizeId: parseInt(parts[1], 10) || 0,
    materialNames
  }
}

function getFirstErrorKey(data: Record<string, unknown>): string | null {
  const skip = new Set(['meta', 'LOG_DATA'])
  for (const k of Object.keys(data)) {
    if (!skip.has(k)) return k
  }
  return null
}

function getFields(data: Record<string, unknown>, code: string): string[] {
  const v = data[code]
  if (Array.isArray(v)) return v as string[]
  if (typeof v === 'string') return [v]
  return []
}

/**
 * Map object Data từ CreateOrder error (GetData + meta) sang MappedCreateOrderError.
 * Data có dạng: { E0036?: string[], E0001?: string[], E0041?: string | string[], meta?: { menuId, sizeId }, ... }
 */
export function mapCreateOrderError(data: Record<string, unknown> | null | undefined): MappedCreateOrderError | null {
  if (!data || typeof data !== 'object') return null

  // E0041: thiếu nguyên liệu
  if ('E0041' in data) {
    const raw = data.E0041
    const items: { menuId: number; sizeId: number; materialNames: string[] }[] = []
    if (typeof raw === 'string') {
      items.push(parseE0041Item(raw))
    } else if (Array.isArray(raw)) {
      raw.forEach((s) => items.push(parseE0041Item(String(s))))
    }
    return { type: 'material', items: items.filter((x) => x.menuId && x.sizeId) }
  }

  // Có meta.menuId + meta.sizeId → lỗi item
  const meta = data.meta as Record<string, unknown> | undefined
  if (meta && typeof meta === 'object' && meta.menuId != null && meta.sizeId != null) {
    const code = getFirstErrorKey(data) ?? 'E0036'
    const message = getMessageForCode(code)
    return {
      type: 'item',
      code,
      menuId: Number(meta.menuId),
      sizeId: Number(meta.sizeId),
      message
    }
  }

  // Còn lại: request hoặc other
  const code = getFirstErrorKey(data) ?? 'E9999'
  const fields = getFields(data, code)
  const message = getMessageForCode(code, fields)

  if (code === 'E9999') return { type: 'other', code, message }

  const isRequestField = REQUEST_FIELDS.some((f) => fields.includes(f))
  return isRequestField ? { type: 'request', code, message } : { type: 'other', code, message }
}

/**
 * Lấy Data từ error (onError của React Query) rồi map.
 * Hỗ trợ: { data } (throw từ isErrorResponse), { response: { data: { Data } } } (Axios).
 */
export function getCreateOrderErrorFromMutation(error: unknown): MappedCreateOrderError | null {
  let data: unknown = null
  const e = error as Record<string, unknown> | null | undefined
  if (e && typeof e === 'object') {
    data = e.data ?? e.Data
    if (data == null && e.response && typeof e.response === 'object') {
      const res = e.response as Record<string, unknown>
      const body = res?.data as Record<string, unknown> | undefined
      data = body?.Data ?? body?.data
    }
  }
  return mapCreateOrderError((data as Record<string, unknown>) ?? null)
}
