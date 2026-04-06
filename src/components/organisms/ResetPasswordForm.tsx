import { InputField } from '@/components/molecules/InputField'
import { useResetPassword } from '@/features/auth/hooks/useForgotPassword'
import { ResetPasswordSchema, resetPasswordValidationSchema } from '@/features/auth/schemas/forgot-password.schema'
import { useTheme } from '@/shared/hooks/useTheme'
import { setFormikFieldErrors } from '@/shared/utils/formErrors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

export interface ResetPasswordFormProps {
  resetPasswordToken: string
  expiresAt: string
  onSuccess?: () => void
  onBack?: () => void
}

export function ResetPasswordForm({ resetPasswordToken, expiresAt, onSuccess, onBack }: ResetPasswordFormProps) {
  const resetPasswordMutation = useResetPassword()
  const { colors, gradients } = useTheme()

  // Calculate remaining seconds from expiresAt - now
  const getRemainingSeconds = React.useCallback(() => {
    const now = Date.now()
    const expiry = new Date(expiresAt).getTime()
    return Math.max(0, Math.floor((expiry - now) / 1000))
  }, [expiresAt])

  const [remainingSeconds, setRemainingSeconds] = useState(() => getRemainingSeconds())
  const onBackRef = useRef(onBack)
  onBackRef.current = onBack

  useEffect(() => {
    if (!expiresAt) return

    const timer = setInterval(() => {
      const remaining = getRemainingSeconds()
      setRemainingSeconds(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
        onBackRef.current?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt, getRemainingSeconds])

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0')
    const seconds = (secs % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  const handleSubmit = async (values: ResetPasswordSchema, setFieldError: (field: string, message: string) => void) => {
    try {
      await resetPasswordMutation.mutateAsync({
        resetPasswordToken,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      })
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    } catch (error: any) {
      if (error.fieldErrors) {
        console.log(error.fieldErrors)
        setFormikFieldErrors(setFieldError, error.fieldErrors)
      }
    }
  }

  const isExpired = remainingSeconds <= 0
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 60

  return (
    <Formik
      initialValues={{
        resetPasswordToken,
        newPassword: '',
        confirmPassword: ''
      }}
      validationSchema={resetPasswordValidationSchema}
      validateOnChange
      onSubmit={(values, { setFieldError }) => handleSubmit(values, setFieldError)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
        <View>
          {/* Countdown Display */}
          <View
            className='rounded-xl px-4 py-3 mb-5 flex-row items-center'
            style={{
              backgroundColor: isExpired ? `${colors.error}15` : isUrgent ? `${colors.error}30` : `${colors.warning}15`
            }}
          >
            <Ionicons name='time-outline' size={18} color={isExpired || isUrgent ? colors.error : colors.warning} />
            <Text
              className='text-xs ml-2 font-semibold'
              style={{ color: isExpired || isUrgent ? colors.error : colors.warning }}
            >
              {isExpired ? 'Liên kết đã hết hạn' : `Token hết hạn sau: ${formatTime(remainingSeconds)}`}
            </Text>
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
            disabled={resetPasswordMutation.isPending || !dirty || !isValid || isExpired}
            activeOpacity={0.9}
            style={{ opacity: resetPasswordMutation.isPending || !dirty || !isValid || isExpired ? 0.7 : 1 }}
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
                {resetPasswordMutation.isPending ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-white text-base font-bold mr-2'>Đặt lại mật khẩu</Text>
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
            <TouchableOpacity onPress={onBack} className='self-center mt-6 flex-row items-center' activeOpacity={0.7}>
              <Ionicons name='arrow-back' size={16} color={colors.primary} />
              <Text className='text-sm font-semibold ml-1' style={{ color: colors.primary }}>
                Quay lại
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </Formik>
  )
}
