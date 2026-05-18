import { useEffect, useState } from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'
import { Easing, runOnJS, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated'

interface AnimatedCounterProps {
  endValue: number
  duration?: number
  formatter?: (value: number) => string
  className?: string
  style?: StyleProp<TextStyle>
  color?: string
  trigger?: unknown
}

export function AnimatedCounter({
  endValue,
  duration = 800,
  formatter = (value) => value.toString(),
  className,
  style,
  color,
  trigger
}: AnimatedCounterProps) {
  const progress = useSharedValue(0)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    progress.value = 0

    progress.value = withTiming(endValue, {
      duration,
      easing: Easing.out(Easing.cubic)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endValue, duration, trigger])

  useAnimatedReaction(
    () => Math.round(progress.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplayValue)(current)
      }
    }
  )

  return (
    <Text className={className} style={[{ color }, style]}>
      {formatter(displayValue)}
    </Text>
  )
}
