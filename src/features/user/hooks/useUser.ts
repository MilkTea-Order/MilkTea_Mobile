import { useAuthStore } from '@/features/auth/store/auth.store'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../apis/user.api'

export const userKeys = {
  all: ['user'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  me: () => [...userKeys.all, 'me'] as const
}

export function useUserList(enabled: boolean = true) {
  const query = useQuery({
    queryKey: userKeys.list(),
    queryFn: async () => {
      const response = await userApi.getUserList()
      return response.data.data.users ?? []
    },
    staleTime: 5 * 60 * 1000,
    enabled: enabled
  })
  return {
    users: query.data ?? [],
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}
export function useMe() {
  const tokens = useAuthStore((state) => state.tokens)

  const query = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await userApi.getMe()
      return response.data
    },
    enabled: !!tokens?.accessToken,
    staleTime: 5 * 60 * 1000
  })

  return query
}
