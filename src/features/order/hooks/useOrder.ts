import { ERROR_CODE } from '@/shared/constants/errorCode'
import { extractErrorDetails } from '@/shared/utils/formErrors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
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

export function useCancelOrderItems(
  orderId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...orderKeys.all, 'cancel-items', orderId] as const,
    mutationFn: async (orderDetailIDs: number[]) => {
      const res = await orderApi.cancelOrderItems(orderId, orderDetailIDs)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, true) })
      options?.onSuccess?.(data)
      return data
    },
    onError: (error) => {
      options?.onError?.(error)
    }
  })
}

export function useUpdateOrderItem(
  orderId: number,
  orderDetailId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: [...orderKeys.all, 'update-item', orderId, orderDetailId] as const,
    mutationFn: async ({ quantity, note }: { quantity?: number; note?: string | null }) => {
      const res = await orderApi.updateOrderItem(orderId, orderDetailId, { quantity, note })
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, true) })
      options?.onSuccess?.(data)
      return data
    },
    onError: (error: any) => {
      const details = extractErrorDetails(error, 'order')

      const byField = (field: string) => details.find((e) => e.field?.toLowerCase() === field.toLowerCase())

      const orderIdError = byField('orderid')
      if (orderIdError) {
        if (orderIdError.code === ERROR_CODE.E0001 || orderIdError.code === ERROR_CODE.E0036) {
          Toast.show(orderIdError.message, {
            type: 'danger',
            placement: 'top',
            duration: 3000,
            onClose: () => router.replace('/(protected)/(tabs)')
          })
          return
        }

        if (orderIdError.code === ERROR_CODE.E0042) {
          Toast.show(orderIdError.message, {
            type: 'danger',
            placement: 'top'
          })
          return
        }
      }

      const orderDetailIdError = byField('orderdetailid')
      if (orderDetailIdError) {
        Toast.show(orderDetailIdError.message, {
          type: 'danger',
          placement: 'top',
          onClose: () => router.back()
        })
        return
      }

      const quantityError = byField('quantity')
      if (quantityError?.code === ERROR_CODE.E0036) {
        Toast.show(quantityError.message, {
          type: 'warning',
          placement: 'top'
        })
        return
      }

      const systemError = byField('updateorderdetail')
      if (systemError?.code === ERROR_CODE.E9999) {
        Toast.show(systemError.message, {
          type: 'danger',
          placement: 'top'
        })
        return
      }

      Toast.show('Đã xảy ra lỗi. Vui lòng thử lại', {
        type: 'danger',
        placement: 'top'
      })
    }
  })
}
