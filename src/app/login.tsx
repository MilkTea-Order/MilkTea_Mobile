import { AppLogo } from "@/components/atoms/AppLogo";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { loginValidationSchema } from "@/features/auth/schemas/login.schema";
import { useTheme } from "@/shared/hooks/useTheme";
import { setFormikFieldErrors } from "@/shared/utils/formErrors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const { colors, gradients } = useTheme();

  const initialValues: LoginFormValues = {
    username: "",
    password: "",
  };

  const handleLogin = async (values: LoginFormValues, setFieldError: (field: string, message: string) => void) => {
    try {
      await loginMutation.mutateAsync({
        username: values.username,
        password: values.password,
      });
    } catch (error: any) {
      if (error.fieldErrors) {
        setFormikFieldErrors(setFieldError, error.fieldErrors);
      }
    }
  };

  const handleForgotPassword = () => {};

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top", "bottom"]}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // behavior={Platform.OS === "ios" ? "padding" : undefined}
        // enabled={Platform.OS === "ios"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 20
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View className="flex-1 justify-center">
            {/* Top Section */}
            <View className="mb-10  items-center">
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

            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
              onSubmit={(values, { setFieldError }) => handleLogin(values, setFieldError)}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched
                
              }) => (
                <View>
                  {/* Username */}
                  <View className="mb-5">
                    <View
                      className="flex-row items-center rounded-2xl px-5 py-4"
                      style={{
                        backgroundColor: colors.surface,
                        borderWidth: 2,
                        borderColor:
                          touched.username && errors.username
                            ? colors.error || "#ef4444"
                            : colors.border,
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
                        value={values.username}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        autoCapitalize="none"
                      />
                    </View>
                    {touched.username && errors.username && (
                      <Text
                        className="text-sm mt-1 ml-2"
                        style={{ color: colors.error || "#ef4444" }}
                      >
                        {errors.username}
                      </Text>
                    )}
                  </View>
                  {/* Password */}
                  <View className="mb-6">
                    <View
                      className="flex-row items-center rounded-2xl px-5 py-4"
                      style={{
                        backgroundColor: colors.surface,
                        borderWidth: 2,
                        borderColor:
                          touched.password && errors.password
                            ? colors.error || "#ef4444"
                            : colors.border,
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
                        value={values.password}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        onSubmitEditing={() => handleSubmit()}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="ml-3 p-2"
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={22}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                    {touched.password && errors.password && (
                      <Text
                        className="text-sm mt-1 ml-2"
                        style={{ color: colors.error || "#ef4444" }}
                      >
                        {errors.password}
                      </Text>
                    )}
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
                    onPress={() => handleSubmit()}
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
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
