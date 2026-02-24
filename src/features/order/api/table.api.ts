import { URL } from '@/shared/constants/urls'
import http from '@/shared/utils/http'
import type { AxiosResponse } from 'axios'
import type { DinnerTablesResponse } from '../types/table.type'

export const tableApi = {
  getTables(statusID?: number): Promise<AxiosResponse<DinnerTablesResponse>> {
    const params = statusID != null ? { statusID } : {}
    return http.get<DinnerTablesResponse>(URL.TABLES, { params })
  },
  getTablesEmpty(isEmpty: boolean = true): Promise<AxiosResponse<DinnerTablesResponse>> {
    return http.get<DinnerTablesResponse>(URL.TABLES, { params: { isEmpty } })
  }
}
