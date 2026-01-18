import { AppLogo } from "@/components/atoms/AppLogo";
import { LoginForm } from "@/components/organisms/LoginForm";
import { useTheme } from "@/shared/hooks/useTheme";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { colors } = useTheme();

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 24,
              paddingBottom: 20,
            }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View className="flex-1 justify-center pt-8">
              {/* Header Section */}
              <View className="mb-6 items-center">
                <View className="relative mb-6">
                  {/* Decorative circles */}
                  <View
                    className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-10"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <View
                    className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full opacity-10"
                    style={{ backgroundColor: colors.secondary }}
                  />

                  {/* Logo Container */}
                  <View
                    className="rounded-full p-4"
                    style={{
                      backgroundColor: `${colors.primary}08`,
                      borderWidth: 2,
                      borderColor: `${colors.primary}20`,
                    }}
                  >
                    <AppLogo size="large" showText={false} />
                  </View>
                </View>

                <Text
                  className="text-4xl font-bold mb-2"
                  style={{ color: colors.text }}
                >
                  Chào mừng
                </Text>
                <Text className="text-lg" style={{ color: colors.textSecondary }}>
                  Đăng nhập để tiếp tục
                </Text>
              </View>

              {/* Login Form */}
              <LoginForm onForgotPassword={handleForgotPassword} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
