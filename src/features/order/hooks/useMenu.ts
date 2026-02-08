import { useQuery } from '@tanstack/react-query'
import { menuApi } from '../api/menu.api'
import type { Menu, MenuGroup, MenuSize } from '../types/menu.type'

export const menuKeys = {
  all: ['menus'] as const,
  groupTypes: () => [...menuKeys.all, 'group-types'] as const,
  groups: (groupId: number) => [...menuKeys.all, 'groups', groupId] as const,
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

export function useMenusByGroup(groupId?: number) {
  const query = useQuery({
    queryKey: menuKeys.groups(groupId ?? 0),
    queryFn: async () => {
      if (groupId == null) return [] as Menu[]
      const res = await menuApi.getMenusByGroup(groupId)
      return (res.data.data ?? []) as Menu[]
    },
    enabled: groupId != null,
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
