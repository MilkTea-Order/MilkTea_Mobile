import { Ionicons } from '@expo/vector-icons'

export type FilterOption<T extends string | number> = {
  value: T
  label: string
  icon: keyof typeof Ionicons.glyphMap
}

export const STATUS = {
  ORDER: {
    UNPAID: '1',
    PAID: '2',
    CANCELLED: '3',
    NOTCOLLECTED: '4'
  } as const,
  DINNER_TABLE: {
    AVAILABLE: 1,
    USING: 2,
    REPAIRING: 3
  } as const,
  ORDER_ITEM: {
    PENDING: 1,
    INPROGRESS: 2,
    COMPLETED: 3,
    CANCELLED: 4
  } as const
} as const

export const ORDER_ITEM_STATUS = STATUS.ORDER_ITEM

export type OrderStatus = (typeof STATUS.ORDER)[keyof typeof STATUS.ORDER]

export type OrderItemStatus = (typeof STATUS.ORDER_ITEM)[keyof typeof STATUS.ORDER_ITEM]

/**
 * List of order status options.
 *
 * - `value` is the numeric status code (mapped with DB / enum `OrderStatus`)
 * - `label` is the human-readable text used for UI (dropdown, display, etc.)
 * - `icon` is the Ionicons name used for UI (chips, badges, etc.)
 *
 * This constant is the **single source of truth** for order status metadata.
 */
export const ORDER_STATUS_OPTIONS: FilterOption<OrderStatus>[] = [
  { value: STATUS.ORDER.UNPAID, label: 'Chưa thanh toán', icon: 'receipt-outline' },
  { value: STATUS.ORDER.NOTCOLLECTED, label: 'Đã thanh toán', icon: 'hourglass-outline' },
  { value: STATUS.ORDER.PAID, label: 'Đã thu tiền', icon: 'checkmark-circle-outline' },
  { value: STATUS.ORDER.CANCELLED, label: 'Đã hủy', icon: 'close-circle-outline' }
]

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

export const ORDER_ITEM_STATUS_OPTIONS: FilterOption<OrderItemStatus>[] = [
  { value: STATUS.ORDER_ITEM.PENDING, label: 'Chờ thực hiện', icon: 'time-outline' },
  { value: STATUS.ORDER_ITEM.INPROGRESS, label: 'Đang làm', icon: 'restaurant-outline' },
  { value: STATUS.ORDER_ITEM.COMPLETED, label: 'Hoàn thành', icon: 'checkmark-circle-outline' },
  { value: STATUS.ORDER_ITEM.CANCELLED, label: 'Đã hủy', icon: 'close-circle-outline' }
]

export const ORDER_ITEM_STATUS_LABEL = ORDER_ITEM_STATUS_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.label
    return acc
  },
  {} as Record<OrderItemStatus, string>
)

export const ORDER_DETAIL_STATUS_ICON = ORDER_ITEM_STATUS_OPTIONS.reduce(
  (acc, cur) => {
    acc[cur.value] = cur.icon
    return acc
  },
  {} as Record<OrderItemStatus, FilterOption<OrderItemStatus>['icon']>
)
