import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { BASE_URL } from '../constants/urls'
import { STORAGE_KEYS } from '../storage/storage.keys'

interface ApiConfigStore {
  apiBaseUrl: string | null
  isHydrated: boolean

  setApiBaseUrl: (url: string) => void
  clearApiBaseUrl: () => void
  resolveApiBaseUrl: () => string | null

  setHydrated: (state: boolean) => void
}

export const useApiConfigStore = create<ApiConfigStore>()(
  persist(
    (set, get) => ({
      apiBaseUrl: null,
      isHydrated: false,

      setApiBaseUrl: (url) => {
        set({ apiBaseUrl: url })
      },

      clearApiBaseUrl: () => {
        set({ apiBaseUrl: null })
      },

      setHydrated: (state) => {
        set({ isHydrated: state })
      },

      resolveApiBaseUrl: () => {
        // const storeUrl = get().apiBaseUrl
        // if (storeUrl) return storeUrl
        const envUrl = BASE_URL
        if (envUrl) {
          set({ apiBaseUrl: envUrl })
          return envUrl
        } else {
          const storeUrl = get().apiBaseUrl
          if (storeUrl) return storeUrl
        }
        return null
      }
    }),
    {
      name: STORAGE_KEYS.SETTINGS.API_BASE_URL as string,
      storage: createJSONStorage(() => AsyncStorage),

      partialize: (state) => ({
        apiBaseUrl: state.apiBaseUrl
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      }
    }
  )
)
