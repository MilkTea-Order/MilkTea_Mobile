import type { ApiResponse } from '@/shared/types/api.type'

export type CreateOrderItemPayload = {
  menuID: number
  sizeID: number
  quantity: number
  toppingIDs: number[]
  kindOfHotpotIDs: number[]
  note?: string | null
}

export type CreateOrderPayload = {
  dinnerTableID: number
  orderByID: number
  items: CreateOrderItemPayload[]
  note?: string | null
}

export type CreateOrderResponse = ApiResponse<unknown>
