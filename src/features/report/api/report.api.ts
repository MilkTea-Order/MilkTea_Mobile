import { PaymentMethod } from '@/shared/constants/other'
import { URL } from '@/shared/constants/urls'
import { ApiResponse } from '@/shared/types/api.type'
import http from '@/shared/utils/http'
import { AxiosResponse } from 'axios'
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
  }): Promise<AxiosResponse<ApiResponse<RevenueReport>>> {
    return http.get<ApiResponse<RevenueReport>>(URL.REVENUE_REPORT, { params: filter })
  }
}
