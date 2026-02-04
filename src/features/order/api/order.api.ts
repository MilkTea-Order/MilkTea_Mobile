import { OrderStatus } from '@/shared/constants/status'
import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
import type { CreateOrderPayload, CreateOrderResponse } from '../types/create-order.type'
import { Order } from '../types/order.type'

export type OrderFilter = OrderStatus
export type OrdersApiResponse = ApiResponse<Order[]>
export type OrderDetailApiResponse = ApiResponse<Order>

export const orderApi = {
  getOrders(filter: OrderFilter): Promise<AxiosResponse<OrdersApiResponse>> {
    const params = { StatusID: filter }
    return http.get<OrdersApiResponse>(URL.ORDERS, { params })
  },
  getOrderDetail(orderId: number, isCancelled: boolean = false): Promise<AxiosResponse<OrderDetailApiResponse>> {
    return http.get<OrderDetailApiResponse>(`${URL.ORDERS}/${orderId}`, {
      params: { isCancelled }
    })
  },
  createOrder(payload: CreateOrderPayload): Promise<AxiosResponse<CreateOrderResponse>> {
    return http.post<CreateOrderResponse>(URL.ORDERS, payload)
  },
  cancelOrderItems(
    orderId: number,
    orderDetailIDs: number[]
  ): Promise<AxiosResponse<ApiResponse<{ cancelledDetailIDs: number[] }>>> {
    return http.patch<ApiResponse<{ cancelledDetailIDs: number[] }>>(`${URL.ORDERS}/${orderId}/items/cancel`, {
      orderDetailIDs
    })
  },
  updateOrderItem(
    orderId: number,
    orderDetailId: number,
    payload: { quantity?: number; note?: string | null; sizeId?: number }
  ): Promise<AxiosResponse<ApiResponse<{ status: boolean }>>> {
    return http.patch<ApiResponse<{ status: boolean }>>(
      `${URL.ORDERS}/${orderId}/items/${orderDetailId}/update`,
      payload
    )
  }
}
