import { Size, Status } from '@/shared/types/common.type'
import { Menu } from './menu.type'
import { DinnerTable } from './table.type'

export interface Order {
  id: number
  orderDate: string
  orderBy: number
  createdDate: string
  createdBy: number
  note: string | null
  totalAmount: number
  dinnerTable: DinnerTable
  status: Status
  orderDetails: OrderDetail[]
}
export interface OrderDetail {
  id: number
  orderID: number
  quantity: number
  price: number
  createdBy: number
  createdDate: string
  cancelledBy: number | null
  cancelledDate: string | null
  note: string | null
  kindOfHotpot1ID: number | null
  kindOfHotpot2ID: number | null
  menu: Menu
  size: Size
}

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
