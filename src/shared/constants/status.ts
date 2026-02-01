export const STATUS = {
  ORDER: {
    UNPAID: '1',
    PAID: '2',
    CANCELED: '3',
    NO_COLLECTED: '4'
  } as const,
  DINNER_TABLE: {
    AVAILABLE: 1,
    USING: 2,
    REPAIRING: 3
  } as const
} as const

export type OrderStatus = (typeof STATUS.ORDER)[keyof typeof STATUS.ORDER]

/**
 * List of order status options.
 *
 * - `value` is the numeric status code (mapped with DB / enum `OrderStatus`)
 * - `label` is the human-readable text used for UI (dropdown, display, etc.)
 * - `icon` is the Ionicons name used for UI (chips, badges, etc.)
 *
 * This constant is the **single source of truth** for order status metadata.
 */
export const ORDER_STATUS_OPTIONS = [
  { value: STATUS.ORDER.UNPAID, label: 'Chưa thanh toán', icon: 'receipt-outline' },
  { value: STATUS.ORDER.NO_COLLECTED, label: 'Đã thanh toán', icon: 'hourglass-outline' },
  { value: STATUS.ORDER.PAID, label: 'Đã thu tiền', icon: 'checkmark-circle-outline' },
  { value: STATUS.ORDER.CANCELED, label: 'Hủy', icon: 'close-circle-outline' }
] as const

export const ORDER_STATUS_LABEL = ORDER_STATUS_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  },
  {} as Record<OrderStatus, string>
)

/**
 * Mapping object from `OrderStatus` to Ionicons icon name.
 * Derived from `ORDER_STATUS_OPTIONS` to avoid duplicated data.
 *
 * @example
 * ```ts
 * ORDER_STATUS_ICON[OrderStatus.UNPAID] // 'receipt-outline'
 * ```
 */
export const ORDER_STATUS_ICON = ORDER_STATUS_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.icon
    return acc
  },
  {} as Record<OrderStatus, (typeof ORDER_STATUS_OPTIONS)[number]['icon']>
)
