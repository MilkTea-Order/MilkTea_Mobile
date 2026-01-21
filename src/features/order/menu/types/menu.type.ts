import { ApiResponse } from '@/shared/types/api.type'

export type MenuGroupType = {
  MenuGroupID: number
  MenuGroupName: string
  StatusID: number
  StatusName: string
  Quantity: number
}

export type MenuItem = {
  MenuID: number
  MenuCode: string
  MenuName: string
  MenuGroupID: number
  MenuGroupName: string
  StatusID: number
  StatusName: string
}

export type MenuSize = {
  SizeID: number
  SizeName: string
  RankIndex: number
  Price: number
  CurrencyName: string
  CurrencyCode: string
}

export type MenuGroupTypeResponse = ApiResponse<MenuGroupType[]>
export type MenuItemsResponse = ApiResponse<MenuItem[]>
export type MenuSizesResponse = ApiResponse<MenuSize[]>
