import { InputField } from '@/components/molecules/InputField'
import { useResetPassword } from '@/features/auth/hooks/useForgotPassword'
import { ResetPasswordSchema, resetPasswordValidationSchema } from '@/features/auth/schemas/forgot-password.schema'
import { useTheme } from '@/shared/hooks/useTheme'
import { setFormikFieldErrors } from '@/shared/utils/formErrors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

export interface ResetPasswordFormProps {
  email: string
  onSuccess?: () => void
  onBack?: () => void
}

export function ResetPasswordForm({ email, onSuccess, onBack }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword()
  const { colors, gradients } = useTheme()

  const handleSubmit = async (values: ResetPasswordSchema, setFieldError: (field: string, message: string) => void) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email: values.email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      })
      onSuccess?.()
    } catch (error: any) {
      if (error.fieldErrors) {
        setFormikFieldErrors(setFieldError, error.fieldErrors)
      }
    }
  }

  return (
    <Formik
      initialValues={{
        email,
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema={resetPasswordValidationSchema}
      validateOnChange
      onSubmit={(values, { setFieldError }) => handleSubmit(values, setFieldError)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
        <View>
          {/* Email Display */}
          <View className='mb-6 items-center'>
            <View className='rounded-2xl px-4 py-2' style={{ backgroundColor: `${colors.primary}15` }}>
              <Text className='text-sm font-medium' style={{ color: colors.primary }}>
                {email}
              </Text>
            </View>
          </View>

          {/* New Password Field */}
          <InputField
            label='Mật khẩu mới'
            placeholder='Nhập mật khẩu mới'
            icon='lock-closed-outline'
            isPassword
            showPasswordToggle
            value={values.newPassword}
            onChangeText={handleChange('newPassword')}
            onBlur={handleBlur('newPassword')}
            error={errors.newPassword}
            touched={touched.newPassword}
            autoComplete='new-password'
          />

          {/* Confirm Password Field */}
          <InputField
            label='Xác nhận mật khẩu'
            placeholder='Nhập lại mật khẩu mới'
            icon='lock-closed-outline'
            isPassword
            showPasswordToggle
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            autoComplete='new-password'
          />

          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={resetPasswordMutation.isPending || !dirty || !isValid}
            activeOpacity={0.9}
            style={{ opacity: resetPasswordMutation.isPending || !dirty || !isValid ? 0.7 : 1 }}
          >
            <View
              className='overflow-hidden rounded-2xl'
              style={{
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 10
              }}
            >
              <LinearGradient
                colors={gradients.header as any}
                className='items-center justify-center'
                style={{ height: 56, paddingVertical: 16 }}
              >
                {resetPasswordMutation.isPending ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='mr-2 text-base font-bold text-white'>Đặt lại mật khẩu</Text>
                    <View className='rounded-full bg-white/20 p-1'>
                      <Ionicons name='refresh' size={16} color='white' />
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {/* Back Link */}
          {onBack && (
            <TouchableOpacity onPress={onBack} className='mt-6 flex-row items-center self-center' activeOpacity={0.7}>
              <Ionicons name='arrow-back' size={16} color={colors.primary} />
              <Text className='ml-1 text-sm font-semibold' style={{ color: colors.primary }}>
                Quay lại
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  )
}
