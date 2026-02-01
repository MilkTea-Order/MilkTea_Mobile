import { extractFieldErrors } from '@/shared/utils/formErrors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Toast } from 'react-native-toast-notifications'
import { userApi } from '../apis/user.api'
import { UpdateProfilePayload } from '../types/user.type'
import { userKeys } from './useUser'

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await userApi.updateProfile(payload)
      return response.data
    },
    onSuccess: () => {
      const message = 'Cập nhật thông tin thành công!'
      Toast.show(message, { type: 'success' })
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (error: any) => {
      const fieldErrors = extractFieldErrors(error, 'user', {
        fullName: 'fullName',
        genderId: 'genderID',
        birthDay: 'birthDay',
        identityCode: 'identityCode',
        email: 'email',
        cellphone: 'cellPhone',
        address: 'address',
        bankName: 'bankName',
        bankAccountName: 'bankAccountName',
        bankAccountNumber: 'bankAccountNumber',
        bankQRCode: 'bankQRCode'
      })
      if (fieldErrors.length > 0) {
        error.fieldErrors = fieldErrors
      }
    }
  })
}

export function handleUpdateProfileFormErrors(error: any, setFieldError: (field: string, message: string) => void) {
  if (error.fieldErrors) {
    error.fieldErrors.forEach((fieldError: { field: string; message: string }) => {
      setFieldError(fieldError.field, fieldError.message)
    })
  }
}
