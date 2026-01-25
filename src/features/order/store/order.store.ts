import type { MenuItem, MenuSize } from '@/features/order/types/menu.type'
import type { DinnerTable } from '@/features/order/types/table.type'
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
  table: DinnerTable | null
  add: (menu: MenuItem, size: MenuSize) => void
  increment: (menuId: number, sizeId: number) => void
  decrement: (menuId: number, sizeId: number) => void
  setTable: (table: DinnerTable | null) => void
  clear: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  totalPrice: 0,
  table: null,

  add: (menu, size) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.menuId === menu.menuId && item.sizeId === size.sizeId)
      let nextItems: OrderLine[]

      if (existingIndex >= 0) {
        nextItems = [...state.items]
        nextItems[existingIndex] = { ...nextItems[existingIndex], quantity: nextItems[existingIndex].quantity + 1 }
      } else {
        nextItems = [
          ...state.items,
          {
            menuId: menu.menuId,
            menuName: menu.menuName,
            sizeId: size.sizeId,
            sizeName: size.sizeName,
            price: size.price,
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

  setTable: (table) => set({ table }),

  clear: () => set({ items: [], totalPrice: 0, table: null })
}))
