import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
  value: number // 0 = hôm nay, 1 = hôm qua, etc.
  onChange: (dayAgo: number) => void
  disabled?: boolean
  todayOnly?: boolean
  colors: any
}

export const DateFilterPicker = ({ value, onChange, disabled = false, todayOnly = false, colors }: Props) => {
  const isTodayActive = value === 0
  const isDaysAgoActive = value > 0

  const handleTodayPress = () => {
    onChange(0)
  }

  const handleInputChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    if (numericValue === '' || numericValue === '0') {
      onChange(0)
    } else {
      onChange(parseInt(numericValue, 10))
    }
  }

  return (
    <View style={styles.container}>
      {/* Chip Hôm nay */}
      <TouchableOpacity
        onPress={handleTodayPress}
        disabled={disabled}
        style={[styles.chip, isTodayActive && { backgroundColor: colors.primary }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.chipText, { color: isTodayActive ? '#fff' : colors.textSecondary }]}>Hôm nay</Text>
      </TouchableOpacity>

      {/* Input Cách X ngày */}
      {!todayOnly && (
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Cách</Text>
          <TextInput
            value={value > 0 ? value.toString() : ''}
            onChangeText={handleInputChange}
            keyboardType='number-pad'
            placeholder='0'
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                borderColor: isDaysAgoActive ? colors.primary : colors.border,
                color: colors.text,
                backgroundColor: isDaysAgoActive ? colors.primary + '15' : 'transparent'
              }
            ]}
            editable={!disabled}
          />
          <Text style={[styles.label, { color: colors.textSecondary }]}>ngày</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  label: {
    fontSize: 12,
    fontWeight: '500'
  },
  input: {
    width: 36,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 2
  }
})
