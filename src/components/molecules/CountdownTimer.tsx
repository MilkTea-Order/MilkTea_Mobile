import { useTheme } from '@/shared/hooks/useTheme'
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export interface CountdownTimerProps {
  seconds?: number
  onExpire: () => void
  autoStart?: boolean
  onResend?: () => void
}

export function CountdownTimer({ seconds = 60, onExpire, autoStart = true, onResend }: CountdownTimerProps) {
  const { colors } = useTheme()
  const [remaining, setRemaining] = useState(autoStart ? seconds : 0)
  const [isActive, setIsActive] = useState(autoStart)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsActive(false)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onExpire])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleResend = () => {
    setRemaining(seconds)
    setIsActive(true)
    onResend?.()
  }

  if (!isActive && remaining === 0) {
    return (
      <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
        <Text className='text-sm font-semibold' style={{ color: colors.primary }}>
          Gửi lại mã
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View className='flex-row items-center justify-center'>
      <Text className='text-sm' style={{ color: colors.textSecondary }}>
        Gửi lại mã sau{' '}
      </Text>
      <Text className='text-sm font-bold' style={{ color: colors.primary }}>
        {formatTime(remaining)}
      </Text>
    </View>
  )
}
