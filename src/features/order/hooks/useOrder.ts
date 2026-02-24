import { ERROR_CODE } from '@/shared/constants/errorCode'
import { STATUS } from '@/shared/constants/status'
import type { ApiErrorResponse } from '@/shared/types/api.type'
import { extractErrorDetails } from '@/shared/utils/formErrors'
import { isApiError } from '@/shared/utils/utils'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { Toast } from 'react-native-toast-notifications'
import { orderApi, OrderFilter } from '../api/order.api'
import type { CreateOrderItemPayload, CreateOrderPayload, Order } from '../types/order.type'
import { parseOrderError } from '../utils/parseOrderError'
import { tableKeys } from './useTable'

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
    staleTime: 30 * 1000
  })

  return {
    orders: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
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
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData
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
    onSuccess: async (data) => {
      Toast.show('Tạo đơn hàng thành công!', { type: 'success' })
      queryClient.setQueriesData(
        { queryKey: orderKeys.list(STATUS.ORDER.UNPAID), exact: false },
        (old: Order[] | undefined) => {
          const prev = old ?? []

          const withoutDup = prev.filter((o) => o.orderID !== data.data.orderID)
          return [data.data, ...withoutDup]
        }
      )
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
    mutationFn: async (orderDetailId: number) => {
      const res = await orderApi.cancelOrderItems(orderId, orderDetailId)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      Alert.alert('Thành công', 'Hủy món thành công')
      options?.onSuccess?.(data)
      return data
    },
    onError: (error) => {
      const details = extractErrorDetails(error, 'order')
      if (details.some((error) => [ERROR_CODE.E0042].includes(error.code as any))) {
        Alert.alert('Lỗi', error.message)
        return
      }
      if (details.some((error) => [ERROR_CODE.E0001, ERROR_CODE.E0036].includes(error.code as any))) {
        Alert.alert('Lỗi', error.message, [{ text: 'OK', onPress: () => router.replace('/(protected)/(tabs)') }])
        return
      }
      if (details.some((error) => [ERROR_CODE.E9999].includes(error.code as any))) {
        Alert.alert('Lỗi', error.message)
        return
      }
      options?.onError?.(error)
    }
  })
}

export function useCancelOrder(options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: [...orderKeys.all, 'cancel-order'] as const,
    mutationFn: async (orderId: number) => {
      const res = await orderApi.cancelOrder(orderId)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      Alert.alert('Thành công', 'Hủy đơn hàng thành công', [
        {
          text: 'OK',
          onPress: () =>
            router.replace({
              pathname: '/(protected)/(tabs)',
              params: {
                filter: STATUS.ORDER.CANCELED
              }
            })
        }
      ])
      options?.onSuccess?.(data)
      return data
    },
    onError: (error) => {
      const details = extractErrorDetails(error, 'order')

      const e0042 = details.find((e) => e.code === ERROR_CODE.E0042)
      if (e0042) {
        Alert.alert('Lỗi', e0042.message ?? 'Không thể hủy đơn hàng ở trạng thái hiện tại')
        return
      }

      const e0001Or0036 = details.find((e) => [ERROR_CODE.E0001, ERROR_CODE.E0036].includes(e.code as any))
      if (e0001Or0036) {
        Alert.alert('Lỗi', e0001Or0036.message ?? 'Đơn hàng không tồn tại', [
          { text: 'OK', onPress: () => router.replace('/(protected)/(tabs)') }
        ])
        return
      }
      const e9999 = details.find((e) => e.code === ERROR_CODE.E9999)
      if (e9999) {
        Alert.alert('Lỗi', e9999.message ?? 'Đã xảy ra lỗi hệ thống')
        return
      }

      Alert.alert('Lỗi', 'Không thể hủy đơn hàng. Vui lòng thử lại')
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
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
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

export function useChangeTable(
  orderId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...orderKeys.all, 'change-table', orderId] as const,
    mutationFn: async (newTableID: number) => {
      const res = await orderApi.changeTable(orderId, newTableID)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      await queryClient.invalidateQueries({ queryKey: tableKeys.listEmpty() })
      Alert.alert('Thành công', 'Chuyển bàn thành công')
      options?.onSuccess?.(data)
    },
    onError: (error: any) => {
      options?.onError?.(error)
      const details = extractErrorDetails(error, 'order')
      console.log('details', details)
      const e0042 = details.find((e) => e.code === ERROR_CODE.E0042)
      if (e0042) {
        Alert.alert('Lỗi', e0042.message ?? 'Không thể chuyển bàn ở trạng thái hiện tại')
        return
      }
      const e0001Or0036 = details.find((e) => [ERROR_CODE.E0001, ERROR_CODE.E0036].includes(e.code as any))
      if (e0001Or0036) {
        Alert.alert('Lỗi', e0001Or0036.message ?? 'Đơn hàng không tồn tại')
        return
      }
      Alert.alert('Lỗi', 'Không thể chuyển bàn. Vui lòng thử lại')
    }
  })
}

export function useAddOrderItems(
  orderId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: [...orderKeys.all, 'add-items', orderId] as const,
    mutationFn: async (payload: { items: CreateOrderItemPayload[] }) => {
      const res = await orderApi.addOrderItems(orderId, payload)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      options?.onSuccess?.(data)
      return data
    },
    onError: (error: any) => {
      if (isApiError(error)) {
        const result = parseOrderError(error as ApiErrorResponse)
        // Trường hợp có nhiều items bị lỗi
        if (result.type === 'items') {
          // Hiển thị tất cả các lỗi của items
          result.items.forEach((it) => {
            Toast.show(it.message, { type: 'danger', placement: 'top' })
          })
          if (result.message) {
            Toast.show(result.message, { type: 'danger', placement: 'top' })
          }
          options?.onError?.(result)
          return
        }
        // Trường hợp chỉ có 1 item bị lỗi
        if (result.type === 'item') {
          Toast.show(result.message, { type: 'danger', placement: 'top' })
          options?.onError?.(result)
          return
        }
        // Trường hợp chỉ cần toast lỗi
        if (result.type === 'alert') {
          //Nếu lỗi liên quan tới order: không tồn tại hay bé hơn 0
          if (
            result.code === ERROR_CODE.E0001 ||
            (result.code === ERROR_CODE.E0036 && result.field?.toLowerCase() === 'orderid')
          ) {
            Toast.show(result.message, {
              type: 'info',
              placement: 'top',
              duration: 3000,
              onClose: () => router.replace('/(protected)/(tabs)')
            })
            return
          }
          // Lỗi liên quan tới stauts của order
          if (result.code === ERROR_CODE.E0042) {
            Toast.show(result.message, {
              type: 'info',
              placement: 'top',
              duration: 3000
            })
            router.dismissAll()
            return
          }
          options?.onError?.(result)
          return
        }
      }
      options?.onError?.(error)
    }
  })
}
