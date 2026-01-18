import { userApi } from "@/features/user/apis/user.api";
import { userKeys } from "@/features/user/hooks/useUser";
import { extractFieldErrors } from "@/shared/utils/formErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../apis/auth.api";
import { useAuthStore } from "../store/auth.store";
import { LoginPayload, LoginResponse } from "../types/auth.type";
import { User } from "../types/user.type";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
  login: () => [...authKeys.all, "login"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await authApi.loginAccount(payload);
      return response.data;
    },
    onSuccess: async (apiResponse) => {
      const {
        accessToken,
        refreshToken,
        expiresAt,
        user: userData,
        permissions,
      } = apiResponse.data;
      const user: User = {
        id: userData.id,
        dateLogin: userData.dateLogin,
      };

      const session: LoginResponse = {
        accessToken,
        refreshToken,
        expiresAt,
        user,
        permissions,
      };
      await login(session);
      // Prefetch user data sau khi login thành công
      await queryClient.prefetchQuery({
        queryKey: userKeys.me(),
        queryFn: async () => {
          const response = await userApi.getMe();
          return response.data;
        },
      });
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, "auth", "password");
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors;
      }
    },

  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      await logout();
      queryClient.clear();
    },
  });
}
