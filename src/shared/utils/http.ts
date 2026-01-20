import { useAuthStore } from '@/features/auth/store/auth.store'
import { BASE_URL, URL } from '@/shared/constants/urls'
import { ApiResponse, isErrorResponse } from '@/shared/types/api.type'
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, HttpStatusCode } from 'axios'
import { Toast } from 'react-native-toast-notifications'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'

class Http {
  instance: AxiosInstance
  private refreshTokenRequest: Promise<string> | null = null

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 20 * 1000,
      headers: { 'Content-Type': 'application/json' }
    })

    this.instance.interceptors.request.use(
      (config) => {
        const { tokens } = useAuthStore.getState()

        if (tokens?.accessToken) {
          config.headers = config.headers ?? {}
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }

        if ((config.url === URL.LOGOUT || config.url?.endsWith(URL.LOGOUT)) && tokens?.refreshToken) {
          config.data = {
            ...(config.data ?? {}),
            refreshToken: tokens.refreshToken
          }
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      async (response) => {
        const responseData = response.data as ApiResponse<unknown>
        if (isErrorResponse(responseData)) {
          throw responseData
        }
        return response
      },
      async (error: AxiosError) => {
        const store = useAuthStore.getState()
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
            HttpStatusCode.NotFound,
            HttpStatusCode.Forbidden
          ].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          Toast.show(message, {
            type: 'danger'
          })
        }

        // Xứ lí 401 Unauthorized
        if (
          isAxiosUnauthorizedError<{
            message: string
            statusCode: number
            timestamp: string
            error?: string | null
            errorDescription?: string | null
          }>(error)
        ) {
          const config = error.response?.config as AxiosRequestConfig & {
            _retry?: boolean
          }
          if (
            isAxiosExpiredTokenError(error) &&
            !config._retry &&
            config.url !== URL.REFRESH_TOKEN &&
            !config.url?.endsWith(URL.REFRESH_TOKEN)
          ) {
            config._retry = true
            this.refreshTokenRequest = this.refreshTokenRequest ?? this.handleRefreshToken()
            return this.refreshTokenRequest.then((access_token) => {
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${access_token}`
                }
              })
            })
          }
        }
        // Token không đúng, không truyền, refresh token cũng hết hạn hay đã bị thu hồi
        await store.logout()
        return Promise.reject(error)
      }
    )
  }

  private async handleRefreshToken(): Promise<string> {
    const store = useAuthStore.getState()
    if (!store.tokens?.refreshToken) {
      await store.logout()
      throw new Error('No refresh token available')
    }

    this.refreshTokenRequest = this.instance
      .post<ApiResponse<{ accessToken: string; expiresAt: string }>>(URL.REFRESH_TOKEN, {
        refreshToken: store.tokens.refreshToken
      })
      .then(async (res) => {
        const { accessToken, expiresAt } = (res.data as ApiResponse<{ accessToken: string; expiresAt: string }>).data
        await store.updateAccessToken(accessToken, expiresAt)
        return accessToken as string
      })
      .catch(async (error) => {
        await store.logout()
        throw error
      })
      .finally(() => {
        this.refreshTokenRequest = null
        // setTimeout(() => {
        //   this.refreshTokenRequest = null;
        // }, 10000);
      })

    return this.refreshTokenRequest
  }
}

const http = new Http().instance
export default http

// if (isUnauthorizedError(responseData)) {
//   // Xử lí liên quan tới token hết hạn
//   console.log('Unauthorized error', responseData)
//   if (
//     isExpiredTokenError(response) &&
//     config.url !== URL.REFRESH_TOKEN &&
//     !config.url?.endsWith(URL.REFRESH_TOKEN) &&
//     !config._retry
//   ) {
//     console.log('AccessToken expired, trying to refresh token')
//     config._retry = true
//     this.refreshTokenRequest = this.refreshTokenRequest ?? this.handleRefreshToken()
//     return this.refreshTokenRequest.then((access_token) => {
//       return this.instance({
//         ...config,
//         headers: {
//           ...config.headers,
//           Authorization: `Bearer ${access_token}`
//         }
//       })
//     })
//   }
//   // Token không đúng, không truyền, refresh token cũng hết hạn hay đã bị thu hồi
//   await logout()
// }
