import { Menu, MenuGroup, MenuSize } from '@/features/order/types/menu.type'
import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import type { AxiosResponse } from 'axios'

export const menuApi = {
  getGroupTypes(): Promise<AxiosResponse<ApiResponse<MenuGroup[]>>> {
    return http.get<ApiResponse<MenuGroup[]>>(URL.MENU_GROUP_TYPES_AVAILABLE)
  },

  getMenus(groupId?: number, name?: string): Promise<AxiosResponse<ApiResponse<Menu[]>>> {
    // const params: Record<string, any> = {}
    // if (name && name.trim()) {
    //   params.menuName = name.trim()
    // }
    // if (groupId) {
    //   params.groupID = groupId
    // }
    return http.get<ApiResponse<Menu[]>>(`${URL.MENUS_AVAILABLE_BASE}`, {
      params: {
        ...(groupId != null && { groupID: groupId }),
        ...(name?.trim() && { menuName: name.trim() })
      }
    })
  },

  getMenusByGroup(groupId: number): Promise<AxiosResponse<ApiResponse<Menu[]>>> {
    return http.get<ApiResponse<Menu[]>>(`${URL.MENUS_GROUP_BASE}/${groupId}/items/available`)
  },

  getMenuSizes(menuId: number): Promise<AxiosResponse<ApiResponse<MenuSize[]>>> {
    return http.get<ApiResponse<MenuSize[]>>(`${URL.MENU_SIZES_BASE}/${menuId}/sizes`)
  }
}
