import {
    handleChangePasswordFormErrors,
    useChangePassword,
} from "@/features/user/hooks/useChangePassword";
import changePasswordSchema, {
    ChangePasswordSchema,
} from "@/features/user/schema/changePassword.schema";
import { useTheme } from "@/shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import React from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { InputField } from "../molecules/InputField";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onSuccess }: ChangePasswordFormProps) {
  const changePasswordMutation = useChangePassword();
  const { colors, gradients } = useTheme();

  const initialValues: ChangePasswordSchema = {
    password: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleSubmit = async (
    values: ChangePasswordSchema,
    setFieldError: (field: string, message: string) => void
  ) => {
    try {
      await changePasswordMutation.mutateAsync({
        password: values.password,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      onSuccess?.();
    } catch (error: any) {
      handleChangePasswordFormErrors(error, setFieldError);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={changePasswordSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={(values, { setFieldError }) =>
            handleSubmit(values, setFieldError)
          }
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setTouched,
            values,
            errors,
            touched,
          }) => (
            <View className="flex-1">
              {/* Info Card */}
              <View
                className="rounded-2xl p-4 mb-6"
                style={{
                  backgroundColor: `${colors.primary}10`,
                  borderWidth: 1,
                  borderColor: `${colors.primary}20`,
                }}
              >
                <View className="flex-row items-start">
                  <View
                    className="rounded-xl p-2 mr-3"
                    style={{
                      backgroundColor: `${colors.primary}20`,
                    }}
                  >
                    <Ionicons
                      name="information-circle"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-sm font-semibold mb-1"
                      style={{ color: colors.text }}
                    >
                      Lưu ý khi đổi mật khẩu
                    </Text>
                    <Text
                      className="text-xs leading-5"
                      style={{ color: colors.textSecondary }}
                    >
                      Mật khẩu mới phải có ít nhất 6 ký tự. Vui lòng nhớ mật
                      khẩu mới của bạn.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Current Password */}
              <InputField
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                error={errors.password}
                touched={touched.password}
                icon="lock-closed-outline"
                isPassword={true}
                showPasswordToggle={true}
              />

              {/* New Password */}
              <InputField
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                value={values.newPassword}
                onChangeText={handleChange("newPassword")}
                onBlur={handleBlur("newPassword")}
                error={errors.newPassword}
                touched={touched.newPassword}
                icon="lock-closed-outline"
                isPassword={true}
                showPasswordToggle={true}
              />

              {/* Confirm Password */}
              <InputField
                label="Xác nhận mật khẩu mới"
                placeholder="Nhập lại mật khẩu mới"
                value={values.confirmPassword}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                icon="checkmark-circle-outline"
                isPassword={true}
                showPasswordToggle={true}
              />

              {/* Submit Button */}
              <TouchableOpacity
                onPress={() => {
                  // Set all fields as touched để hiển thị errors sau khi validate
                  setTouched({
                    password: true,
                    newPassword: true,
                    confirmPassword: true,
                  });
                  handleSubmit();
                }}
                disabled={changePasswordMutation.isPending}
                activeOpacity={0.9}
                style={{
                  opacity: changePasswordMutation.isPending ? 0.7 : 1,
                  marginTop: 8,
                }}
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
                    {changePasswordMutation.isPending ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white text-lg font-bold mr-2">
                          Đổi mật khẩu
                        </Text>
                        <View className="rounded-full bg-white/20 p-1 ml-1">
                          <Ionicons
                            name="checkmark"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
