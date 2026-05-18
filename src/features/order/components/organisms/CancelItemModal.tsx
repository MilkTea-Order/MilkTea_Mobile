import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Keyboard, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated'

interface Props {
  visible: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  itemCount: number
}

export function CancelItemModal({ visible, onClose, onSubmit, itemCount }: Props) {
  const { colors } = useTheme()
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!visible) {
      setReason('')
    }
  }, [visible])

  const handleSubmit = () => {
    Keyboard.dismiss()
    onSubmit(reason.trim())
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType='none' onRequestClose={onClose}>
      <Pressable onPress={Keyboard.dismiss} className='flex-1 items-center justify-center'>
        <Pressable onPress={onClose} className='absolute inset-0'>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className='flex-1 bg-black/45'
          />
        </Pressable>

        <Animated.View
          entering={SlideInDown.duration(300).springify()}
          exiting={SlideOutDown.duration(200)}
          className='mx-5 w-full max-w-sm overflow-hidden rounded-3xl'
          style={{ backgroundColor: colors.card }}
        >
          <View className='flex-row items-center justify-between px-5 pb-3 pt-5'>
            <TouchableOpacity onPress={onClose} className='h-6 w-6 items-center justify-center'>
              <Ionicons name='close' size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text className='text-lg font-bold' style={{ color: colors.text }}>
              Lý do hủy món
            </Text>

            <View className='w-6' />
          </View>

          <View className='px-5 pb-5'>
            <Text className='mb-2 text-sm' style={{ color: colors.textSecondary }}>
              Bạn đang hủy {itemCount} món. Vui lòng nhập lý do:
            </Text>

            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder='Nhập lý do hủy món...'
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical='top'
              className='rounded-xl px-4 py-3 text-base'
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: 100
              }}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              // disabled={!reason.trim()}
              className={`mt-4 h-12 flex-row items-center justify-center gap-2 rounded-2xl ${reason.trim() ? 'bg-red-500' : ''}`}
              style={{
                backgroundColor: reason.trim() ? '#EF4444' : colors.border,
                opacity: reason.trim() ? 1 : 0.7
              }}
            >
              <Ionicons name='close-circle' size={20} color='white' />
              <Text className='text-base font-bold text-white'>Hủy món</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
