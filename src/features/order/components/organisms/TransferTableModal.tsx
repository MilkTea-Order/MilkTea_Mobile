import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native'

export interface TableOption {
  id: number
  name: string
  numberOfSeats: number
}

interface TransferTableModalProps {
  visible: boolean
  tables: TableOption[]
  currentTableId?: number
  isLoading?: boolean
  onSelect: (tableId: number) => void
  onClose: () => void
  colors: {
    primary: string
    error: string
    text: string
    background: string
  }
}

export function TransferTableModal({
  visible,
  tables,
  currentTableId,
  isLoading = false,
  onSelect,
  onClose,
  colors
}: TransferTableModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)

  const handleConfirm = () => {
    if (selectedTableId) {
      onSelect(selectedTableId)
      setSelectedTableId(null)
    }
  }

  const handleClose = () => {
    setSelectedTableId(null)
    onClose()
  }

  const renderTableItem = ({ item: table }: { item: TableOption }) => {
    const isSelected = selectedTableId === table.id
    return (
      <TouchableOpacity
        onPress={() => setSelectedTableId(table.id)}
        className='flex-row items-center p-4 rounded-xl border-2 mx-6 mb-3'
        style={{
          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          borderColor: isSelected ? colors.primary : 'rgba(255, 255, 255, 0.1)'
        }}
        activeOpacity={0.7}
      >
        <View
          className='w-12 h-12 rounded-lg items-center justify-center'
          style={{
            backgroundColor: isSelected ? colors.primary : 'rgba(255, 255, 255, 0.1)'
          }}
        >
          <Ionicons name='restaurant-outline' size={24} color={isSelected ? 'white' : 'rgba(255, 255, 255, 0.6)'} />
        </View>

        <View className='flex-1 ml-4'>
          <Text className='text-white font-bold text-base'>{table.name}</Text>
          <Text className='text-white/60 text-xs mt-1'>{table.numberOfSeats} chỗ ngồi</Text>
        </View>

        <View
          className='w-6 h-6 rounded-full border-2 items-center justify-center'
          style={{
            borderColor: isSelected ? colors.primary : 'rgba(255, 255, 255, 0.3)',
            backgroundColor: isSelected ? colors.primary : 'transparent'
          }}
        >
          {isSelected && <Ionicons name='checkmark' size={14} color='white' />}
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => (
    <View className='py-12 items-center'>
      <Ionicons name='alert-circle-outline' size={48} color='rgba(255, 255, 255, 0.3)' />
      <Text className='text-white/60 text-center mt-4 font-medium'>Không có bàn trống</Text>
      <Text className='text-white/40 text-center text-xs mt-2'>Vui lòng chọn bàn khác hoặc thử lại sau</Text>
    </View>
  )

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View className='flex-1 justify-center items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View
          className='w-11/12 rounded-2xl overflow-hidden'
          style={{ backgroundColor: colors.background, height: '70%' }}
        >
          {/* Header */}
          <View className='px-6 py-5 border-b' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <View className='flex-row items-center justify-between'>
              <View className='flex-row items-center flex-1'>
                <Ionicons name='swap-horizontal-outline' size={24} color={colors.primary} />
                <Text className='ml-3 text-lg font-bold text-white'>Chuyển bàn</Text>
              </View>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name='close' size={24} color='rgba(255, 255, 255, 0.6)' />
              </TouchableOpacity>
            </View>
            <Text className='text-xs text-white/60 mt-2'>Chọn bàn trống để chuyển</Text>
          </View>

          {/* Content */}
          <FlatList
            data={tables}
            renderItem={renderTableItem}
            keyExtractor={(item) => String(item.id)}
            ListEmptyComponent={renderEmptyState}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16 }}
          />

          {/* Footer */}
          <View className='px-6 py-4 border-t flex-row gap-3' style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
            <TouchableOpacity
              onPress={handleClose}
              className='flex-1 py-3 rounded-lg border border-white/20 items-center'
              activeOpacity={0.7}
            >
              <Text className='text-white font-semibold'>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!selectedTableId || isLoading}
              className='flex-1 py-3 rounded-lg items-center'
              style={{
                backgroundColor: selectedTableId && !isLoading ? colors.primary : 'rgba(255, 255, 255, 0.2)',
                opacity: selectedTableId && !isLoading ? 1 : 0.5
              }}
              activeOpacity={0.7}
            >
              <Text className='text-white font-semibold'>{isLoading ? 'Đang xử lý...' : 'Xác nhận'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
