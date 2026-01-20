import { extractFieldErrors } from '@/shared/utils/formErrors'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../apis/user.api'
import { userKeys } from './useUser'
import { UpdateProfilePayload } from '../types/user.type'

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
      const fieldErrors = extractFieldErrors(error, 'user')
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
