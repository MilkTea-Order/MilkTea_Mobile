import { getObject, removeItem, setObject } from '@/shared/storage/secure-storage'
import { STORAGE_KEYS } from '@/shared/storage/storage.keys'
import { create } from 'zustand'
import { LoginResponse } from '../types/auth.type'
import { User } from '../types/user.type'

interface AuthState {
  session: LoginResponse | null
  isHydrating: boolean

  hydrate: () => Promise<void>
  login: (session: LoginResponse) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => Promise<void>
  updateAccessToken: (accessToken: string) => Promise<void>

  // getter
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  isHydrating: true,

  hydrate: async () => {
    try {
      set({ isHydrating: true })

      const session = await getObject<LoginResponse>(STORAGE_KEYS.AUTH.SESSION)

      if (session && session.accessToken && session.user) {
        set({ session })
      }

      set({ isHydrating: false })
    } catch {
      set({
        isHydrating: false
      })
    }
  },

  login: async (sessionData: LoginResponse) => {
    set({ session: sessionData })

    // Save entire session object
    await setObject(STORAGE_KEYS.AUTH.SESSION, sessionData)
  },

  logout: async () => {
    set({ session: null })

    // Remove session object
    await removeItem(STORAGE_KEYS.AUTH.SESSION)
  },

  setUser: async (user: User) => {
    const currentSession = get().session
    if (currentSession) {
      const updatedSession: LoginResponse = {
        ...currentSession,
        user
      }
      set({ session: updatedSession })
      // Save updated session object
      await setObject(STORAGE_KEYS.AUTH.SESSION, updatedSession)
    }
  },

  updateAccessToken: async (accessToken: string) => {
    const currentSession = get().session
    if (currentSession) {
      const updatedSession: LoginResponse = {
        ...currentSession,
        accessToken
      }
      set({ session: updatedSession })
      // Save updated session object
      await setObject(STORAGE_KEYS.AUTH.SESSION, updatedSession)
    }
  },

  // getter: check if session exists and has accessToken and refreshToken
  isAuthenticated: () => {
    const session = get().session
    return !!(session && session.accessToken && session.refreshToken)
  }
}))
