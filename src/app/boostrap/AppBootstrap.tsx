import { ApiConfigModal } from '@/components/organisms/ApiConfigModal'
import { SplashScreen as AppSplashScreen } from '@/components/organisms/SplashScreen'
import { useAuthStore } from '@/features/auth/store/auth.store'
import AppProvider from '@/Providers/AppProvider'
import { useApiConfigStore } from '@/shared/store/apiConfigStore'
import { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function AppBootstrap() {
  const isHydratingAuthStore = useAuthStore((s) => s.isHydrating)
  const isHydratedApiConfig = useApiConfigStore((s) => s.isHydrated)

  const hydrate = useAuthStore((s) => s.hydrate)
  const resolveApiBaseUrl = useApiConfigStore((s) => s.resolveApiBaseUrl)

  const [showApiModal, setShowApiModal] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isHydratedApiConfig) return

    const url = resolveApiBaseUrl()
    if (!url) {
      setShowApiModal(true)
    }
  }, [isHydratedApiConfig, resolveApiBaseUrl])

  if (!isHydratedApiConfig || isHydratingAuthStore) {
    return <AppSplashScreen isVisible />
  }

  return (
    <SafeAreaProvider>
      <AppProvider />
      <ApiConfigModal visible={showApiModal} onClose={() => setShowApiModal(false)} />
    </SafeAreaProvider>
  )
}
