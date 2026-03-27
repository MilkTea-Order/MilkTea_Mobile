import { formatDisplayDate, getTodayDateRange, toISOString, toEndOfDayISOString } from '@/shared/utils/date.util'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native'

type DateRange = {
  fromDate: string | null
  toDate: string | null
}

export type DateFilterPickerSize = 'sm' | 'md' | 'lg'

type Props = {
  value: DateRange
  onChange: (range: DateRange) => void
  disabled?: boolean
  colors: any
  size?: DateFilterPickerSize
}

const SIZE_CONFIG: Record<
  DateFilterPickerSize,
  {
    buttonPaddingX: number
    buttonPaddingY: number
    textSize: string
    buttonGap: number
    iconSize: number
    applyPaddingX: number
  }
> = {
  sm: { buttonPaddingX: 8, buttonPaddingY: 4, textSize: 'text-[10px]', buttonGap: 1, iconSize: 11, applyPaddingX: 10 },
  md: { buttonPaddingX: 10, buttonPaddingY: 6, textSize: 'text-xs', buttonGap: 2, iconSize: 12, applyPaddingX: 12 },
  lg: { buttonPaddingX: 14, buttonPaddingY: 8, textSize: 'text-sm', buttonGap: 3, iconSize: 14, applyPaddingX: 16 }
}

