export type OrderStatus = "pending_payment" | "paid";

export type Order = {
  id: string;
  productName: string;
  amount: number;
  status: OrderStatus;
};

export const orders = new Map<string, Order>();

export function createOrder() {
  const orderId = crypto.randomUUID();

  const order: Order = {
    id: orderId,
    productName: "Demo T-Shirt",
    amount: 1000,
    status: "pending_payment",
  };

  orders.set(orderId, order);

  return order;
}

export function markOrderPaid(orderId: string) {
  const order = orders.get(orderId);

  if (!order) {
    console.log("Order not found:", orderId);
    return;
  }

  order.status = "paid";
  orders.set(orderId, order);

  console.log("Order marked as paid:", order);
}
