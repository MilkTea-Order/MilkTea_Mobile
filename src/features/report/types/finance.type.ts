export interface FinanceReport {
  date: string
  totalAmount: number
  groups: FinanceGroupReport[]
}

export interface FinanceGroupReport {
  id: number
  name: string
  totalAmount: number
  items: FinanceItemReport[]
}

export interface FinanceItemReport {
  id: number
  name: string
  amount: number
  actionDate: string
  createdDate: string
  note?: string
}

export interface AddFinanceTransactionPayload {
  transactionGroupId: number
  name: string
  transactionDate: string
  transactionBy: number
  amount: number
  note?: string
}
