import { Currency, Size, Status } from '@/shared/types/common.type'

export interface MenuGroup {
  id: number
  name: string
  status: Status
  quantity: number
}

export interface Menu {
  id: number
  menuGroupID: number
  code: string
  name: string
  image: string | null
  status: Status
  unit: Unit | null
  size: MenuSize[] | null
  note: string | null
}

export interface MenuSize extends Size {
  price: Price | null
}

export interface Price {
  priceListID: number
  price: number
  currency: Currency | null
}

export interface Unit {
  id: number
  name: string
}
