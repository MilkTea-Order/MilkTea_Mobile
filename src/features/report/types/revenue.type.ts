import { Order } from '@/features/order/types/order.type'

export interface RevenueReport {
  orders: Order[]
  statics: RevenueStatics
}

export interface RevenueStatics {
  totalAmount: number
  totalAmountShopee: number
  totalAmountBank: number
  totalAmountGrab: number
  totalAmountCash: number
}
