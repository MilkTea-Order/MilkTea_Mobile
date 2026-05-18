import { PaymentMethod } from '@/shared/constants/payment'
import { ORDER_ITEM_STATUS, OrderItemStatus, OrderStatus, STATUS } from '@/shared/constants/status'
import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { getKeyByValue } from '@/shared/utils/utils'
import { AxiosResponse } from 'axios'
import { CreateOrderItemPayload, CreateOrderPayload, Order } from '../types/order.type'

export type OrderFilter = {
  statusId: OrderStatus
  fromDate?: string | null // ISO string UTC
  toDate?: string | null // ISO string UTC
}

export type KitchenOrderFilter = {
  orderItemStatusId: OrderItemStatus
}

export type OrderDetailApiResponse = ApiResponse<Order>

export const orderApi = {
  getOrders(filter: OrderFilter): Promise<AxiosResponse<ApiResponse<Order[]>>> {
    return http.get<ApiResponse<Order[]>>(URL.ORDERS, {
      params: {
        status: getKeyByValue(STATUS.ORDER, filter.statusId),
        fromDate: filter.fromDate ?? undefined,
        toDate: filter.toDate ?? undefined
      }
    })
  },
  createOrder(payload: CreateOrderPayload): Promise<AxiosResponse<ApiResponse<Order>>> {
    return http.post<ApiResponse<Order>>(URL.ORDERS, payload)
  },

  getKitchenOrders(filter: KitchenOrderFilter): Promise<AxiosResponse<ApiResponse<{ orders: Order[] }>>> {
    return http.get<ApiResponse<{ orders: Order[] }>>(URL.ORDERS_KITCHEN, {
      params: { orderItemStatus: getKeyByValue(STATUS.ORDER_ITEM, filter.orderItemStatusId) }
    })
  },

  updateOrderDetailStatus(
    items: {
      orderID: number
      orderDetailID: number
      status: keyof typeof ORDER_ITEM_STATUS
      reason?: string
    }[]
  ): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.patch<ApiResponse<object>>(`${URL.ORDERS}/items/status`, { items })
  },

  getOrderDetail(orderId: number, isCancelled: boolean = false): Promise<AxiosResponse<OrderDetailApiResponse>> {
    return http.get<OrderDetailApiResponse>(`${URL.ORDERS}/${orderId}`, {
      params: { isCancelled }
    })
  },

  cancelOrderItems(orderId: number, orderDetailId: number): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.patch<ApiResponse<object>>(`${URL.ORDERS}/${orderId}/items/${orderDetailId}/cancel`)
  },

  updateOrderItem(
    orderId: number,
    orderDetailId: number,
    payload: { quantity?: number; note?: string | null; sizeId?: number }
  ): Promise<AxiosResponse<ApiResponse<{ status: boolean }>>> {
    return http.patch<ApiResponse<{ status: boolean }>>(`${URL.ORDERS}/${orderId}/items/${orderDetailId}`, payload)
  },

  addOrderItems(
    orderId: number,
    payload: { items: CreateOrderItemPayload[] }
  ): Promise<AxiosResponse<ApiResponse<{ status: boolean }>>> {
    return http.patch<ApiResponse<{ status: boolean }>>(`${URL.ORDERS}/${orderId}/add-items`, payload)
  },

  cancelOrder(orderId: number): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.patch<ApiResponse<object>>(`${URL.ORDERS}/${orderId}/cancel`)
  },

  changeTable(orderId: number, newTableID: number): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.patch<ApiResponse<object>>(`${URL.ORDERS}/${orderId}/change-table`, { newTableID })
  },

  mergeTable(orderId: number, targetTableID: number): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.patch<ApiResponse<object>>(`${URL.ORDERS}/${orderId}/merge-table`, { targetTableID })
  },

  payment(orderId: number, paymentMethod: PaymentMethod): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.post<ApiResponse<object>>(`${URL.ORDERS}/${orderId}/payment`, { paymentMethod })
  },
  collectedOrder(orderId: number): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.post<ApiResponse<object>>(`${URL.ORDERS}/${orderId}/collected`)
  }
}
