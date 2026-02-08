import { Menu, MenuGroup, MenuSize } from '@/features/order/types/menu.type'
import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import type { AxiosResponse } from 'axios'

export const menuApi = {
  getGroupTypes(): Promise<AxiosResponse<ApiResponse<MenuGroup[]>>> {
    return http.get<ApiResponse<MenuGroup[]>>(URL.MENU_GROUP_TYPES_AVAILABLE)
  },

  getMenusByGroup(groupId: number): Promise<AxiosResponse<ApiResponse<Menu[]>>> {
    return http.get<ApiResponse<Menu[]>>(`${URL.MENUS_GROUP_BASE}/${groupId}/items/available`)
  },

  getMenuSizes(menuId: number): Promise<AxiosResponse<ApiResponse<MenuSize[]>>> {
    return http.get<ApiResponse<MenuSize[]>>(`${URL.MENU_SIZES_BASE}/${menuId}/sizes`)
  }
}