export const DateFilterPicker = ({ value, onChange, disabled = false, colors, size = 'md' }: Props) => {
  const config = SIZE_CONFIG[size]
  const [showFromPicker, setShowFromPicker] = useState(false)
  const [showToPicker, setShowToPicker] = useState(false)

  const [tempFromDate, setTempFromDate] = useState<string | null>(value.fromDate)
  const [tempToDate, setTempToDate] = useState<string | null>(value.toDate)
  const [isTodayPressed, setIsTodayPressed] = useState(true)

  useEffect(() => {
    setTempFromDate(value.fromDate)
    setTempToDate(value.toDate)
    if (value.fromDate && value.toDate) {
      const todayRange = getTodayDateRange()
      setIsTodayPressed(value.fromDate === todayRange.fromDate && value.toDate === todayRange.toDate)
    }
  }, [value.fromDate, value.toDate])

  const handleFromDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setIsTodayPressed(false)
    if (Platform.OS === 'android') {
      setShowFromPicker(false)
      if (event.type === 'set' && selectedDate) {
        setTempFromDate(toISOString(selectedDate))
      }
    } else {
      if (selectedDate) {
        setTempFromDate(toISOString(selectedDate))
      }
    }
  }

  const handleToDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setIsTodayPressed(false)
    if (Platform.OS === 'android') {
      setShowToPicker(false)
      if (event.type === 'set' && selectedDate) {
        setTempToDate(toEndOfDayISOString(selectedDate))
      }
    } else {
      if (selectedDate) {
        setTempToDate(toEndOfDayISOString(selectedDate))
      }
    }
  }

  const handleConfirmFromDate = () => {
    setShowFromPicker(false)
  }

  const handleConfirmToDate = () => {
    setShowToPicker(false)
  }

  const handleTodayPress = () => {
    const { fromDate, toDate } = getTodayDateRange()
    setTempFromDate(fromDate)
    setTempToDate(toDate)
    setIsTodayPressed(true)
    onChange({
      fromDate,
      toDate
    })
  }

  const handleApply = () => {
    if (tempFromDate && tempToDate && dayjs(tempFromDate).isAfter(tempToDate)) return

    onChange({
      fromDate: tempFromDate,
      toDate: tempToDate
    })
  }

  return (
    <View className='flex-row items-center' style={{ gap: config.buttonGap }}>
      <TouchableOpacity
        onPress={handleTodayPress}
        disabled={disabled}
        className='rounded-lg border-2'
        style={{
          paddingHorizontal: config.buttonPaddingX + 2,
          paddingVertical: config.buttonPaddingY,
          borderColor: isTodayPressed ? colors.primary : colors.border,
          backgroundColor: isTodayPressed ? colors.primary : 'transparent'
        }}
        activeOpacity={0.7}
      >
        <Text
          className={`${config.textSize} font-semibold`}
          style={{
            color: isTodayPressed ? '#fff' : colors.textSecondary
          }}
        >
          Hôm nay
        </Text>
      </TouchableOpacity>

      <View
        className={`w-[1px]`}
        style={{
          height: config.iconSize + 4,
          backgroundColor: colors.border,
          marginHorizontal: config.buttonGap
        }}
      />

      {/* From Date */}
      <TouchableOpacity
        onPress={() => {
          setShowFromPicker(true)
        }}
        disabled={disabled}
        className='rounded-lg border'
        style={{
          paddingHorizontal: config.buttonPaddingX,
          paddingVertical: config.buttonPaddingY,
          borderColor: !isTodayPressed ? colors.primary : colors.border,
          backgroundColor: colors.card
        }}
        activeOpacity={0.7}
      >
        <Text className={`${config.textSize} font-medium`} style={{ color: colors.text }}>
          {formatDisplayDate(dayjs(tempFromDate), 'DD/MM/YYYY')}
        </Text>
      </TouchableOpacity>

      <Text className={`${config.textSize}`} style={{ color: colors.textSecondary }}>
        -
      </Text>

      {/* To Date */}
      <TouchableOpacity
        onPress={() => {
          setShowToPicker(true)
        }}
        disabled={disabled}
        className='rounded-lg border'
        style={{
          paddingHorizontal: config.buttonPaddingX,
          paddingVertical: config.buttonPaddingY,
          borderColor: !isTodayPressed ? colors.primary : colors.border,
          backgroundColor: colors.card
        }}
        activeOpacity={0.7}
      >
        <Text className={`${config.textSize} font-medium`} style={{ color: colors.text }}>
          {formatDisplayDate(dayjs(tempToDate), 'DD/MM/YYYY')}
        </Text>
      </TouchableOpacity>

      {/* Apply Button - always visible but disabled when today is selected */}
      <TouchableOpacity
        onPress={handleApply}
        disabled={disabled || isTodayPressed}
        className='rounded-lg'
        style={{
          paddingHorizontal: config.applyPaddingX,
          paddingVertical: config.buttonPaddingY,
          backgroundColor: isTodayPressed ? colors.border : colors.primary
        }}
        activeOpacity={0.7}
      >
        <Text
          className={`${config.textSize} font-semibold`}
          style={{ color: isTodayPressed ? colors.textSecondary : '#fff' }}
        >
          Áp dụng
        </Text>
      </TouchableOpacity>

      {/* From Date Picker Modal */}
      {Platform.OS === 'ios' && showFromPicker && (
        <Modal transparent animationType='slide'>
          <View className='flex-1 justify-end bg-black/50'>
            <View
              style={{
                backgroundColor: colors.card,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: 40
              }}
            >
              <View className='flex-row justify-between px-4 py-3 border-b' style={{ borderColor: colors.border }}>
                <TouchableOpacity onPress={() => setShowFromPicker(false)}>
                  <Text style={{ color: colors.textSecondary }}>Hủy</Text>
                </TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Từ ngày</Text>
                <TouchableOpacity onPress={handleConfirmFromDate}>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempFromDate ? new Date(tempFromDate) : new Date()}
                mode='date'
                locale='vi'
                maximumDate={tempToDate ? new Date(tempToDate) : undefined}
                display='spinner'
                onChange={handleFromDateChange}
                textColor={colors.text}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && showFromPicker && (
        <DateTimePicker
          value={tempFromDate ? new Date(tempFromDate) : new Date()}
          mode='date'
          maximumDate={tempToDate ? new Date(tempToDate) : undefined}
          display='default'
          onChange={handleFromDateChange}
        />
      )}

      {/* To Date Picker Modal */}

      {Platform.OS === 'ios' && showToPicker && (
        <Modal transparent animationType='slide'>
          <View className='flex-1 justify-end bg-black/50'>
            <View
              style={{
                backgroundColor: colors.card,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: 40
              }}
            >
              <View className='flex-row justify-between px-4 py-3 border-b' style={{ borderColor: colors.border }}>
                <TouchableOpacity onPress={() => setShowToPicker(false)}>
                  <Text style={{ color: colors.textSecondary }}>Hủy</Text>
                </TouchableOpacity>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Đến ngày</Text>
                <TouchableOpacity onPress={handleConfirmToDate}>
                  <Text style={{ color: colors.primary, fontWeight: '600' }}>Xong</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempToDate ? new Date(tempToDate) : new Date()}
                mode='date'
                locale='vi-VN'
                display='spinner'
                maximumDate={new Date()}
                minimumDate={tempFromDate ? new Date(tempFromDate) : undefined}
                onChange={handleToDateChange}
                textColor={colors.text}
              />
            </View>
          </View>
        </Modal>
      )}
      {Platform.OS === 'android' && showToPicker && (
        <DateTimePicker
          value={tempToDate ? new Date(tempToDate) : new Date()}
          mode='date'
          display='default'
          maximumDate={new Date()}
          minimumDate={tempFromDate ? new Date(tempFromDate) : undefined}
          onChange={handleToDateChange}
        />
      )}
    </View>
  )
}
