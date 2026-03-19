import { ALLOWED_MIMES_IMG, GENDER_OPTIONS, MAX_SIZE_IMG } from '@/shared/constants/other'
import { ImagePickerAsset } from 'expo-image-picker'
import * as yup from 'yup'

const editProfileSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Vui lòng nhập họ và tên.')
    .test('at-least-two-words', 'Họ và tên phải có ít nhất 2 từ.', (value) => {
      if (!value) return false
      const words = value.trim().split(/\s+/).filter(Boolean)
      return words.length >= 2
    }),

  genderID: yup
    .number()
    .required('Vui lòng chọn giới tính.')
    .oneOf(
      GENDER_OPTIONS.map((option) => option.value),
      'Giới tính không hợp lệ.'
    ),

  birthDay: yup.string().when('$birthDayChanged', {
    is: true,
    then: (schema) =>
      schema
        .required('Vui lòng chọn ngày sinh.')
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Định dạng ngày sinh không đúng (dd/mm/yyyy).')
        // .test('valid-date', 'Ngày sinh không hợp lệ.', (value) => {
        //   if (!value) return false
        //   const [day, month, year] = value.split('/').map(Number)
        //   return !isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31
        // }),
        .test('valid-date', 'Ngày sinh không hợp lệ.', (value) => {
          if (!value) return false
          const [day, month, year] = value.split('/').map(Number)
          const date = new Date(year, month - 1, day)
          return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
        }),
    otherwise: (schema) => schema.notRequired()
  }),

  identityCode: yup
    .string()
    .trim()
    .required('Vui lòng nhập số CMND/CCCD.')
    .matches(/^(\d{9}|\d{12})$/, 'Số CMND/CCCD chỉ được chứa số.')
    .test('valid-length', 'Số CMND/CCCD phải có 9 hoặc 12 chữ số.', (value) => {
      if (!value) return false
      return value.length === 9 || value.length === 12
    }),

  email: yup
    .string()
    .trim()
    .when('$emailChanged', {
      is: true,
      then: (schema) =>
        schema
          .required('Vui lòng nhập email.')
          .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email không hợp lệ.'),
      otherwise: (schema) => schema.notRequired()
    }),

  cellPhone: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại.')
    // .matches(/^((03|05|07|08|09)[0-9]{8}|02[0-9]{8,9})$/, 'Số điện thoại không hợp lệ.'),
    .matches(/^\+?[0-9]{8,15}$/, 'Số điện thoại không hợp lệ.'),

  address: yup
    .string()
    .trim()
    .when('$addressChanged', {
      is: true,
      then: (schema) => schema.trim().required('Vui lòng nhập địa chỉ.'),
      otherwise: (schema) => schema.notRequired()
    }),

  bankName: yup
    .string()
    .trim()
    .when('$bankInfoChanged', {
      is: true,
      then: (schema) => schema.required('Vui lòng nhập tên ngân hàng.'),
      otherwise: (schema) => schema.notRequired()
    }),

  bankAccountName: yup
    .string()
    .trim()
    .when('$bankInfoChanged', {
      is: true,
      then: (schema) => schema.required('Vui lòng nhập tên chủ tài khoản.'),
      otherwise: (schema) => schema.notRequired()
    }),

  bankAccountNumber: yup
    .string()
    .trim()
    .when('$bankInfoChanged', {
      is: true,
      then: (schema) =>
        schema
          .required('Vui lòng nhập số tài khoản.')
          .matches(/^[0-9]{6,20}$/, 'Số tài khoản chỉ được chứa số và có độ dài từ 6 đến 20 chữ số.'),
      otherwise: (schema) => schema.notRequired()
    }),
  bankQRCode: yup
    .mixed<ImagePickerAsset | string>()
    .nullable()
    .when('$bankQRCodeChanged', {
      is: true,
      then: (schema) =>
        schema.test('bank-qr', function (value) {
          if (value == null) return true
          if (typeof value === 'string') return true
          if (typeof value !== 'object' || !value || !('uri' in value)) {
            return this.createError({ message: 'Vui lòng chọn file ảnh QR code.' })
          }

          const file = value as ImagePickerAsset
          if (!file.uri) {
            return this.createError({ message: 'Ảnh không hợp lệ. Hãy tải ảnh khác lên.' })
          }
          const mime = (file.mimeType || '').toLowerCase()

          if (!mime || !ALLOWED_MIMES_IMG.includes(mime)) {
            return this.createError({ message: 'Ảnh không hợp lệ. Hãy tải ảnh (jpg, jpeg, png) lên.' })
          }

          if (file.fileSize != null && file.fileSize > MAX_SIZE_IMG) {
            return this.createError({
              message: `Ảnh không hợp lệ. Dung lượng ảnh phải ≤ ${MAX_SIZE_IMG / 1024 / 1024}MB.`
            })
          }

          return true
        }),
      otherwise: (schema) => schema.notRequired()
    })
})

export default editProfileSchema
export type EditProfileSchema = yup.InferType<typeof editProfileSchema>
