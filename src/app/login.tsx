import { AppLogo } from "@/components/atoms/AppLogo";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { useTheme } from "@/shared/hooks/useTheme";
import { getErrorMessageFromResponse } from "@/shared/resources/errorMessages";
import {
  ApiErrorResponse,
  ApiResponse,
  isErrorResponse,
} from "@/shared/types/api.type";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { colors, gradients } = useTheme();

  const handleLogin = async () => {
    try {
      await loginMutation.mutateAsync({ username, password });
      // Navigation is handled by useLogin hook onSuccess
    } catch (err) {
      console.log("error: ", err);

      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (isErrorResponse(err as ApiResponse<unknown>)) {
        // Get error message from error response data
        errorMessage = getErrorMessageFromResponse(err as ApiErrorResponse);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      Alert.alert("Lỗi", errorMessage);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Quên mật khẩu",
      "Tính năng đang được phát triển. Vui lòng liên hệ quản trị viên.",
      [{ text: "Đóng", style: "default" }]
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
        enabled={Platform.OS === "ios"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 justify-center">
            {/* Top Section */}
            <View className="items-center mb-10">
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
            <View>
              {/* Username Input */}
              <View className="mb-5">
                <View
                  className="flex-row items-center rounded-2xl px-5 py-4"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: colors.border,
                  }}
                >
                  <View
                    className="rounded-xl p-2.5 mr-4"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <TextInput
                    className="flex-1"
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                    placeholder="Tên đăng nhập"
                    placeholderTextColor={colors.textTertiary}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <View
                  className="flex-row items-center rounded-2xl px-5 py-4"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: colors.border,
                  }}
                >
                  <View
                    className="rounded-xl p-2.5 mr-4"
                    style={{
                      backgroundColor: `${colors.primary}15`,
                    }}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <TextInput
                    className="flex-1"
                    style={{
                      color: colors.text,
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                    placeholder="Mật khẩu"
                    placeholderTextColor={colors.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="ml-3 p-2"
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={handleForgotPassword}
                className="self-end mb-6"
                activeOpacity={0.7}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.primary }}
                >
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loginMutation.isPending}
                activeOpacity={0.9}
                style={{ opacity: loginMutation.isPending ? 0.7 : 1 }}
              >
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 10,
                  }}
                >
                  <LinearGradient
                    colors={gradients.header as any}
                    className="items-center justify-center"
                    style={{
                      height: 56,
                      paddingVertical: 16,
                    }}
                  >
                    {loginMutation.isPending ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white text-lg font-bold mr-2">
                          Đăng nhập
                        </Text>
                        <View className="rounded-full bg-white/20 p-1 ml-1">
                          <Ionicons
                            name="arrow-forward"
                            size={18}
                            color="white"
                          />
                        </View>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
