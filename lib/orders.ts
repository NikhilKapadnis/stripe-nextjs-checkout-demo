import { appendOrderToSheet } from "./googlesheets";

export type CreateOrderInput = {
  userId: string;
  productId: string;
  productName: string;
  amountTotal: number;
  currency: string;
  paymentStatus: string;
  stripeSessionId: string;
  stripePaymentIntentId: string;
};

export async function createOrder(input: CreateOrderInput) {
  return appendOrderToSheet(input);
}