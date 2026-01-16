import { useAuthStore } from "@/features/auth/store/auth.store";
import { RefreshTokenResponse } from "@/features/auth/types/auth.type";
import { BASE_URL, URL } from "@/shared/constants/urls";
import { ApiResponse, isErrorResponse } from "@/shared/types/api.type";
import { isExpiredTokenError, isUnauthorizedError } from "@/shared/utils/utils";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { Alert } from "react-native";

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
        const { accessToken, refreshToken } = useAuthStore.getState();

        if (accessToken) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        if (
          (config.url === URL.LOGOUT || config.url?.endsWith(URL.LOGOUT)) &&
          refreshToken
        ) {
          config.data = { ...(config.data ?? {}), refreshToken };
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      async (response) => {
        const responseData = response.data as ApiResponse<unknown>;
        const config = response.config as AxiosRequestConfig;
        const { clearAuthData } = useAuthStore.getState();
        if (isErrorResponse(responseData)) {
          if (isUnauthorizedError(responseData)) {
            // Xử lí liên quan tới token hết hạn
            if (
              isExpiredTokenError(responseData) &&
              config.url !== URL.REFRESH_TOKEN &&
              !config.url?.endsWith(URL.REFRESH_TOKEN)
            ) {
              this.refreshTokenRequest = this.handleRefreshToken();
              return this.refreshTokenRequest.then((access_token) => {
                return this.instance({
                  ...config,
                  headers: { ...config.headers, Authorization: access_token },
                });
              });
            }
            // Token không đúng, không truyền,  refresh token cũng hết hạn
            await clearAuthData();
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
          errorMessage =
            (typeof data === "string"
              ? data
              : data?.description || data?.message) ||
            error.message ||
            errorMessage;
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Vui lòng thử lại.";
        } else if (error.message?.toLowerCase().includes("network")) {
          errorMessage = "Lỗi kết nối. Vui lòng kiểm tra lại kết nối internet.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        Alert.alert("Lỗi", errorMessage, [{ text: "Đóng" }]);
        return Promise.reject(error);
      }
    );
  }

  private async handleRefreshToken(): Promise<string> {
    if (this.refreshTokenRequest) return this.refreshTokenRequest;

    const store = useAuthStore.getState();
    if (!store.refreshToken) {
      await store.clearAuthData();
      throw new Error("No refresh token available");
    }

    this.refreshTokenRequest = this.instance
      .post<RefreshTokenResponse>(URL.REFRESH_TOKEN, {
        refreshToken: store.refreshToken,
      })
      .then((res) => {
        const newAccessToken = (
          res.data as ApiResponse<{ accessToken: string }>
        ).data.accessToken;
        useAuthStore.setState({ accessToken: newAccessToken });
        return `Bearer ${newAccessToken}` as string;
      })
      .catch(async (error) => {
        await store.clearAuthData();
        throw error;
      })
      .finally(() => {
        setTimeout(() => {
          this.refreshTokenRequest = null;
        }, 10000);
      });

    return this.refreshTokenRequest;
  }
}

const http = new Http().instance;
export default http;
