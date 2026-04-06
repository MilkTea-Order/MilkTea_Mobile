export const FINANCE_GROUP_ID = {
  SPEND: 1,
  COLLECTED: 2
} as const

export type FinanceGroupId = (typeof FINANCE_GROUP_ID)[keyof typeof FINANCE_GROUP_ID]
