import { useAuthStore } from '@/features/auth/store/auth.store'
import { useQuery } from '@tanstack/react-query'
import { userApi } from '../apis/user.api'

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const
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
