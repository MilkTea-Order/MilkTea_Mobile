import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'

import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { SettingsForm } from '@/components/organisms/SettingsForm'

export default function SettingsScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <LinearGradient
        colors={gradients.header as any}
        style={{
          paddingTop: insets.top + 16,
          paddingBottom: 24,
          paddingHorizontal: 20
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className='absolute bg-white/20 rounded-full p-2'
          style={{
            top: insets.top + 16,
            left: 20,
            zIndex: 10
          }}
          activeOpacity={0.7}
        >
          <Ionicons name='arrow-back' size={24} color='white' />
        </TouchableOpacity>
        <Text className='text-white text-2xl font-bold text-center mt-2'>Cấu hình</Text>
      </LinearGradient>

      <SettingsForm />
    </View>
  )
}

// Setting Item with Switch
// interface SettingItemProps {
//   icon: string
//   label: string
//   description?: string
//   value: boolean
//   onValueChange: (value: boolean) => void
// }

// function SettingItem({ icon, label, description, value, onValueChange }: SettingItemProps) {
//   const { colors } = useTheme()

//   return (
//     <View
//       className='flex-row items-center justify-between py-3 px-4 rounded-xl'
//       style={{
//         backgroundColor: colors.card,
//         marginBottom: 8
//       }}
//     >
//       <View className='flex-row items-center flex-1 mr-4'>
//         <View
//           className='w-10 h-10 rounded-full items-center justify-center mr-3'
//           style={{ backgroundColor: colors.primary + '20' }}
//         >
//           <Ionicons name={icon as any} size={20} color={colors.primary} />
//         </View>
//         <View className='flex-1'>
//           <Text className='text-base font-semibold' style={{ color: colors.text }}>
//             {label}
//           </Text>
//           {description && (
//             <Text className='text-sm mt-0.5' style={{ color: colors.textSecondary }}>
//               {description}
//             </Text>
//           )}
//         </View>
//       </View>
//       <Switch value={value} onValueChange={onValueChange} />
//     </View>
//   )
// }

// // Setting Item with Touchable (for navigation)
// interface TouchableOpacitySettingItemProps {
//   icon: string
//   label: string
//   description?: string
//   onPress: () => void
// }

// function TouchableOpacitySettingItem({ icon, label, description, onPress }: TouchableOpacitySettingItemProps) {
//   const { colors } = useTheme()

//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.7}
//       className='flex-row items-center justify-between py-3 px-4 rounded-xl'
//       style={{
//         backgroundColor: colors.card,
//         marginBottom: 8
//       }}
//     >
//       <View className='flex-row items-center flex-1 mr-4'>
//         <View
//           className='w-10 h-10 rounded-full items-center justify-center mr-3'
//           style={{ backgroundColor: colors.primary + '20' }}
//         >
//           <Ionicons name={icon as any} size={20} color={colors.primary} />
//         </View>
//         <View className='flex-1'>
//           <Text className='text-base font-semibold' style={{ color: colors.text }}>
//             {label}
//           </Text>
//           {description && (
//             <Text className='text-sm mt-0.5' style={{ color: colors.textSecondary }}>
//               {description}
//             </Text>
//           )}
//         </View>
//       </View>
//       <Ionicons name='chevron-forward' size={20} color={colors.textSecondary} />
//     </TouchableOpacity>
//   )
// }
