export interface FinanceGroupReport {
  id: number
  name: string
  totalAmount: number
}

export interface FinanceItemReport {
  id: number
  name: string
  amount: number
  actionDate: string
  createdDate: string
}

export interface FinanceReport extends FinanceGroupReport {
  dates: FinanceReportDate[]
}

export interface FinanceReportDate {
  date: string
  totalAmount: number
  items: FinanceItemReport[]
}

export interface AddFinanceTransactionPayload {
  transactionGroupId: number
  name: string
  transactionDate: string
  transactionBy: number
  amount: number
  note?: string
}
