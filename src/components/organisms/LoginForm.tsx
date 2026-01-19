import { InputField } from '@/components/molecules/InputField'
import { useLogin } from '@/features/auth/hooks/useAuth'
import { loginValidationSchema } from '@/features/auth/schemas/login.schema'
import { useTheme } from '@/shared/hooks/useTheme'
import { setFormikFieldErrors } from '@/shared/utils/formErrors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

interface LoginFormValues {
  username: string
  password: string
}

interface LoginFormProps {
  onForgotPassword?: () => void
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const loginMutation = useLogin()
  const { colors, gradients } = useTheme()

  const initialValues: LoginFormValues = {
    username: '',
    password: ''
  }

  const handleLogin = async (values: LoginFormValues, setFieldError: (field: string, message: string) => void) => {
    try {
      await loginMutation.mutateAsync({
        username: values.username,
        password: values.password
      })
    } catch (error: any) {
      if (error.fieldErrors) {
        setFormikFieldErrors(setFieldError, error.fieldErrors)
      }
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={(values, { setFieldError }) => handleLogin(values, setFieldError)}
    >
      {({ handleChange, handleBlur, handleSubmit, setTouched, values, errors, touched }) => (
        <View>
          {/* Username Field */}
          <InputField
            label='Tên đăng nhập'
            placeholder='Nhập tên đăng nhập'
            icon='person-outline'
            value={values.username}
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            error={errors.username}
            touched={touched.username}
            autoCapitalize='none'
          />

          {/* Password Field */}
          <InputField
            label='Mật khẩu'
            placeholder='Nhập mật khẩu'
            icon='lock-closed-outline'
            isPassword={true}
            showPasswordToggle={true}
            value={values.password}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            error={errors.password}
            touched={touched.password}
            onSubmitEditing={() => handleSubmit()}
          />

          {/* Forgot Password */}
          {onForgotPassword && (
            <TouchableOpacity onPress={onForgotPassword} className='self-end mb-6' activeOpacity={0.7}>
              <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={() => {
              // Set all fields as touched để hiển thị errors sau khi validate
              setTouched({
                username: true,
                password: true
              })
              handleSubmit()
            }}
            disabled={loginMutation.isPending}
            activeOpacity={0.9}
            style={{ opacity: loginMutation.isPending ? 0.7 : 1 }}
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
                style={{
                  height: 56,
                  paddingVertical: 16
                }}
              >
                {loginMutation.isPending ? (
                  <ActivityIndicator color='white' size='small' />
                ) : (
                  <View className='flex-row items-center justify-center'>
                    <Text className='text-white text-lg font-bold mr-2'>Đăng nhập</Text>
                    <View className='rounded-full bg-white/20 p-1 ml-1'>
                      <Ionicons name='arrow-forward' size={18} color='white' />
                    </View>
                  </View>
                )}
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  )
}
