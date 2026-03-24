import { PaymentMethod } from '@/shared/constants/other'
import { OrderStatus } from '@/shared/constants/status'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { reportApi } from '../api/report.api'
import { AddFinanceTransactionPayload } from '../types/finance.type'

export const reportKeys = {
  all: ['report'] as const,
  inventory: () => [...reportKeys.all, 'inventory'] as const,
  revenue: (filter: { paymentMethod: PaymentMethod; fromDate: string; toDate: string; orderStatusId: OrderStatus }) =>
    [...reportKeys.all, 'revenue', filter.paymentMethod, filter.fromDate, filter.toDate, filter.orderStatusId] as const,
  finance: (filter?: { fromDate: string; toDate: string }) =>
    filter ? [...reportKeys.all, 'finance', filter.fromDate, filter.toDate] : ([...reportKeys.all, 'finance'] as const),
  financeGroup: () => [...reportKeys.all, 'financeGroup'] as const
}

export function useInventoryReport() {
  const query = useQuery({
    queryKey: reportKeys.inventory(),
    queryFn: async () => {
      const response = await reportApi.getMaterialInventoryReport()
      return response.data.data ?? []
    },
    staleTime: 30 * 1000
    // placeholderData: keepPreviousData
  })

  return {
    inventory: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useRevenueReport(filter: {
  paymentMethod: PaymentMethod
  fromDate: string
  toDate: string
  orderStatusId: OrderStatus
}) {
  const query = useQuery({
    queryKey: reportKeys.revenue(filter),
    queryFn: async () => {
      const response = await reportApi.getRevenueReport(filter)
      return response.data.data ?? []
    },
    // refetchOnWindowFocus: true,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData
  })

  return {
    revenue: query.data ?? {
      dates: [],
      statics: { totalAmount: 0, totalAmountShopee: 0, totalAmountBank: 0, totalAmountGrab: 0, totalAmountCash: 0 }
    },
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useFinanceReport(filter: { fromDate: string; toDate: string }) {
  const query = useQuery({
    queryKey: reportKeys.finance(filter),
    queryFn: async () => {
      const response = await reportApi.getFinanceReport(filter)
      return response.data.data ?? []
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData
  })

  return {
    finance: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useFinanceGroupReport(enabled: boolean = true) {
  const query = useQuery({
    queryKey: reportKeys.financeGroup(),
    queryFn: async () => {
      const response = await reportApi.getFinanceGroupReport()
      return response.data.data ?? []
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    enabled: enabled
  })
  return {
    groups: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useAddFinanceTransaction(options?: {
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [...reportKeys.all, 'addFinanceTransaction'] as const,
    mutationFn: async (payload: AddFinanceTransactionPayload) => {
      const response = await reportApi.addFinanceTransaction(payload)
      return response.data.data ?? []
    },
    onError: (error: any) => {
      options?.onError?.(error)
      Alert.alert('Lỗi', error.message ?? 'Không thể thêm giao dịch tài chính')
      return
    },
    onSuccess: async (data: any) => {
      options?.onSuccess?.(data)
      await queryClient.invalidateQueries({ queryKey: reportKeys.finance() })
      return data
    }
  })
}
