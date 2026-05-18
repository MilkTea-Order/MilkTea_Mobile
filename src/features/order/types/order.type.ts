import { PaymentMethod } from '@/shared/constants/payment'
import { Size, Status } from '@/shared/types/common.type'
import { Menu } from './menu.type'
import { DinnerTable } from './table.type'

export interface Order {
  orderId: number
  dinnerTable: DinnerTable
  status: Status
  note: string | null
  totalAmount: number
  items: OrderDetail[]

  orderDate: string
  orderBy: number

  createdDate: string
  createdBy: number

  paymentMethod: PaymentMethod | null
  paymentDate: string | null
  paymentBy: number | null

  actionDate: string | null
  actionBy: number | null

  cancelledDate: string | null
  cancelledBy: number | null
}
export interface OrderDetail {
  id: number
  menu: Menu
  size: Size
  quantity: number
  status: Status
  price: number
  note: string | null
  kindOfHotpot1Id: number | null
  kindOfHotpot2Id: number | null

  createdBy: number
  createdDate: string
  cancelledBy: number | null
  cancelledDate: string | null
}

export interface OrderItem {
  menuId: number
  sizeId: number
  quantity: number
  price: number
  menuName: string
  sizeName: string
  menuImage?: string | null
  note?: string | null
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
