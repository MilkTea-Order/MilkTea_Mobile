import type { MenuItem, MenuSize } from '@/features/order/menu/types/menu.type'
import { create } from 'zustand'

export type OrderLine = {
  menuId: number
  menuName: string
  sizeId: number
  sizeName: string
  price: number
  quantity: number
}

const calculateTotalPrice = (items: OrderLine[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

type OrderState = {
  items: OrderLine[]
  totalPrice: number
  add: (menu: MenuItem, size: MenuSize) => void
  increment: (menuId: number, sizeId: number) => void
  decrement: (menuId: number, sizeId: number) => void
  clear: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  totalPrice: 0,

  add: (menu, size) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.menuId === menu.MenuID && item.sizeId === size.SizeID)
      let nextItems: OrderLine[]

      if (existingIndex >= 0) {
        nextItems = [...state.items]
        nextItems[existingIndex] = { ...nextItems[existingIndex], quantity: nextItems[existingIndex].quantity + 1 }
      } else {
        nextItems = [
          ...state.items,
          {
            menuId: menu.MenuID,
            menuName: menu.MenuName,
            sizeId: size.SizeID,
            sizeName: size.SizeName,
            price: size.Price,
            quantity: 1
          }
        ]
      }

      return {
        items: nextItems,
        totalPrice: calculateTotalPrice(nextItems)
      }
    })
  },

  increment: (menuId, sizeId) => {
    set((state) => {
      const idx = state.items.findIndex((item) => item.menuId === menuId && item.sizeId === sizeId)
      if (idx < 0) return state

      const nextItems = [...state.items]
      nextItems[idx] = { ...nextItems[idx], quantity: nextItems[idx].quantity + 1 }

      return {
        items: nextItems,
        totalPrice: calculateTotalPrice(nextItems)
      }
    })
  },

  decrement: (menuId, sizeId) => {
    set((state) => {
      const nextItems = state.items
        .map((item) =>
          item.menuId === menuId && item.sizeId === sizeId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)

      return {
        items: nextItems,
        totalPrice: calculateTotalPrice(nextItems)
      }
    })
  },

  clear: () => set({ items: [], totalPrice: 0 })
}))
