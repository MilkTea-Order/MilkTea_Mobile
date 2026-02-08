import type { DinnerTable } from '@/features/order/types/table.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  visible: boolean
  tables: DinnerTable[]
  isLoading: boolean
  onRefresh: () => void
  onSelect: (table: DinnerTable) => void
  onCancel: () => void
}

export const TablePickerModal: React.FC<Props> = ({ visible, tables, isLoading, onRefresh, onSelect, onCancel }) => {
  const { colors } = useTheme()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    if (!visible) {
      setSelectedId(null)
    }
  }, [visible])

  const hasData = useMemo(() => tables.length > 0, [tables])

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onCancel}>
      <Pressable onPress={onCancel} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }} />
      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          top: '18%',
          backgroundColor: colors.card,
          borderRadius: 20,
          overflow: 'hidden'
        }}
      >
        <View
          className='flex-row items-center justify-between px-5 py-4 border-b'
          style={{ borderBottomColor: colors.border }}
        >
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Chọn bàn khả dụng</Text>
          <TouchableOpacity onPress={onRefresh} hitSlop={12}>
            <Ionicons name='refresh' size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className='py-8 items-center'>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : !hasData ? (
          <View className='py-8 items-center'>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Chưa có bàn khả dụng</Text>
          </View>
        ) : (
          <FlatList
            data={tables}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const active = selectedId === item.id
              return (
                <TouchableOpacity
                  onPress={() => setSelectedId(item.id)}
                  className='px-5 py-3 border-b'
                  style={{
                    borderBottomColor: colors.border,
                    backgroundColor: active ? `${colors.primary}12` : colors.card
                  }}
                >
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>
                    {item.name || `Bàn ${item.id}`}
                  </Text>
                  {!!item.status.id && (
                    <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{item.status.id}</Text>
                  )}
                </TouchableOpacity>
              )
            }}
          />
        )}

        <View className='flex-row justify-end px-5 py-3 gap-3'>
          <TouchableOpacity
            onPress={onCancel}
            className='px-4 py-2 rounded-xl'
            style={{ backgroundColor: `${colors.textSecondary}12` }}
          >
            <Text style={{ color: colors.text }}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!selectedId}
            onPress={() => {
              const chosen = tables.find((t) => t.id === selectedId)
              if (chosen) onSelect(chosen)
            }}
            className='px-4 py-2 rounded-xl'
            style={{ backgroundColor: selectedId ? colors.primary : colors.border }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Chọn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
