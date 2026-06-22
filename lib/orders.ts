import { appendOrderToSheet } from "./googlesheets";

export type CreateOrderInput = {
  userId: string;
  productId: string;
  productName: string;
  color?: string;
  quantity?: string | number;
  unitAmount?: string | number;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
};

export async function createOrder(input: CreateOrderInput) {
  return appendOrderToSheet(input);
}