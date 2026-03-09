import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
  value: number
  onChange: (dayAgo: number) => void
  disabled?: boolean
  todayOnly?: boolean
  colors: any
}

export const DateFilterPicker = ({ value, onChange, disabled = false, todayOnly = false, colors }: Props) => {
  const isTodayActive = value === 0
  const [inputValue, setInputValue] = useState<string>(value > 0 ? String(value) : '')

  useEffect(() => {
    setInputValue(value > 0 ? String(value) : '')
  }, [value])

  const handleTodayPress = () => {
    onChange(0)
    setInputValue('')
  }

  const handleInputChange = (text: string) => {
    if (/^\d*$/.test(text)) {
      setInputValue(text)
    }
  }

  const handleInputSubmit = () => {
    onChange(Number(inputValue === '' ? 0 : Number(inputValue)))
  }
  return (
    <View className='flex-row items-center gap-2'>
      <TouchableOpacity
        onPress={handleTodayPress}
        disabled={disabled}
        className='px-2.5 py-1 rounded-lg border-2'
        style={{
          borderColor: isTodayActive ? colors.primary : colors.border,
          backgroundColor: isTodayActive ? colors.primary : 'transparent'
        }}
        activeOpacity={0.7}
      >
        <Text
          className={`text-xs font-semibold ${isTodayActive ? 'text-white' : ''}`}
          style={{ color: isTodayActive ? '#fff' : colors.textSecondary }}
        >
          Hôm nay
        </Text>
      </TouchableOpacity>

      {!todayOnly && (
        <View
          className={`w-[1px] h-5 mx-1`}
          style={{
            backgroundColor: colors.border
          }}
        />
      )}
      {!todayOnly && (
        <View className='flex-row items-center gap-1'>
          <Text className='text-xs font-medium' style={{ color: colors.textSecondary }}>
            Cách
          </Text>
          <TextInput
            value={String(inputValue)}
            onChangeText={handleInputChange}
            onSubmitEditing={handleInputSubmit}
            placeholder='0'
            placeholderTextColor='black'
            keyboardType='numbers-and-punctuation'
            returnKeyType='done'
            className='w-9 h-[26px] rounded-md border text-center text-xs font-semibold px-0.5'
            style={{
              borderColor: !isTodayActive ? colors.primary : colors.border,
              color: colors.text,
              backgroundColor: !isTodayActive ? colors.primary + '15' : 'transparent'
            }}
            editable={!disabled}
          />
          <Text className='text-xs font-medium' style={{ color: colors.textSecondary }}>
            ngày
          </Text>
        </View>
      )}
    </View>
  )
}
