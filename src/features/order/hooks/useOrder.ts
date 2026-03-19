import { ERROR_CODE } from '@/shared/constants/errorCode'
import { PaymentMethod } from '@/shared/constants/other'
import { STATUS } from '@/shared/constants/status'
import type { ApiErrorResponse } from '@/shared/types/api.type'
import { extractErrorDetails } from '@/shared/utils/formErrors'
import { isApiError } from '@/shared/utils/utils'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router, useRouter } from 'expo-router'
import { useMemo } from 'react'
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
  // Clean filter - only include fromDate and toDate if they are not null
  const cleanedFilter = useMemo(() => {
    return {
      statusId: filter.statusId,
      fromDate: filter.fromDate ?? undefined,
      toDate: filter.toDate ?? undefined
    }
  }, [filter.statusId, filter.fromDate, filter.toDate])

  const query = useQuery({
    queryKey: orderKeys.list(filter),
    queryFn: async () => {
      const response = await orderApi.getOrders(cleanedFilter)
      return response.data.data ?? []
    },
    staleTime: 30 * 1000
    // placeholderData: keepPreviousData
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
      queryClient.setQueriesData(
        { queryKey: orderKeys.list({ statusId: STATUS.ORDER.UNPAID } as OrderFilter), exact: false },
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

export function usePayment(
  orderId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: [...orderKeys.all, 'payment', orderId] as const,
    mutationFn: async (paymentMethod: PaymentMethod) => {
      const res = await orderApi.payment(orderId, paymentMethod)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({
        queryKey: orderKeys.list({ statusId: STATUS.ORDER.NO_COLLECTED } as OrderFilter)
      })
      await queryClient.invalidateQueries({
        queryKey: orderKeys.list({ statusId: STATUS.ORDER.UNPAID } as OrderFilter)
      })

      router.replace({
        pathname: '/(protected)/(tabs)',
        params: {
          filter: STATUS.ORDER.NO_COLLECTED
        }
      })

      options?.onSuccess?.(data)
      return data
    },
    onError: (error: any) => {
      const details = extractErrorDetails(error, 'order')

      const e0042 = details.find((e) => e.code === ERROR_CODE.E0042)
      if (e0042) {
        Alert.alert('Lỗi', e0042.message ?? 'Không thể thanh toán ở trạng thái hiện tại')
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

      Alert.alert('Lỗi', 'Không thể thanh toán. Vui lòng thử lại')
      options?.onError?.(error)
    }
  })
}

export function useCollectedOrder(
  orderId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...orderKeys.all, 'collected-order', orderId] as const,
    mutationFn: async () => {
      const res = await orderApi.collectedOrder(orderId)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      // Toast.show('Thu tiền thành công', {
      //   type: 'success',
      //   placement: 'top'
      // })
      router.replace({
        pathname: '/(protected)/(tabs)',
        params: {
          filter: STATUS.ORDER.PAID
        }
      })
      options?.onSuccess?.(data)
      return data
    },
    onError: (error: any) => {
      options?.onError?.(error)
      const details = extractErrorDetails(error, 'order')
      const e0042 = details.find((e) => e.code === ERROR_CODE.E0042)
      if (e0042) {
        Alert.alert('Lỗi', e0042.message ?? 'Không thể thu tiền ở trạng thái hiện tại')
        return
      }
      const e0001Or0036 = details.find((e) => [ERROR_CODE.E0001, ERROR_CODE.E0036].includes(e.code as any))
      if (e0001Or0036) {
        Alert.alert('Lỗi', e0001Or0036.message ?? 'Đơn hàng không tồn tại', [
          { text: 'OK', onPress: () => router.replace('/(protected)/(tabs)') }
        ])
        return
      }
      const e0041 = details.find((e) => e.code === ERROR_CODE.E0041)
      if (e0041) {
        console.log(e0041)
        const materialMessages = Array.isArray(e0041.meta)
          ? (e0041.meta as {
              materialName: string
              requiredQuantity: number
              availableQuantity: number
            }[])
          : []
        const finalMessage = `${e0041.message}\n${materialMessages.map((m) => `${m.materialName} (Xuất ${m.requiredQuantity}, Tồn ${m.availableQuantity})`).join('\n')}`

        Alert.alert('Lỗi', finalMessage, [
          {
            text: 'OK',
            onPress: () => {
              router.dismissAll()
            }
          }
        ])
        return
      }
      const e9999 = details.find((e) => e.code === ERROR_CODE.E9999)
      if (e9999) {
        Alert.alert('Lỗi', e9999.message ?? 'Đã xảy ra lỗi hệ thống')
        return
      }
      Alert.alert('Lỗi', 'Không thể thu tiền. Vui lòng thử lại')
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
      router.replace({
        pathname: '/(protected)/(tabs)',
        params: {
          filter: STATUS.ORDER.CANCELED
        }
      })
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

export function useMergeTable(
  orderId: number,
  options?: { onSuccess?: (data: any) => void; onError?: (error: any) => void }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [...orderKeys.all, 'merge-table', orderId] as const,
    mutationFn: async (targetTableID: number) => {
      const res = await orderApi.mergeTable(orderId, targetTableID)
      return res.data
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, false) })
      await queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      // await queryClient.invalidateQueries({ queryKey: tableKeys.listEmpty(true) })
      // Alert.alert('Thành công', 'Gộp bàn thành công')
      options?.onSuccess?.(data)
    },
    onError: (error: any) => {
      options?.onError?.(error)
      const details = extractErrorDetails(error, 'order')
      const e0042 = details.find((e) => e.code === ERROR_CODE.E0042)
      if (e0042) {
        Alert.alert('Lỗi', e0042.message ?? 'Không thể gộp bàn ở trạng thái hiện tại')
        router.dismissAll()
        return
      }
      const e0001 = details.find((e) => [ERROR_CODE.E0001].includes(e.code as any))
      if (e0001) {
        Alert.alert('Lỗi', e0001.message ?? 'Đơn hàng không tồn tại')
        router.dismissAll()
        return
      }
      const e0002 = details.find((e) => e.code === ERROR_CODE.E0002)
      if (e0002) {
        Alert.alert('Lỗi', e0002.message ?? 'Không thể gộp bàn vào chính nó')
        return
      }
      Alert.alert('Lỗi', 'Không thể gộp bàn. Vui lòng thử lại')
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
      await queryClient.invalidateQueries({ queryKey: tableKeys.listEmpty(true) })
      // Alert.alert('Thành công', 'Chuyển bàn thành công')
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
      await queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId, true) })
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
