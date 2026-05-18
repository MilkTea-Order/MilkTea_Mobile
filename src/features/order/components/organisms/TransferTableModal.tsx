import { useEmptyTables } from '@/features/order/hooks/useTable'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { DinnerTable } from '../../types/table.type'

export type TableModalMode = 'transfer' | 'merge'

const MODE_CONFIG: Record<TableModalMode, { icon: string; title: string; subtitle: string; confirmLabel: string }> = {
  transfer: {
    icon: 'swap-horizontal-outline',
    title: 'Chuyển bàn',
    subtitle: 'Chọn bàn trống để chuyển',
    confirmLabel: 'Xác nhận chuyển'
  },
  merge: {
    icon: 'git-merge-outline',
    title: 'Gộp bàn',
    subtitle: 'Chọn bàn đang có khách để gộp',
    confirmLabel: 'Xác nhận gộp'
  }
}

interface TableModalProps {
  visible: boolean
  mode: TableModalMode
  currentTableId?: number
  isSubmitting?: boolean
  onSelect: (tableId: number) => void
  onClose: () => void
  colors: {
    primary: string
    error: string
    text: string
    textSecondary: string
    background: string
    border: string
    card: string
  }
}

export function TransferTableModal({
  visible,
  mode,
  currentTableId,
  isSubmitting = false,
  onSelect,
  onClose,
  colors
}: TableModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const config = MODE_CONFIG[mode]

  // Chỉ fetch khi modal đang mở, mode quyết định isEmpty
  const isEmpty = mode === 'transfer'
  const { data: tables, isLoading: isLoadingTables } = useEmptyTables(isEmpty, visible)

  // Lọc bỏ bàn hiện tại
  const filteredTables = (tables ?? []).filter((t) => t.id !== currentTableId)

  const handleConfirm = () => {
    if (selectedTableId) {
      onSelect(selectedTableId)
    }
  }

  const handleClose = () => {
    setSelectedTableId(null)
    onClose()
  }

  const renderTableItem = ({ item: table }: { item: DinnerTable }) => {
    const isSelected = selectedTableId === table.id
    const tableImage = mode === 'merge' ? table.usingImg : table.emptyImg

    return (
      <TouchableOpacity
        onPress={() => setSelectedTableId(table.id)}
        className='mx-6 mb-3 flex-row items-center rounded-xl border-2 p-4'
        style={{
          backgroundColor: isSelected ? `${colors.primary}20` : colors.card,
          borderColor: isSelected ? colors.primary : colors.border
        }}
        activeOpacity={0.7}
      >
        {tableImage ? (
          <Image source={{ uri: tableImage }} className='h-12 w-12 rounded-lg' resizeMode='cover' />
        ) : (
          <View
            className='h-12 w-12 items-center justify-center rounded-lg'
            style={{ backgroundColor: isSelected ? colors.primary : `${colors.primary}20` }}
          >
            <Ionicons
              name={mode === 'merge' ? 'people-outline' : 'restaurant-outline'}
              size={24}
              color={isSelected ? 'white' : colors.primary}
            />
          </View>
        )}

        <View className='ml-4 flex-1'>
          <Text className='text-base font-bold' style={{ color: colors.text }}>
            {table.name}
          </Text>
          <Text className='mt-1 text-xs' style={{ color: colors.textSecondary }}>
            {table.numberOfSeats} chỗ ngồi
          </Text>
        </View>

        <View
          className='h-6 w-6 items-center justify-center rounded-full border-2'
          style={{
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isSelected ? colors.primary : 'transparent'
          }}
        >
          {isSelected && <Ionicons name='checkmark' size={14} color='white' />}
        </View>
      </TouchableOpacity>
    )
  }

  const emptyMessage = mode === 'transfer' ? 'Không có bàn trống' : 'Không có bàn nào đang phục vụ'
  const emptySubMessage = mode === 'transfer' ? 'Vui lòng thử lại sau' : 'Vui lòng thử lại sau'

  const renderEmptyState = () => (
    <View className='items-center py-12'>
      <Ionicons name='alert-circle-outline' size={48} color={colors.textSecondary} />
      <Text className='mt-4 text-center font-medium' style={{ color: colors.text }}>
        {emptyMessage}
      </Text>
      <Text className='mt-2 text-center text-xs' style={{ color: colors.textSecondary }}>
        {emptySubMessage}
      </Text>
    </View>
  )

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View className='flex-1 items-center justify-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View
          className='w-11/12 overflow-hidden rounded-2xl'
          style={{ backgroundColor: colors.background, height: '70%' }}
        >
          {/* Header */}
          <View className='border-b px-6 py-5' style={{ borderColor: colors.border }}>
            <View className='flex-row items-center justify-between'>
              <View className='flex-1 flex-row items-center'>
                <Ionicons name={config.icon as any} size={24} color={colors.primary} />
                <Text className='ml-3 text-lg font-bold' style={{ color: colors.text }}>
                  {config.title}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name='close' size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {/* <Text className='text-xs mt-2' style={{ color: colors.textSecondary }}>
              {config.subtitle}
            </Text> */}
          </View>

          {/* Content */}
          {isLoadingTables ? (
            <View className='flex-1 items-center justify-center'>
              <ActivityIndicator size='large' color={colors.primary} />
              <Text className='mt-3 text-sm' style={{ color: colors.textSecondary }}>
                Đang tải danh sách bàn...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTables}
              renderItem={renderTableItem}
              keyExtractor={(item) => String(item.id)}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            />
          )}

          {/* Footer */}
          <View className='flex-row gap-3 border-t px-6 py-4' style={{ borderColor: colors.border }}>
            <TouchableOpacity
              onPress={handleClose}
              className='flex-1 items-center rounded-lg border py-3'
              style={{ borderColor: colors.border }}
              activeOpacity={0.7}
            >
              <Text className='font-semibold' style={{ color: colors.text }}>
                Hủy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selectedTableId || isSubmitting}
              className='flex-1 items-center rounded-lg py-3'
              style={{
                backgroundColor: selectedTableId && !isSubmitting ? colors.primary : `${colors.primary}30`,
                opacity: selectedTableId && !isSubmitting ? 1 : 0.5
              }}
              activeOpacity={0.7}
            >
              <Text
                className='font-semibold'
                style={{ color: selectedTableId && !isSubmitting ? 'white' : colors.text }}
              >
                {isSubmitting ? 'Đang xử lý...' : config.confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
