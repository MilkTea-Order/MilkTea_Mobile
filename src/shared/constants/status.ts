export const STATUS = {
  ORDER: {
    PENDING: "pending",
    PREPARING: "preparing",
    READY: "ready",
    COMPLETED: "completed",
  } as const,
} as const;

export type OrderStatus = (typeof STATUS.ORDER)[keyof typeof STATUS.ORDER];
