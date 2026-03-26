import GrabLogo from '~/assets/logo/grab.svg'
import ShopeeLogo from '~/assets/logo/shopee.svg'
export const PAYMENT_METHOD = {
  CASH: 'CASH' as const,
  BANK: 'BANK' as const,
  SHOPEE: 'SHOPEE' as const,
  GRAB: 'GRAB' as const
} as const
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export interface PaymentMethodOption {
  id: PaymentMethod
  label: string
  icon?: string
  logo?: any
  iconColor: string
  bgColor: string
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: PAYMENT_METHOD.CASH,
    label: 'Tiền mặt',
    icon: 'cash-outline',
    iconColor: '#22c55e',
    bgColor: '#22c55e20'
  },
  {
    id: PAYMENT_METHOD.BANK,
    label: 'Chuyển khoản',
    icon: 'business-outline',
    iconColor: '#3b82f6',
    bgColor: '#3b82f620'
  },
  {
    id: PAYMENT_METHOD.SHOPEE,
    label: 'Shopee',
    logo: ShopeeLogo,
    iconColor: '#f97316',
    bgColor: '#f9731620'
  },
  {
    id: PAYMENT_METHOD.GRAB,
    label: 'Grab',
    logo: GrabLogo,
    iconColor: '#00b140',
    bgColor: '#00b14020'
  }
]
