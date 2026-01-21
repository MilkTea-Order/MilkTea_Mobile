import { useQuery } from '@tanstack/react-query'
import { tableApi } from '../api/table.api'
import type { DinnerTable } from '../types/table.type'

export const tableKeys = {
  all: ['tables'] as const,
  lists: () => [...tableKeys.all, 'list'] as const,
  list: (statusID?: number) => [...tableKeys.lists(), statusID ?? 'all'] as const
}

export function useTables(statusID?: number) {
  const query = useQuery({
    queryKey: tableKeys.list(statusID),
    queryFn: async () => {
      const res = await tableApi.getTables(statusID)
      return (res.data.data ?? []) as DinnerTable[]
    },
    staleTime: 30 * 1000
  })

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}
