import { OTPInput } from '@/components/atoms/OTPInput'
import { CountdownTimer } from '@/components/molecules/CountdownTimer'
import { useResendOtp, useVerifyOtp } from '@/features/auth/hooks/useForgotPassword'
import { VerifyOtpSchema, verifyOtpValidationSchema } from '@/features/auth/schemas/forgot-password.schema'
import { useTheme } from '@/shared/hooks/useTheme'
import { setFormikFieldErrors } from '@/shared/utils/formErrors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native'

export interface VerifyOtpFormProps {
  email: string
  onBack?: () => void
  onSuccess?: (resetPasswordToken: string, expiresAt: string) => void
}

export function VerifyOtpForm({ email, onBack, onSuccess }: VerifyOtpFormProps) {
  const { colors, gradients } = useTheme()
  const verifyOtpMutation = useVerifyOtp()
  const resendOtpMutation = useResendOtp()
  const [showCountdown, setShowCountdown] = useState(true)

  // const maskEmail = (email: string) => {
  //   const [local, domain] = email.split('@')
  //   if (!domain) return email
  //   const maskedLocal =
  //     local.length > 2 ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}` : local
  //   return `${maskedLocal}@${domain}`
  // }

  const handleVerify = async (values: VerifyOtpSchema, setFieldError: (field: string, message: string) => void) => {
    try {
      const response = await verifyOtpMutation.mutateAsync({ email, otp: values.otp })
      onSuccess?.(response.data.resetPasswordToken, response.data.expiresAt)
    } catch (error: any) {
      if (error.fieldErrors) {
        setFormikFieldErrors(setFieldError, error.fieldErrors)
      }
    }
  }

  const handleResend = async () => {
    setShowCountdown(true)
    try {
      await resendOtpMutation.mutateAsync({ email })
    } catch (error: any) {
      console.log(error.fieldErrors)
      Alert.alert('OTP', error.fieldErrors[0].message ?? 'Có lỗi xãy ra hãy liên hệ admin', [
        {
          text: 'Đóng',
          style: 'destructive'
        }
      ])
    }
  }

  const handleCountdownExpire = () => {
    setShowCountdown(false)
  }

  return (
    <Formik
      initialValues={{ email, otp: '' }}
      validationSchema={verifyOtpValidationSchema}
      validateOnChange
      onSubmit={(values, { setFieldError }) => handleVerify(values, setFieldError)}
    >
      {({ handleChange, handleSubmit, setFieldError, values, errors, touched, isValid, dirty }) => (
        <View>
          {/* Masked Email Display */}
          <View className='items-center mb-6'>
            <View className='rounded-2xl px-4 py-2' style={{ backgroundColor: `${colors.primary}15` }}>
              <Text className='text-sm font-medium' style={{ color: colors.primary }}>
                {/* {maskEmail(email)} */}
                {email}
              </Text>
            </View>
          </View>

          {/* OTP Input */}
          <View className='mb-6'>
            <Text className='text-sm font-semibold mb-3 ml-1' style={{ color: colors.text }}>
              Mã OTP
            </Text>
            <OTPInput
              value={values.otp}
              onChange={handleChange('otp')}
              error={!!(touched.otp && errors.otp)}
              autoFocus
              disabled={verifyOtpMutation.isPending}
            />
            {touched.otp && errors.otp && (
              <Text className='text-sm mt-2 ml-1' style={{ color: colors.error || '#ef4444' }}>
                {errors.otp}
              </Text>
            )}
          </View>

          {/* Countdown / Resend */}
          <View className='items-center mb-6'>
            {showCountdown ? (
              <CountdownTimer seconds={60} onExpire={handleCountdownExpire} autoStart />
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={resendOtpMutation.isPending} activeOpacity={0.7}>
                {resendOtpMutation.isPending ? (
                  <View className='flex-row items-center'>
                    <ActivityIndicator size='small' color={colors.primary} />
                    <Text className='text-sm ml-2' style={{ color: colors.primary }}>
                      Đang gửi...
                    </Text>
                  </View>
                ) : (
                  <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
                    Gửi lại mã
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            disabled={verifyOtpMutation.isPending || !dirty || !isValid}
            activeOpacity={0.9}
            style={{
              opacity: verifyOtpMutation.isPending || !dirty || !isValid ? 0.7 : 1
            }}
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
                {verifyOtpMutation.isPending ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-white text-base font-bold mr-2'>Xác minh</Text>
                    <View className='rounded-full bg-white/20 p-1'>
                      <Ionicons name='checkmark-circle' size={16} color='white' />
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {/* Back to Forgot Password */}
          <TouchableOpacity onPress={onBack} className='self-center mt-6 flex-row items-center' activeOpacity={0.7}>
            <Ionicons name='arrow-back' size={16} color={colors.primary} />
            <Text className='text-sm font-semibold ml-1' style={{ color: colors.primary }}>
              Đổi email khác
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  )
}
