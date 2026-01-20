import {
  getItem as getAsyncItem,
  getObject as getAsyncObject,
  removeItem as removeAsyncItem,
  setItem as setAsyncItem,
  setObject as setAsyncObject
} from '@/shared/storage/async-storage'
import {
  getObject as getSecureObject,
  removeItem as removeSecureItem,
  setObject as setSecureObject
} from '@/shared/storage/secure-storage'
import { STORAGE_KEYS } from '@/shared/storage/storage.keys'
import { create } from 'zustand'
import { LoginResponse, Profile, Token } from '../types/auth.type'
import { User } from '../types/user.type'

interface AuthState {
  tokens: Token | null
  profile: Profile | null
  isHydrating: boolean
  username: string | null
  rememberUsername: boolean

  hydrate: () => Promise<void>
  login: (session: LoginResponse) => Promise<void>
  logout: () => Promise<void>
  setUser: (user: User) => Promise<void>
  updateAccessToken: (accessToken: string, expiresAt: string) => Promise<void>
  setRememberUsername: (username: string) => Promise<void>
  clearRememberedUsername: () => Promise<void>

  // getter
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  tokens: null,
  profile: null,
  isHydrating: true,
  username: null,
  rememberUsername: false,

  hydrate: async () => {
    try {
      set({ isHydrating: true })

      // Get Token
      const tokens = await getSecureObject<Token>(STORAGE_KEYS.AUTH.TOKENS)
      if (tokens && tokens.accessToken && tokens.refreshToken && tokens.expiresAt) set({ tokens })

      // Get Profile
      const profile = await getAsyncObject<Profile>(STORAGE_KEYS.AUTH.PROFILE)
      if (profile && profile.user && profile.permissions) set({ profile })

      // Get Remembered Username
      const username = await getAsyncItem(STORAGE_KEYS.AUTH.USERNAME)
      const isRemembered = !!(await getAsyncItem(STORAGE_KEYS.AUTH.REMEMBER_USERNAME))
      if (username && isRemembered) {
        set({ username: username, rememberUsername: true })
      } else {
        set({ username: null, rememberUsername: false })
      }

      // await new Promise((r) => setTimeout(r, 5000))
    } catch (error: any) {
      set({
        isHydrating: false
      })
      console.error('Failed to hydrate auth store', error)
    } finally {
      set({ isHydrating: false })
    }
  },

  login: async ({ accessToken, refreshToken, expiresAt, user, permissions }: LoginResponse) => {
    const tokens: Token = {
      accessToken,
      refreshToken,
      expiresAt
    }
    const profile: Profile = { user, permissions }
    set({ tokens, profile })
    await setSecureObject(STORAGE_KEYS.AUTH.TOKENS, tokens)
    await setAsyncObject(STORAGE_KEYS.AUTH.PROFILE, profile)
  },

  logout: async () => {
    console.log('logout')
    set({ tokens: null, profile: null })
    // Remove tokens from SecureStore
    await removeSecureItem(STORAGE_KEYS.AUTH.TOKENS)

    // Remove profile from AsyncStorage
    await removeAsyncItem(STORAGE_KEYS.AUTH.PROFILE)
  },

  setRememberUsername: async (username: string) => {
    set({ username, rememberUsername: true })
    await setAsyncItem(STORAGE_KEYS.AUTH.USERNAME, username)
    await setAsyncItem(STORAGE_KEYS.AUTH.REMEMBER_USERNAME, 'true')
  },

  clearRememberedUsername: async () => {
    set({ username: null, rememberUsername: false })
    await removeAsyncItem(STORAGE_KEYS.AUTH.USERNAME)
    await removeAsyncItem(STORAGE_KEYS.AUTH.REMEMBER_USERNAME)
  },

  setUser: async (user: User) => {
    const currentProfile = get().profile
    if (!currentProfile) return

    const updatedProfile: Profile = {
      ...currentProfile,
      user
    }
    set({ profile: updatedProfile })
    await setAsyncObject(STORAGE_KEYS.AUTH.PROFILE, updatedProfile)
  },

  updateAccessToken: async (accessToken: string) => {
    const currentTokens = get().tokens
    if (!currentTokens) return

    const updatedTokens: Token = {
      ...currentTokens,
      accessToken
    }
    set({ tokens: updatedTokens })
    await setSecureObject(STORAGE_KEYS.AUTH.TOKENS, updatedTokens)
  },

  isAuthenticated: () => {
    const tokens = get().tokens
    return !!(tokens && tokens.accessToken && tokens.refreshToken)
  }
}))
