import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Toast } from 'react-native-toast-notifications'
import { orderApi, type OrderFilter } from '../api/order.api'
import type { CreateOrderPayload } from '../types/create-order.type'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filter: OrderFilter) => [...orderKeys.lists(), filter] as const,
  detail: (orderId: number, isCancelled?: boolean) => [...orderKeys.all, 'detail', orderId, isCancelled] as const
}

export function useOrders(filter: OrderFilter) {
  const query = useQuery({
    queryKey: orderKeys.list(filter),
    queryFn: async () => {
      const response = await orderApi.getOrders(filter)
      return response.data.data ?? []
    },
    staleTime: 30 * 1000 // 30 seconds
  })

  return {
    orders: query.data ?? [],
    isLoading: query.isPending,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useOrderDetail(orderId: number | null, isCancelled: boolean = false) {
  const query = useQuery({
    queryKey: orderKeys.detail(orderId ?? 0, isCancelled),
    queryFn: async () => {
      if (!orderId) return null
      const response = await orderApi.getOrderDetail(orderId, isCancelled)
      return response.data.data ?? null
    },
    enabled: !!orderId,
    staleTime: 30 * 1000 // 30 seconds
  })

  return {
    order: query.data ?? null,
    isLoading: query.isPending,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...orderKeys.all, 'create'] as const,
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await orderApi.createOrder(payload)
      return res.data
    },
    onSuccess: async () => {
      Toast.show('Tạo đơn hàng thành công!', { type: 'success' })
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
    }
  })
}
