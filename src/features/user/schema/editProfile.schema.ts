import * as yup from 'yup'

const editProfileSchema = yup.object({
  fullName: yup.string().trim().required('Vui lòng nhập họ và tên.').min(2, 'Họ và tên phải có ít nhất 2 ký tự.'),

  genderID: yup.number().required('Vui lòng chọn giới tính.').oneOf([1, 2, 3], 'Giới tính không hợp lệ.'),

  birthDay: yup
    .string()
    .required('Vui lòng chọn ngày sinh.')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày sinh không đúng (yyyy-mm-dd).'),

  identityCode: yup.string().trim().required('Vui lòng nhập số CMND/CCCD.'),

  email: yup.string().trim().required('Vui lòng nhập email.').email('Email không hợp lệ.'),

  cellPhone: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại.')
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số.'),

  address: yup.string().trim(),

  bankName: yup.string().trim(),

  bankAccountName: yup.string().trim(),

  bankAccountNumber: yup
    .string()
    .trim()
    .when('bankName', {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.matches(/^[0-9]+$/, 'Số tài khoản chỉ được chứa số.')
    }),

  bankQRCode: yup.string().trim()
})

export default editProfileSchema
export type EditProfileSchema = yup.InferType<typeof editProfileSchema>
