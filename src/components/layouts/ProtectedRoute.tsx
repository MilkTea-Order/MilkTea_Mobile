import { useAuthStore } from "@/features/auth/store/auth.store";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (isHydrating) return;
    const currentRoute = segments[0];
    const isLoginPage = currentRoute === "login";

    if (!isAuthenticated && !isLoginPage) {
      router.replace("/login");
    } else if (isAuthenticated && isLoginPage) {
      router.replace("/(tabs)");
    }
  }, [session, isAuthenticated, isHydrating, segments, router]);

  if (isHydrating) {
    return null;
  }
  return <>{children}</>;
}
