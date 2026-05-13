import { ORDER_DETAIL_STATUS_ICON, ORDER_ITEM_STATUS, ORDER_ITEM_STATUS_LABEL, type OrderItemStatus } from './status'

export const ORDER_ITEM_TRANSITIONS: Record<OrderItemStatus, OrderItemStatus[]> = {
  [ORDER_ITEM_STATUS.PENDING]: [ORDER_ITEM_STATUS.INPROGRESS, ORDER_ITEM_STATUS.CANCELLED],
  [ORDER_ITEM_STATUS.INPROGRESS]: [ORDER_ITEM_STATUS.COMPLETED],
  [ORDER_ITEM_STATUS.COMPLETED]: [],
  [ORDER_ITEM_STATUS.CANCELLED]: []
}

export const isValidTransition = (from: OrderItemStatus, to: OrderItemStatus): boolean => {
  return ORDER_ITEM_TRANSITIONS[from]?.includes(to) ?? false
}

export const getAvailableTransitions = (from: OrderItemStatus): OrderItemStatus[] => {
  return ORDER_ITEM_TRANSITIONS[from] ?? []
}

export type TransitionAction = {
  status: OrderItemStatus
  label: string
  icon: (typeof ORDER_DETAIL_STATUS_ICON)[OrderItemStatus]
  nextStatus: OrderItemStatus
}

export const getTransitionActions = (from: OrderItemStatus, currentStatus: OrderItemStatus): TransitionAction[] => {
  return getAvailableTransitions(from).map((targetStatus) => ({
    status: currentStatus,
    label: ORDER_ITEM_STATUS_LABEL[targetStatus],
    icon: ORDER_DETAIL_STATUS_ICON[targetStatus],
    nextStatus: targetStatus
  }))
}
