import { useOrderStore } from './order.store'

/**
 * Hook để lấy số lượng của một món với size cụ thể
 * Có thể subscribe để tự động cập nhật khi items thay đổi
 */
export const useOrderQuantity = (menuId: number, sizeId: number): number => {
  const items = useOrderStore((state) => state.items)
  return items.find((item) => item.menuId === menuId && item.sizeId === sizeId)?.quantity ?? 0
}
