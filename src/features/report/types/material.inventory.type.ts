import { Status } from '@/shared/types/common.type'

export interface MaterialReport {
  id: number
  name: string
  materialItems: MaterialDetailReport[]
}

export interface MaterialDetailReport {
  id: number
  name: string
  code: string | null
  unitMin: UnitReport
  unitMax: UnitReport
  styleQuantity: number
  latestPriceImport: number
  status: Status
}

export interface UnitReport {
  id: number
  name: string
  quantity: number
}
