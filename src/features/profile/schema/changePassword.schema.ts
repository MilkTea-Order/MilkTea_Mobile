import * as yup from 'yup'

const changePasswordSchema = yup.object({
  currentPassword: yup
    .string()
    .trim()
    .required('Vui lòng nhập mật khẩu hiện tại.')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự.'),

  newPassword: yup
    .string()
    .trim()
    .required('Vui lòng nhập mật khẩu mới.')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự.'),

  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp.')
    .required('Vui lòng xác nhận mật khẩu mới.')
})

export default changePasswordSchema
export type ChangePasswordSchema = yup.InferType<typeof changePasswordSchema>
