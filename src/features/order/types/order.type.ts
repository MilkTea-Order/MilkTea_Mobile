export interface DinnerTable {
  id: number
  code: string
  name: string
  position: string | null
  numberOfSeats: number
  statusName: string
  note: string | null
}

export interface OrderStatus {
  id: number
  name: string
}

export interface Order {
  orderID: number
  dinnerTableID: number
  orderDate: string
  orderBy: number
  createdDate: string
  createdBy: number
  statusID: number
  note: string | null
  totalAmount: number
  dinnerTable: DinnerTable
  status: OrderStatus
  orderDetails: OrderDetail[]
}

export interface Menu {
  id: number
  code: string
  name: string
  image: string | null
  menuGroupName: string
  statusName: string
  unitName: string
  note: string | null
}

export interface Size {
  id: number
  name: string
  rankIndex: number
}

export interface OrderDetail {
  id: number
  orderID: number
  menuID: number
  quantity: number
  price: number
  priceListID: number
  createdBy: number
  createdDate: string
  cancelledBy: number | null
  cancelledDate: string | null
  note: string | null
  kindOfHotpot1ID: number | null
  kindOfHotpot2ID: number | null
  sizeID: number
  menu: Menu
  size: Size
}
