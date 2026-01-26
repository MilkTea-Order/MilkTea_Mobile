import { extractFieldErrors } from '@/shared/utils/formErrors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (error: any) => {
      // Map API field names -> Formik field names to avoid lower-case mismatches (e.g. cellPhone -> cellphone)
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
      throw error
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
