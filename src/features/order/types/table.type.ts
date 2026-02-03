import type { ApiResponse } from '@/shared/types/api.type'

export type DinnerTable = {
  tableID: number
  tableCode: string
  tableName: string
  numberOfSeat: number
  tableNote: string | null
  statusID: number
  statusName: string
  usingImg: string | null
  emptyImg: string | null
}

export type DinnerTablesResponse = ApiResponse<DinnerTable[]>
