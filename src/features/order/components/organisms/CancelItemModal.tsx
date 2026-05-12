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
      <Pressable onPress={Keyboard.dismiss} className='flex-1 justify-center items-center'>
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
          className='w-full max-w-sm mx-5 rounded-3xl overflow-hidden'
          style={{ backgroundColor: colors.card }}
        >
          <View className='flex-row justify-between items-center px-5 pt-5 pb-3'>
            <TouchableOpacity onPress={onClose} className='w-6 h-6 justify-center items-center'>
              <Ionicons name='close' size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text className='text-lg font-bold' style={{ color: colors.text }}>
              Lý do hủy món
            </Text>

            <View className='w-6' />
          </View>

          <View className='px-5 pb-5'>
            <Text className='text-sm mb-2' style={{ color: colors.textSecondary }}>
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
              className={`flex-row items-center justify-center gap-2 h-12 rounded-2xl mt-4 ${reason.trim() ? 'bg-red-500' : ''}`}
              style={{
                backgroundColor: reason.trim() ? '#EF4444' : colors.border,
                opacity: reason.trim() ? 1 : 0.7
              }}
            >
              <Ionicons name='close-circle' size={20} color='white' />
              <Text className='text-white font-bold text-base'>Hủy món</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
