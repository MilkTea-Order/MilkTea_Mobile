import { URL } from '@/shared/constants/urls'
import http from '@/shared/utils/http'
import type { AxiosResponse } from 'axios'
import type { MenuGroupTypeResponse, MenuItemsResponse, MenuSizesResponse } from '../types/menu.type'

export const menuApi = {
  getGroupTypes(): Promise<AxiosResponse<MenuGroupTypeResponse>> {
    return http.get<MenuGroupTypeResponse>(URL.MENU_GROUP_TYPES)
  },

  getMenusByGroup(groupId: number): Promise<AxiosResponse<MenuItemsResponse>> {
    return http.get<MenuItemsResponse>(`${URL.MENUS_GROUP_BASE}/${groupId}/items/avaliable`)
  },

  getMenuSizes(menuId: number): Promise<AxiosResponse<MenuSizesResponse>> {
    return http.get<MenuSizesResponse>(`${URL.MENU_SIZES_BASE}/${menuId}/sizes`)
  }
}
