import { PaymentMethod } from '@/shared/constants/other'
import { OrderStatus } from '@/shared/constants/status'
import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
import { AddFinanceTransactionPayload, FinanceGroupReport, FinanceReport } from '../types/finance.type'
import { MaterialReport } from '../types/material.inventory.type'
import { RevenueReport } from '../types/revenue.type'

export const reportApi = {
  getMaterialInventoryReport(): Promise<AxiosResponse<ApiResponse<MaterialReport[]>>> {
    return http.get<ApiResponse<MaterialReport[]>>(URL.MATERIAL_INVENTORY_REPORT)
  },
  getRevenueReport(filter: {
    paymentMethod: PaymentMethod
    fromDate: string
    toDate: string
    orderStatusId: OrderStatus
  }): Promise<AxiosResponse<ApiResponse<RevenueReport>>> {
    return http.get<ApiResponse<RevenueReport>>(URL.REVENUE_REPORT, { params: filter })
  },
  getFinanceReport(filter: { fromDate: string; toDate: string }): Promise<AxiosResponse<ApiResponse<FinanceReport[]>>> {
    return http.get<ApiResponse<FinanceReport[]>>(`${URL.FINANCE}/report`, { params: filter })
  },
  getFinanceGroupReport(): Promise<AxiosResponse<ApiResponse<FinanceGroupReport[]>>> {
    return http.get<ApiResponse<FinanceGroupReport[]>>(`${URL.FINANCE}/groups`)
  },
  addFinanceTransaction(payload: AddFinanceTransactionPayload): Promise<AxiosResponse<ApiResponse<object>>> {
    return http.post<ApiResponse<object>>(URL.FINANCE, payload)
  }
}
