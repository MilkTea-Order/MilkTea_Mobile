import { Order } from '@/features/order/types/order.type'
import { STATUS } from '@/shared/constants/status'
import { useTheme } from '@/shared/hooks/useTheme'
import { formatCurrencyVND } from '@/shared/utils/currency'
import { formatDisplayDate } from '@/shared/utils/date.util'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { Image, Text, TouchableOpacity, View } from 'react-native'

interface OrderCardV2Props {
  order: Order
  isLast?: boolean
  onPress?: () => void
}

export function OrderCardV2({ order, isLast = false, onPress }: OrderCardV2Props) {
  const { colors } = useTheme()

  const tableImg = order.dinnerTable.usingImg
  const isUnpaid = order.status.id === parseInt(STATUS.ORDER.UNPAID, 10)

  return (
    <View
      className={`rounded-xl overflow-hidden mb-2 ${!isLast ? 'border-b' : ''}`}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border
      }}
    >
      {/* Row header — always visible */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
        <View className='flex-row items-center px-3 py-3'>
          {/* Thumbnail */}
          <View className='rounded-xl overflow-hidden mr-3' style={{ width: 52, height: 52 }}>
            {tableImg ? (
              <Image source={{ uri: tableImg }} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
            ) : (
              <View
                className='w-full h-full items-center justify-center'
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Ionicons name='restaurant-outline' size={22} color={colors.primary} />
              </View>
            )}
          </View>

          {/* Info */}
          <View className='flex-1 mr-2'>
            <View className='flex-row items-center gap-2 mb-0.5'>
              <Text className='text-sm font-bold' style={{ color: colors.text }} numberOfLines={1}>
                {order.dinnerTable.name}
              </Text>
              {/* Status badge */}
              <View
                className='px-1.5 py-0.5 rounded-full'
                style={{ backgroundColor: isUnpaid ? '#f59e0b25' : `${colors.primary}25` }}
              >
                <Text className='text-[9px] font-semibold' style={{ color: isUnpaid ? '#f59e0b' : colors.primary }}>
                  {order.status.name}
                </Text>
              </View>
            </View>
            <View className='flex-row items-center gap-3'>
              <View className='flex-row items-center gap-1'>
                <Ionicons name='time-outline' size={10} color={colors.textSecondary} />

                <Text className='text-[10px]' style={{ color: colors.textSecondary }}>
                  Giờ thanh toán: {formatDisplayDate(dayjs(order.paymentDate), 'HH:mm')}
                </Text>
              </View>
            </View>
            {/* Item names preview
            <Text className='text-[10px] mt-1' style={{ color: colors.textSecondary }} numberOfLines={1}>
              {firstItem?.name ?? '—'}
              {itemCount > 1 ? ` +${itemCount - 1} món` : ''}
            </Text> */}
          </View>

          {/* Amount + chevron */}
          <View className='items-end'>
            <Text className='text-sm font-bold mb-2' style={{ color: colors.primary }}>
              {formatCurrencyVND(order.totalAmount ?? 0)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

// {/* Expanded detail */}
// {isExpanded && (
//   <View className='px-3 pb-3'>
//     <View className='rounded-xl overflow-hidden' style={{ backgroundColor: `${colors.primary}08` }}>
//       {order.orderDetails?.map((detail, idx) => (
//         <View
//           key={detail.id}
//           className={`flex-row items-center px-3 py-2.5 ${idx > 0 ? 'border-t' : ''}`}
//           style={{ borderColor: `${colors.primary}20` }}
//         >
//           <View className='rounded-lg overflow-hidden mr-2.5' style={{ width: 38, height: 38 }}>
//             {detail.menu?.image ? (
//               <Image
//                 source={{ uri: detail.menu.image ?? '' }}
//                 style={{ width: '100%', height: '100%' }}
//                 resizeMode='cover'
//               />
//             ) : (
//               <View
//                 className='w-full h-full items-center justify-center'
//                 style={{ backgroundColor: `${colors.primary}20` }}
//               >
//                 <Ionicons name='cafe-outline' size={16} color={colors.primary} />
//               </View>
//             )}
//           </View>
//           <View className='flex-1'>
//             <Text className='text-xs font-semibold' style={{ color: colors.text }} numberOfLines={1}>
//               {detail.menu?.name ?? '—'}
//             </Text>
//             <Text className='text-[10px]' style={{ color: colors.textSecondary }}>
//               x{detail.quantity} · {detail.price ? formatCurrencyVND(detail.price) : '—'}
//             </Text>
//           </View>
//           <Text className='text-xs font-bold' style={{ color: colors.primary }}>
//             {formatCurrencyVND((detail.price ?? 0) * detail.quantity)}
//           </Text>
//         </View>
//       ))}
//     </View>
//   </View>
// )}
