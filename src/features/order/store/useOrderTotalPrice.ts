import { useOrderStore } from './order.store'

/**
 * Hook để tính tổng giá trị đơn hàng
 * Có thể subscribe để tự động cập nhật khi items thay đổi
 */
export const useOrderTotalPrice = (): number => {
  const items = useOrderStore((state) => state.items)
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}
