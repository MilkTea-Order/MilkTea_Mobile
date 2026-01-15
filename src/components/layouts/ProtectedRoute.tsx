import { useAuthStore } from "@/features/auth/store/authStore";
import { useTheme } from "@/shared/hooks/useTheme";
import { useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const currentRoute = segments[0];
    const isLoginPage = currentRoute === "login";

    // Small delay to ensure auth state is loaded
    const timer = setTimeout(() => {
      setIsChecking(false);

      if (!isAuthenticated && !isLoginPage) {
        // Redirect to login if not authenticated
        router.replace("/login");
      } else if (isAuthenticated && isLoginPage) {
        // Redirect to home if authenticated and on login page
        router.replace("/(tabs)");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, segments, router]);

  // Show loading while checking auth state
  if (isChecking) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
