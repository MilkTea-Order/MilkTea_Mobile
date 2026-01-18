import { useAuthStore } from "@/features/auth/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../apis/user.api";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export function useMe() {
  const session = useAuthStore((state) => state.session);

  const query = useQuery({
    queryKey: userKeys.me(),
    queryFn: async () => {
      const response = await userApi.getMe();
      return response.data;   
    },
    enabled: !!session?.accessToken, 
    staleTime: 5 * 60 * 1000, 
  });

  return query;
}
