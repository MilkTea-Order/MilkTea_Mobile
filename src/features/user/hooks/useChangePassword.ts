import { useAuthStore } from '@/features/auth/store/auth.store'
import { extractFieldErrors, setFormikFieldErrors } from '@/shared/utils/formErrors'
import { useMutation } from '@tanstack/react-query'
import { Toast } from 'react-native-toast-notifications'
import { userApi } from '../apis/user.api'
import { ChangePasswordPayload } from '../types/user.type'

export const userKeys = {
  all: ['user'] as const,
  changePassword: () => [...userKeys.all, 'change-password'] as const
}

export function useChangePassword() {
  const { logout } = useAuthStore()

  return useMutation({
    mutationKey: userKeys.changePassword(),
    mutationFn: async (payload: ChangePasswordPayload) => {
      const response = await userApi.changePassword(payload)
      return response.data
    },
    onSuccess: async (apiResponse) => {
      const message = 'Đổi mật khẩu thành công!'
      Toast.show(message, { type: 'success' })
      await logout()
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'user', {
        password: 'password',
        newPassword: 'newPassword',
        confirmPassword: 'confirmPassword'
      })
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors
      }
    }
  })
}

/**
 * Helper to set form errors from API response
 */
export function handleChangePasswordFormErrors(
  error: any,
  setFieldError: (field: string, message: string) => void
): void {
  if (error?.fieldErrors) {
    setFormikFieldErrors(setFieldError, error.fieldErrors)
  }
}
