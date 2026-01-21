import { EditProfileForm } from '@/components/organisms/EditProfileForm'
import { useMe } from '@/features/user/hooks/useUser'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function EditProfileScreen() {
  const router = useRouter()
  const { colors, gradients } = useTheme()
  const insets = useSafeAreaInsets()
  const { data: meData, isPending: isLoadingUser } = useMe()
  const userProfile = meData?.data

  if (isLoadingUser || !userProfile) {
    return (
      <View className='flex-1 items-center justify-center' style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size='large' color={colors.primary} />
        <Text className='mt-4' style={{ color: colors.textSecondary }}>
          Đang tải thông tin...
        </Text>
      </View>
    )
  }

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
        <Text className='text-white text-2xl font-bold text-center mt-2'>Chỉnh sửa hồ sơ</Text>
      </LinearGradient>

      {/* Form */}
      {/* <EditProfileForm userProfile={userProfile} onSuccess={handleSuccess} /> */}
      <EditProfileForm userProfile={userProfile} />
    </View>
  )
}
