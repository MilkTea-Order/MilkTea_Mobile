import { ALLOWED_EXT_IMG, ALLOWED_MIMES_IMG, GENDER_OPTIONS, MAX_SIZE_IMG } from '@/shared/constants/other'
import { RNFile } from '@/shared/types/file.type'
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
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày sinh không đúng (yyyy-mm-dd).')
        .test('valid-date', 'Ngày sinh không hợp lệ.', (value) => {
          if (!value) return false
          const [year, month, day] = value.split('-').map(Number)
          return !isNaN(year) && !isNaN(month) && !isNaN(day) && month >= 1 && month <= 12 && day >= 1 && day <= 31
        }),
    otherwise: (schema) => schema.notRequired()
  }),

  identityCode: yup
    .string()
    .trim()
    .required('Vui lòng nhập số CMND/CCCD.')
    .matches(/^[0-9]+$/, 'Số CMND/CCCD chỉ được chứa số.')
    .test('valid-length', 'Số CMND/CCCD phải có 9 hoặc 12 chữ số.', (value) => {
      if (!value) return false
      return value.length === 9 || value.length === 12
    }),

  email: yup
    .string()
    .trim()
    .when('$emailChanged', {
      is: true,
      then: (schema) => schema.required('Vui lòng nhập email.').email('Email không hợp lệ.'),
      otherwise: (schema) => schema.notRequired()
    }),

  cellPhone: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại.')
    .matches(/^((03|05|07|08|09)[0-9]{8}|02[0-9]{8,9})$/, 'Số điện thoại không hợp lệ.'),

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
        schema.required('Vui lòng nhập số tài khoản.').matches(/^[0-9]+$/, 'Số tài khoản chỉ được chứa số.'),
      otherwise: (schema) => schema.notRequired()
    }),
  bankQRCode: yup
    .mixed<RNFile | string>()
    .nullable()
    .when('$bankQRCodeChanged', {
      is: true,
      then: (schema) =>
        schema.test('bank-qr', function (value) {
          if (value == null) return true
          if (typeof value === 'string') return true // giữ URL BE trả về
          if (typeof value !== 'object') return this.createError({ message: 'Vui lòng chọn file ảnh QR code.' })

          const file = value as RNFile
          if (!file.uri) return this.createError({ message: 'Ảnh không hợp lệ. Hãy tải ảnh khác lên lên.' })

          const mime = (file.type || '').toLowerCase()
          const nameOrUri = (file.name || file.uri).toLowerCase()

          const isValidType = mime
            ? ALLOWED_MIMES_IMG.includes(mime)
            : ALLOWED_EXT_IMG.some((ext) => nameOrUri.endsWith(ext))

          if (!isValidType) return this.createError({ message: 'File phải là ảnh (jpg, jpeg, png, gif).' })

          if (file.size != null && file.size > MAX_SIZE_IMG)
            return this.createError({ message: 'Dung lượng ảnh phải ≤ 5MB.' })

          return true
        }),
      otherwise: (schema) => schema.notRequired()
    })
})

export default editProfileSchema
export type EditProfileSchema = yup.InferType<typeof editProfileSchema>
