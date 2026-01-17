import { useTheme } from "@/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface CustomToastProps {
  message: string;
  type?: "success" | "danger" | "warning" | "info" | "normal";
}

export function CustomToast({ message, type = "info" }: CustomToastProps) {
  const { colors, effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  // Map type to colors and icons
  const typeConfig = {
    success: {
      bg: isDark ? "#064E3B" : "#D1FAE5",
      border: isDark ? "#10B981" : "#6EE7B7",
      text: isDark ? "#6EE7B7" : "#065F46",
      icon: "checkmark-circle" as const,
    },
    danger: {
      bg: isDark ? "#7F1D1D" : "#FEE2E2",
      border: isDark ? "#F87171" : "#FCA5A5",
      text: isDark ? "#FCA5A5" : "#991B1B",
      icon: "close-circle" as const,
    },
    warning: {
      bg: isDark ? "#78350F" : "#FEF3C7",
      border: isDark ? "#F59E0B" : "#FCD34D",
      text: isDark ? "#FCD34D" : "#92400E",
      icon: "warning" as const,
    },
    info: {
      bg: isDark ? "#1E3A5F" : "#DBEAFE",
      border: isDark ? "#60A5FA" : "#93C5FD",
      text: isDark ? "#93C5FD" : "#1E40AF",
      icon: "information-circle" as const,
    },
    normal: {
      bg: isDark ? colors.surface : colors.surface,
      border: isDark ? colors.border : colors.border,
      text: isDark ? colors.text : colors.text,
      icon: "notifications" as const,
    },
  };

  const config = typeConfig[type];

  return (
    <View
      className="rounded-xl p-3.5 mx-4 my-2 min-w-[280px] max-w-[320px] self-end flex-row items-start"
      style={{
        backgroundColor: config.bg,
        borderLeftColor: config.border,
        borderLeftWidth: 4,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons
        name={config.icon}
        size={20}
        color={config.border}
        className="mr-2.5 mt-0.5"
      />
      <Text
        className="flex-1 text-sm font-medium leading-5"
        style={{
          color: config.text,
        }}
        numberOfLines={3}
      >
        {message}
      </Text>
    </View>
  );
}
