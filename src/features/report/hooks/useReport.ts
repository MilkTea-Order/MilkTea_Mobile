import { PaymentMethod } from '@/shared/constants/other'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { reportApi } from '../api/report.api'

export const reportKeys = {
  all: ['report'] as const,
  inventory: () => [...reportKeys.all, 'inventory'] as const,
  revenue: (filter: { paymentMethod: PaymentMethod; fromDate: string; toDate: string }) =>
    [...reportKeys.all, 'revenue', filter.paymentMethod, filter.fromDate, filter.toDate] as const
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

export function useRevenueReport(filter: { paymentMethod: PaymentMethod; fromDate: string; toDate: string }) {
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
      orders: [],
      statics: {
        totalAmount: 0,
        totalAmountShopee: 0,
        totalAmountBank: 0,
        totalAmountGrab: 0,
        totalAmountCash: 0
      }
    },
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}
