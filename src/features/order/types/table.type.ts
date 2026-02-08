import type { ApiResponse } from '@/shared/types/api.type'
import { Status } from '@/shared/types/common.type'

export type DinnerTable = {
  id: number
  code: string
  name: string
  numberOfSeats: number
  status: Status
  note: string | null
  position: string | null
  usingImg: string | null
  emptyImg: string | null
}

export type DinnerTablesResponse = ApiResponse<DinnerTable[]>
