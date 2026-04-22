import { InputField } from '@/components/molecules/InputField'
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword'
import { ForgotPasswordSchema, forgotPasswordValidationSchema } from '@/features/auth/schemas/forgot-password.schema'
import { useTheme } from '@/shared/hooks/useTheme'
import { setFormikFieldErrors } from '@/shared/utils/formErrors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React from 'react'
import { ActivityIndicator, Keyboard, Text, TouchableOpacity, View } from 'react-native'

export interface ForgotPasswordFormProps {
  onBackToLogin?: () => void
  onSuccess?: (email: string, expiresAt: string, sesseionId: number) => void
}

export function ForgotPasswordForm({ onBackToLogin, onSuccess }: ForgotPasswordFormProps) {
  const forgotPasswordMutation = useForgotPassword()
  const { colors, gradients } = useTheme()

  const handleSubmit = async (
    values: ForgotPasswordSchema,
    setFieldError: (field: string, message: string) => void
  ) => {
    Keyboard.dismiss()
    try {
      const responge = await forgotPasswordMutation.mutateAsync({
        email: values.email
      })
      onSuccess?.(values.email, responge.data.expiresAt, responge.data.sessionId)
    } catch (error: any) {
      if (error.fieldErrors) {
        setFormikFieldErrors(setFieldError, error.fieldErrors)
      }
    }
  }

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={forgotPasswordValidationSchema}
      validateOnChange
      onSubmit={(values, { setFieldError }) => handleSubmit(values, setFieldError)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
        <View>
          {/* Email Field */}
          <InputField
            label='Email'
            placeholder='Nhập email của bạn'
            icon='mail-outline'
            keyboardType='email-address'
            autoCapitalize='none'
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            error={errors.email}
            touched={touched.email}
            autoComplete='email'
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={forgotPasswordMutation.isPending || !dirty || !isValid}
            activeOpacity={0.9}
            style={{ opacity: forgotPasswordMutation.isPending || !dirty || !isValid ? 0.7 : 1 }}
          >
            <View
              className='rounded-2xl overflow-hidden'
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
                {forgotPasswordMutation.isPending ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-white text-base font-bold mr-2'>Gửi mã xác minh</Text>
                    <View className='rounded-full bg-white/20 p-1'>
                      <Ionicons name='mail' size={16} color='white' />
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {/* Back to Login */}
          {onBackToLogin && (
            <TouchableOpacity
              onPress={onBackToLogin}
              className='self-center mt-6 flex-row items-center'
              activeOpacity={0.7}
            >
              <Ionicons name='arrow-back' size={16} color={colors.primary} />
              <Text className='text-sm font-semibold ml-1' style={{ color: colors.primary }}>
                Quay lại đăng nhập
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  )
}
