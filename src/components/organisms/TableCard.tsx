import { useTheme } from '@/shared/hooks/useTheme'
import { DinnerTable } from '@/features/order/types/table.type'
import { Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export interface TableCardProps {
  table: DinnerTable
  onPress?: (table: DinnerTable) => void
  selected?: boolean
}

export function TableCard({ table, onPress, selected = false }: TableCardProps) {
  const { colors } = useTheme()
  const tableImageUrl = (table as any).emptyImg || null

  return (
    <TouchableOpacity
      onPress={() => onPress?.(table)}
      className='rounded-2xl border overflow-hidden'
      style={{
        width: '31%',
        backgroundColor: selected ? `${colors.primary}20` : colors.card,
        borderColor: selected ? colors.primary : colors.border,
        borderWidth: selected ? 2 : 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2
      }}
      activeOpacity={0.85}
    >
      <View
        style={{
          width: '100%',
          height: 95,
          backgroundColor: `${colors.primary}10`
        }}
      >
        {tableImageUrl ? (
          <Image source={{ uri: tableImageUrl }} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
        ) : (
          <View className='flex-1 items-center justify-center'>
            <Ionicons name='restaurant-outline' size={48} color={colors.primary} />
          </View>
        )}
      </View>

      <View className='p-3'>
        <View className='flex-row items-center'>
          <Ionicons name='people-outline' size={14} color={colors.textSecondary} />
          <Text className='text-xs ml-1' style={{ color: colors.textSecondary }}>
            {table.numberOfSeats} ghế
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
