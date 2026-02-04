import { ApiResponse } from '@/shared/types/api.type'

export type MenuGroupType = {
  menuGroupId: number
  menuGroupName: string
  statusID: number
  statusName: string
  quantity: number
}

export type MenuItem = {
  menuId: number
  menuCode: string
  menuName: string
  menuImage: string | null
  menuGroupId: number
  menuGroupName: string
  statusId: number
  statusName: string
}

export type MenuSize = {
  sizeId: number
  sizeName: string
  rankIndex: number
  price: number
  currencyName: string
  currencyCode: string
}

export type MenuGroupTypeResponse = ApiResponse<MenuGroupType[]>
export type MenuItemsResponse = ApiResponse<MenuItem[]>
export type MenuSizesResponse = ApiResponse<MenuSize[]>
