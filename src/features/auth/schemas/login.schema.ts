import * as Yup from 'yup'

// Validation schema cho login form
export const loginValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(50, 'Tên đăng nhập quá dài')
    .required('Vui lòng nhập tên đăng nhập'),

  password: Yup.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự').required('Vui lòng nhập mật khẩu')
})

export type LoginSchema = Yup.InferType<typeof loginValidationSchema>
