import { isNotFutureDate } from '@/shared/utils/date.util'
import * as yup from 'yup'

const schema = yup.object({
  transactionGroupId: yup.number().required('Chọn nhóm'),
  name: yup.string().trim().required('Nhập tên'),
  transactionDate: yup
    .string()
    .required('Chọn ngày')
    .test('not-in-future', 'Không được chọn ngày tương lai', (value) => {
      if (!value) return false
      return isNotFutureDate(value, 'YYYY-MM-DD')
    }),
  amount: yup.number().typeError('Số tiền không hợp lệ').positive('Phải > 0').required('Nhập số tiền'),
  transactionBy: yup.number().required('Chọn người thu'),
  note: yup.string().optional()
})

export default schema
export type FinanceSchema = yup.InferType<typeof schema>
