import type { DinnerTable } from '@/features/order/types/table.type'
import { create } from 'zustand'

export type OrderLine = {
  menuId: number
  menuName: string
  menuImage: string | null
  sizeId: number
  sizeName: string
  price: number
  quantity: number
  note?: string | null
}

const calculateTotalPrice = (items: OrderLine[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

type OrderState = {
  items: OrderLine[]
  totalPrice: number
  table: DinnerTable | null
  add: (orderLine: OrderLine) => void
  increment: (menuId: number, sizeId: number) => void
  decrement: (menuId: number, sizeId: number) => void
  setLineNote: (menuId: number, sizeId: number, note: string | null) => void
  setTable: (table: DinnerTable | null) => void
  clear: () => void
}

export const useOrderStore = create<OrderState>((set) => ({
  items: [],
  totalPrice: 0,
  table: null,

  add: (orderLine) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) => item.menuId === orderLine.menuId && item.sizeId === orderLine.sizeId
      )

      let nextItems: OrderLine[]

      if (existingIndex >= 0) {
        nextItems = [...state.items]
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + orderLine.quantity,
          note: orderLine.note ?? nextItems[existingIndex].note
        }
      } else {
        nextItems = [...state.items, orderLine]
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

  setLineNote: (menuId, sizeId, note) => {
    set((state) => {
      const idx = state.items.findIndex((item) => item.menuId === menuId && item.sizeId === sizeId)
      if (idx < 0) return state

      const nextItems = [...state.items]
      nextItems[idx] = { ...nextItems[idx], note }

      return {
        items: nextItems,
        totalPrice: calculateTotalPrice(nextItems)
      }
    })
  },

  setTable: (table) => set({ table }),

  clear: () => set({ items: [], totalPrice: 0, table: null })
}))
