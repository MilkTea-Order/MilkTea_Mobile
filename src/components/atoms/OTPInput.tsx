import { useTheme } from '@/shared/hooks/useTheme'
import React, { useEffect, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

export interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  error?: boolean
  autoFocus?: boolean
  disabled?: boolean
}

export function OTPInput({ length = 6, value, onChange, error, autoFocus = true, disabled = false }: OTPInputProps) {
  const { colors } = useTheme()
  const inputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [autoFocus])

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, length)
    onChange(cleaned)
  }

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  const borderColor = error ? colors.error || '#ef4444' : isFocused ? colors.primary : colors.border

  const charArray = value.split('')
  const remaining = length - charArray.length

  return (
    <View
      className='flex-row justify-between'
      style={{ opacity: disabled ? 0.6 : 1 }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {/* Hidden TextInput */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType='number-pad'
        maxLength={length}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete='off'
        textContentType='oneTimeCode'
        style={[styles.hiddenInput]}
        editable={!disabled}
        caretHidden
      />

      {/* OTP Boxes */}
      <View className='flex-row justify-between flex-1'>
        {Array.from({ length }).map((_, index) => {
          const char = charArray[index]
          const isFilled = index < charArray.length
          const isCurrentIndex = index === charArray.length

          return (
            <Pressable
              key={index}
              onPress={() => {
                if (!disabled) {
                  inputRef.current?.focus()
                }
              }}
              style={[
                styles.box,
                {
                  borderColor,
                  backgroundColor: colors.surface
                }
              ]}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.charText,
                  {
                    color: isFilled ? colors.text : colors.textTertiary
                  }
                ]}
              >
                {char || ''}
              </Text>

              {/* Cursor blink indicator */}
              {isCurrentIndex && isFocused && !disabled && (
                <View style={[styles.cursor, { backgroundColor: colors.primary }]} />
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1
  },
  box: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2
  },
  charText: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center'
  },
  cursor: {
    position: 'absolute',
    width: 2,
    height: 24,
    borderRadius: 1
  }
})
