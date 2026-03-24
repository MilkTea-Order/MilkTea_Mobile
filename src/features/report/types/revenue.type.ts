import { Order } from '@/features/order/types/order.type'

export interface RevenueReport {
  // orders: Order[]
  dates: RevenueReportDate[]
  statics: RevenueStatics
}

export interface RevenueReportDate {
  date: string
  totalAmount: number
  orders: Order[]
}

export interface RevenueStatics {
  totalAmount: number
  totalAmountShopee: number
  totalAmountBank: number
  totalAmountGrab: number
  totalAmountCash: number
}
