import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
const ordersRange = process.env.GOOGLE_SHEETS_ORDERS_RANGE || "Orders!A:L";

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets environment variables");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

export async function appendOrderToSheet(order: {
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
}) {
  const sheets = getSheetsClient();

  const values = [
    [
      Math.floor(Date.now() / 1000),
      order.userId,
      order.productId,
      order.productName,
      order.color || "unknown",
      order.quantity || 1,
      order.unitAmount || "",
      order.amountTotal,
      order.currency,
      order.paymentStatus,
      order.stripeSessionId,
      order.stripePaymentIntentId,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: ordersRange,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });

  return {
    success: true,
    order,
  };
}