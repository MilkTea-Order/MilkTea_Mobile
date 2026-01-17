import { extractFieldErrors } from "@/shared/utils/formErrors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, () => "password");
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

export function useMe() {
  const session = useAuthStore((state) => state.session);
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      // API returns axios response, unwrap .data ONCE here
      const response = await authApi.getMe();
      return response.data; // ApiResponse<MeResponseData>
    },
    enabled: !!session?.accessToken, // Only fetch if authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update store user when fetched from server (React Query v5 pattern)
  useEffect(() => {
    if (query.isSuccess && query.data) {
      // data is ApiResponse<MeResponseData>, extract .data
      const { user, permissions } = query.data.data;

      // Update user in store
      setUser(user);

      // Update permissions if provided
      if (permissions && session) {
        const updatedSession: LoginResponse = {
          ...session,
          permissions,
        };
        useAuthStore.setState({ session: updatedSession });
      }
    }
  }, [query.isSuccess, query.data, setUser, session]);

  return query;
}
