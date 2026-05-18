import { ERROR_CODE } from '@/shared/constants/errorCode'
import { ORDER_ITEM_STATUS } from '@/shared/constants/status'
import { extractErrorDetails } from '@/shared/utils/formErrors'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { KitchenOrderFilter, orderApi } from '../api/order.api'

export const kitchenKeys = {
  all: ['kitchen-orders'] as const,
  lists: () => [...kitchenKeys.all, 'list'] as const,
  list: (filter: KitchenOrderFilter) => [...kitchenKeys.lists(), filter] as const
}

export function useKitchenOrders(filter: KitchenOrderFilter) {
  const query = useQuery({
    queryKey: kitchenKeys.list(filter),
    queryFn: async () => {
      const response = await orderApi.getKitchenOrders(filter)
      return response.data.data.orders ?? []
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData
  })

  return {
    orders: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useUpdateOrderDetailStatus(options?: {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...kitchenKeys.all, 'update-status'] as const,
    mutationFn: async (
      items: {
        orderId: number
        orderDetailId: number
        status: keyof typeof ORDER_ITEM_STATUS
        reason?: string
      }[]
    ) => {
      const res = await orderApi.updateOrderDetailStatus(
        items.map((item) => ({
          orderID: item.orderId,
          orderDetailID: item.orderDetailId,
          status: item.status,
          reason: item.reason
        }))
      )
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: kitchenKeys.all })
      options?.onSuccess?.(data)
      return data
    },
    onError: (error) => {
      const details = extractErrorDetails(error, 'order')
      const e9999 = details.find((e) => e.code === ERROR_CODE.E9999)
      if (e9999) {
        Alert.alert('Lỗi', e9999.message ?? 'Đã xảy ra lỗi hệ thống')
        return
      }

      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái. Vui lòng thử lại')
      options?.onError?.(error)
    }
  })
}
