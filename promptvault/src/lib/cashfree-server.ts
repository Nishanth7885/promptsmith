// SERVER-ONLY Cashfree client. Imports of this file from any 'use client'
// component will fail at build time, which is exactly what we want — the
// secret key never reaches the browser.
import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET = process.env.CASHFREE_SECRET_KEY;
const MODE = (process.env.CASHFREE_MODE ?? 'sandbox') as 'sandbox' | 'production';
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

const BASE_URL =
  MODE === 'production' ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com';

const API_VERSION = '2023-08-01';

function assertEnv() {
  if (!APP_ID || !SECRET) {
    throw new Error(
      'Cashfree env vars missing. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY.',
    );
  }
}

function authHeaders() {
  assertEnv();
  return {
    'x-client-id': APP_ID as string,
    'x-client-secret': SECRET as string,
    'x-api-version': API_VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

export interface CreateOrderInput {
  orderId: string;
  amount: number;
  currency: 'INR' | 'USD';
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  customerName?: string;
  productName: string;
}

export interface CashfreeOrder {
  orderId: string;
  paymentSessionId: string;
  paymentLink: string;
  amount: number;
  currency: string;
  status: string;
}

export async function createOrder(input: CreateOrderInput): Promise<CashfreeOrder> {
  const body = {
    order_id: input.orderId,
    order_amount: input.amount,
    order_currency: input.currency,
    customer_details: {
      customer_id: input.customerId,
      customer_name: input.customerName ?? 'Prompt Smith Customer',
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
    },
    order_meta: {
      return_url: `${APP_URL}/payment/return?order_id={order_id}`,
      notify_url: `${APP_URL}/api/cashfree/webhook`,
    },
    order_note: input.productName,
  };

  const res = await fetch(`${BASE_URL}/pg/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.error_description)) ?? `HTTP ${res.status}`;
    throw new Error(`Cashfree create-order failed: ${msg}`);
  }

  return {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    paymentLink: data.payment_link,
    amount: data.order_amount,
    currency: data.order_currency,
    status: data.order_status,
  };
}

export interface OrderStatus {
  orderId: string;
  status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED' | 'TERMINATION_REQUESTED' | string;
  amount: number;
  currency?: string;
  paymentTime?: string;
  paymentMode?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export async function fetchOrderStatus(orderId: string): Promise<OrderStatus> {
  if (!/^[\w-]{6,80}$/.test(orderId)) throw new Error('Invalid order id');
  const res = await fetch(`${BASE_URL}/pg/orders/${encodeURIComponent(orderId)}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.error_description)) ?? `HTTP ${res.status}`;
    throw new Error(`Cashfree order-status failed: ${msg}`);
  }
  return {
    orderId: data.order_id,
    status: data.order_status,
    amount: data.order_amount,
    currency: data.order_currency,
    paymentTime: data.payment_time,
    paymentMode: data?.payment_method,
    customerEmail: data.customer_details?.customer_email,
    customerPhone: data.customer_details?.customer_phone,
  };
}

export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
): boolean {
  if (!SECRET) return false;
  if (!rawBody || !timestamp || !signature) return false;
  const computed = createHmac('sha256', SECRET).update(timestamp + rawBody).digest('base64');
  try {
    const a = Buffer.from(signature, 'utf8');
    const b = Buffer.from(computed, 'utf8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function hashEmail(email: string): string {
  let h = 5381;
  const e = email.toLowerCase().trim();
  for (let i = 0; i < e.length; i++) h = ((h << 5) + h + e.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).padStart(8, '0').slice(0, 12);
}

export function getMode(): 'sandbox' | 'production' {
  return MODE;
}
