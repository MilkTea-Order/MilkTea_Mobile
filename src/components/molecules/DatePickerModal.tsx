import { WheelColumn } from '@/components/molecules/WheelColumn'
import { useTheme } from '@/shared/hooks/useTheme'
import { generateDays, generateMonths, generateYears } from '@/shared/utils/date.util'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Easing, Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native'

interface DatePickerModalProps {
  visible: boolean
  initialDate: Dayjs
  onCancel: () => void
  onConfirm: (date: Dayjs) => void
}

export function DatePickerModal({ visible, initialDate, onCancel, onConfirm }: DatePickerModalProps) {
  const { colors } = useTheme()

  const now = dayjs()
  const [draft, setDraft] = useState<Dayjs>(initialDate)

  useEffect(() => {
    if (visible) setDraft(initialDate)
  }, [visible, initialDate])

  /* ================= DATA ================= */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const years = useMemo(() => generateYears(100, now), [])

  const months = useMemo(() => {
    return generateMonths(draft.year(), now)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const days = useMemo(() => {
    return generateDays(draft.year(), draft.month() + 1, now)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  /* ================= INDEX ================= */
  const yearIndex = useMemo(() => {
    return years.findIndex((y) => y === draft.year())
  }, [years, draft])

  const monthIndex = useMemo(() => {
    return Math.min(draft.month(), months.length - 1)
  }, [draft, months])

  const dayIndex = useMemo(() => {
    return Math.min(draft.date() - 1, days.length - 1)
  }, [draft, days])

  /* ================= HANDLERS ================= */
  const setYearByIndex = (idx: number) => {
    const year = years[idx]

    setDraft((prev) => {
      const maxDay = generateDays(year, prev.month() + 1, now).length
      return prev.year(year).date(Math.min(prev.date(), maxDay))
    })
  }

  const setMonthByIndex = (idx: number) => {
    const m = months[idx].value

    setDraft((prev) => {
      const maxDay = generateDays(prev.year(), m + 1, now).length
      return prev.month(m).date(Math.min(prev.date(), maxDay))
    })
  }

  const setDayByIndex = (idx: number) => {
    setDraft((prev) => prev.date(days[idx]))
  }

  /* ================= ANIMATION ================= */
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const cardScale = useRef(new Animated.Value(0.96)).current
  const cardTranslateY = useRef(new Animated.Value(12)).current

  useEffect(() => {
    if (!visible) return

    overlayOpacity.setValue(0)
    cardScale.setValue(0.96)
    cardTranslateY.setValue(12)

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  /* ================= UI ================= */
  return (
    <Modal visible={visible} transparent animationType='none' onRequestClose={onCancel} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16 }}>
        {/* Overlay */}
        <Pressable onPress={onCancel} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.45)',
              opacity: overlayOpacity
            }}
          />
        </Pressable>

        {/* Card */}
        <Animated.View
          style={{
            backgroundColor: colors.card,
            borderRadius: 24,
            overflow: 'hidden',
            maxHeight: '80%',
            transform: [{ scale: cardScale }, { translateY: cardTranslateY }],
            zIndex: 1
          }}
        >
          {/* Header */}
          <View
            className='flex-row justify-between items-center px-5 py-4 border-b'
            style={{ borderBottomColor: colors.border }}
          >
            <TouchableOpacity onPress={onCancel}>
              <Text style={{ color: colors.textSecondary, fontSize: 16 }}>Hủy</Text>
            </TouchableOpacity>

            <Text
              pointerEvents='none'
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                textAlign: 'center',
                color: colors.text,
                fontSize: 18,
                fontWeight: '700'
              }}
            >
              Chọn ngày
            </Text>

            <TouchableOpacity onPress={() => onConfirm(draft)}>
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: '600'
                }}
              >
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>

          {/* Wheels */}
          <View className='flex-row px-2 py-4'>
            <WheelColumn<number>
              title='Ngày'
              items={days}
              getKey={(x) => x}
              renderLabel={(x) => String(x)}
              selectedIndex={dayIndex}
              onIndexChange={setDayByIndex}
            />

            <WheelColumn<{ value: number; label: string }>
              title='Tháng'
              items={months}
              getKey={(x) => x.value}
              renderLabel={(x) => x.label}
              selectedIndex={monthIndex}
              onIndexChange={setMonthByIndex}
            />

            <WheelColumn<number>
              title='Năm'
              items={years}
              getKey={(x) => x}
              renderLabel={(x) => String(x)}
              selectedIndex={yearIndex}
              onIndexChange={setYearByIndex}
            />
          </View>

          <View style={{ height: Platform.OS === 'ios' ? 12 : 8 }} />
        </Animated.View>
      </View>
    </Modal>
  )
}
