import { useAuthStore } from "@/features/auth/store/auth.store";
import { BASE_URL, URL } from "@/shared/constants/urls";
import { getErrorMessageFromResponse } from "@/shared/resources/errorMessages";
import { ApiErrorResponse, ApiResponse, isErrorResponse } from "@/shared/types/api.type";
import { isExpiredTokenError, isUnauthorizedError } from "@/shared/utils/utils";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Toast } from "react-native-toast-notifications";

class Http {
  instance: AxiosInstance;
  private refreshTokenRequest: Promise<string> | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 20 * 1000,
      headers: { "Content-Type": "application/json" },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const { session } = useAuthStore.getState();

        if (session?.accessToken) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        if (
          (config.url === URL.LOGOUT || config.url?.endsWith(URL.LOGOUT)) &&
          session?.refreshToken
        ) {
          config.data = { ...(config.data ?? {}), refreshToken: session.refreshToken };
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      async (response) => {
        const responseData = response.data as ApiResponse<unknown>;
        const config = response.config as AxiosRequestConfig & { _retry?: boolean };
        const { logout } = useAuthStore.getState();
        if (isErrorResponse(responseData)) {
          if (isUnauthorizedError(responseData)) {
            // Xử lí liên quan tới token hết hạn
            if (
              isExpiredTokenError(responseData) &&
              config.url !== URL.REFRESH_TOKEN &&
              !config.url?.endsWith(URL.REFRESH_TOKEN) &&
              !config._retry
            ) {
              config._retry = true;
              this.refreshTokenRequest = this.refreshTokenRequest ?? this.handleRefreshToken();

              return this.refreshTokenRequest.then((access_token) => {
                return this.instance({
                  ...config,
                  headers: { ...config.headers, Authorization: `Bearer ${access_token}` },
                });
              });
            }
            // Token không đúng, không truyền,  refresh token cũng hết hạn hay đã bị thu hồi
            await logout();
          }
          throw responseData;
        }
        return response;
      },
      (error: AxiosError) => {
        if ((error as any)?.code === "ERR_CANCELED") {
          throw error;
        }
        let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        if (error.response) {
          const data: any = error.response.data;
          if (isErrorResponse(data as ApiResponse<unknown>)) {
            errorMessage = getErrorMessageFromResponse(data as ApiErrorResponse);
          } else if (typeof data === "string") {
            errorMessage = data;
          } else if (data?.description || data?.message) {
            errorMessage = data.description || data.message;
          } else {
            errorMessage = error.message || errorMessage;
          }
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Vui lòng thử lại.";
        } else if (error.message?.toLowerCase().includes("network")) {
          errorMessage = "Lỗi kết nối. Vui lòng kiểm tra lại kết nối internet.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        // Hiển thị toast error
        Toast.show(errorMessage, {
          type: "danger",
        });
        return Promise.reject(error);
      }
    );
  }

  private async handleRefreshToken(): Promise<string> {
    const store = useAuthStore.getState();
    if (!store.session?.refreshToken) {
      await store.logout();
      throw new Error("No refresh token available");
    }

    this.refreshTokenRequest = this.instance
      .post< ApiResponse<{ accessToken: string }>>(URL.REFRESH_TOKEN, {
        refreshToken: store.session.refreshToken,
      })
      .then(async (res) => {
        const newAccessToken = (
          res.data as ApiResponse<{ accessToken: string }>
        ).data.accessToken;
        await store.updateAccessToken(newAccessToken);
        return newAccessToken as string;
      })
      .catch(async (error) => {
        await store.logout();
        throw error;
      })
      .finally(() => {
        this.refreshTokenRequest = null;
        // setTimeout(() => {
        //   this.refreshTokenRequest = null;
        // }, 10000);
      });

    return this.refreshTokenRequest;
  }
}

const http = new Http().instance;
export default http;
