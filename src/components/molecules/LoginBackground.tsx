import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, View } from 'react-native'
import { AnimatedOrb } from '../atoms/AnimatedOrb'

const { width } = Dimensions.get('window')

interface LoginBackgroundProps {
  colors: {
    background: string
    surface: string
    primary: string
    secondary: string
    primaryLight: string
  }
  isDark: boolean
  gradients: {
    primary: readonly [string, string, string]
  }
}

export function LoginBackground({ colors, isDark, gradients }: LoginBackgroundProps) {
  return (
    <View className='absolute inset-0'>
      {/* Animated Gradient Background */}
      <LinearGradient
        colors={isDark ? [colors.background, colors.surface, colors.background] : (gradients.primary as any)}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Floating Orbs - Animated */}
      <View className='absolute inset-0 pointer-events-none overflow-hidden'>
        <AnimatedOrb
          size={width * 0.6}
          position={{ top: -width * 0.2, right: -width * 0.2 }}
          gradientColors={[colors.primary, colors.secondary]}
          isDark={isDark}
          delay={0}
        />
        <AnimatedOrb
          size={width * 0.5}
          position={{ bottom: -width * 0.15, left: -width * 0.15 }}
          gradientColors={[colors.secondary, colors.primary]}
          isDark={isDark}
          delay={500}
        />
        <AnimatedOrb
          size={width * 0.25}
          position={{ top: '30%' as any, left: -width * 0.08 }}
          gradientColors={[colors.primary, colors.primaryLight]}
          isDark={isDark}
          delay={1000}
        />
      </View>
    </View>
  )
}
