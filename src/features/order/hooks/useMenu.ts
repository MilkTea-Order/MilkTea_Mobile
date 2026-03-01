import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../api/menu.api'
import type { Menu, MenuGroup, MenuSize } from '../types/menu.type'

export const menuKeys = {
  all: ['menus'] as const,
  groupTypes: () => [...menuKeys.all, 'group-types'] as const,
  groups: (groupId?: number | null, name?: string) => [...menuKeys.all, 'groups', groupId ?? null, name ?? ''] as const,
  sizes: (menuId: number) => [...menuKeys.all, 'sizes', menuId] as const
}

export function useMenuGroups() {
  const query = useQuery({
    queryKey: menuKeys.groupTypes(),
    queryFn: async () => {
      const res = await menuApi.getGroupTypes()
      return (res.data.data ?? []) as MenuGroup[]
    },
    staleTime: 5 * 60 * 1000
  })

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useMenusByGroupAndName(groupId?: number | null, name?: string) {
  const query = useQuery({
    queryKey: menuKeys.groups(groupId, name),
    queryFn: async () => {
      const res = await menuApi.getMenus(groupId ?? undefined, name)
      return (res.data.data ?? []) as Menu[]
    },
    staleTime: 3 * 60 * 1000
  })
  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}

export function useMenuSizes(menuId?: number) {
  const query = useQuery({
    queryKey: menuKeys.sizes(menuId ?? 0),
    queryFn: async () => {
      if (menuId == null) return [] as MenuSize[]
      const res = await menuApi.getMenuSizes(menuId)
      return (res.data.data ?? []) as MenuSize[]
    },
    enabled: menuId != null,
    staleTime: 3 * 60 * 1000
  })

  return {
    data: query.data ?? [],
    isLoading: query.isPending,
    isRefetching: query.isRefetching,
    refetch: query.refetch
  }
}
