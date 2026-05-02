import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  index,
} from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';

// ---------- Auth.js core tables ----------
//
// These match the @auth/drizzle-adapter SQLite shape exactly. Don't rename
// columns or types without also updating the adapter; Auth.js queries them
// by name.

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
  // ---- Prompt Smith additions ----
  passwordHash: text('password_hash'),
  phone: text('phone'),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  disabled: integer('disabled', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const accounts = sqliteTable(
  'accounts',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = sqliteTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationTokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// Password-reset + email-verification tokens (separate from Auth.js's own
// verificationTokens so we control issuance + single-use semantics).
export const authTokens = sqliteTable(
  'auth_tokens',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    purpose: text('purpose', { enum: ['email_verify', 'password_reset'] }).notNull(),
    tokenHash: text('token_hash').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    usedAt: integer('used_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byHash: index('auth_tokens_by_hash').on(t.tokenHash),
    byUser: index('auth_tokens_by_user').on(t.userId),
  }),
);

// ---------- Commerce tables ----------

export const orders = sqliteTable(
  'orders',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    cashfreeOrderId: text('cashfree_order_id').unique(),
    customerEmail: text('customer_email').notNull(),
    customerPhone: text('customer_phone'),
    customerName: text('customer_name'),
    currency: text('currency', { enum: ['INR', 'USD'] }).notNull(),
    amountSubtotal: real('amount_subtotal').notNull(),
    amountDiscount: real('amount_discount').notNull().default(0),
    amountTotal: real('amount_total').notNull(),
    couponCode: text('coupon_code'),
    couponId: text('coupon_id').references(() => coupons.id, { onDelete: 'set null' }),
    status: text('status', {
      enum: ['CREATED', 'ACTIVE', 'PAID', 'EXPIRED', 'TERMINATED', 'FAILED', 'REFUNDED'],
    })
      .notNull()
      .default('CREATED'),
    paymentMode: text('payment_mode'),
    paymentSessionId: text('payment_session_id'),
    paidAt: integer('paid_at', { mode: 'timestamp_ms' }),
    // 'ALL' = full all-access lifetime bundle (₹299).
    // 'CATEGORY' = single-category lifetime unlock (₹99) — categorySlug is required.
    orderType: text('order_type', { enum: ['ALL', 'CATEGORY'] }).notNull().default('ALL'),
    categorySlug: text('category_slug'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byUser: index('orders_by_user').on(t.userId),
    byStatus: index('orders_by_status').on(t.status),
    byCreated: index('orders_by_created').on(t.createdAt),
    byAccess: index('orders_by_access').on(t.userId, t.status, t.orderType, t.categorySlug),
  }),
);

export const orderEvents = sqliteTable(
  'order_events',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    source: text('source', { enum: ['create', 'verify', 'webhook', 'admin'] }).notNull(),
    status: text('status').notNull(),
    rawJson: text('raw_json'),
    note: text('note'),
    recordedAt: integer('recorded_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byOrder: index('order_events_by_order').on(t.orderId),
  }),
);

export const coupons = sqliteTable(
  'coupons',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    code: text('code').notNull().unique(),
    type: text('type', { enum: ['percent', 'flat'] }).notNull(),
    // For percent: 1-100. For flat: amount in `currency` minor units? No —
    // we keep currency-native units (e.g. 100 = ₹100 or $1.00 isn't right).
    // Decided: store flat amounts in major units (₹100 = 100, $3 = 3.00).
    value: real('value').notNull(),
    // NULL = applies to any currency (only valid for percent type).
    currency: text('currency', { enum: ['INR', 'USD'] }),
    maxUses: integer('max_uses'),
    usedCount: integer('used_count').notNull().default(0),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
    active: integer('active', { mode: 'boolean' }).notNull().default(true),
    note: text('note'),
    createdBy: text('created_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byCode: index('coupons_by_code').on(t.code),
    byActive: index('coupons_by_active').on(t.active),
  }),
);

export const couponRedemptions = sqliteTable(
  'coupon_redemptions',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    redeemedAt: integer('redeemed_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byCoupon: index('redemptions_by_coupon').on(t.couponId),
    byUser: index('redemptions_by_user').on(t.userId),
  }),
);

export const waitlist = sqliteTable(
  'waitlist',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: text('email').notNull().unique(),
    country: text('country'),
    currency: text('currency'),
    source: text('source'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
);

// ---------- Settings (key/value, admin-editable) ----------

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedBy: text('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
});

// ---------- Audit log ----------

export const auditLog = sqliteTable(
  'audit_log',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    actorUserId: text('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    target: text('target'),
    metaJson: text('meta_json'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byCreated: index('audit_by_created').on(t.createdAt),
  }),
);

// ---------- Page-view log (for traffic dashboard) ----------

export const pageViews = sqliteTable(
  'page_views',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    path: text('path').notNull(),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    sessionId: text('session_id'),
    ipHash: text('ip_hash'),
    country: text('country'),
    referer: text('referer'),
    userAgent: text('user_agent'),
    ts: integer('ts', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byTs: index('page_views_by_ts').on(t.ts),
    byPath: index('page_views_by_path').on(t.path),
    byUser: index('page_views_by_user').on(t.userId),
  }),
);

// ---------- Reviews ----------
//
// Per-prompt star ratings + optional comments. `promptId` is the JSON-sourced
// Prompt.id (prompts live in static JSON, not the DB), so it isn't a FK —
// just an indexed text column. `verifiedPurchaser` is captured at write time
// from the user's order history; it is NOT recomputed on read, so a later
// refund will not retroactively un-verify. Uniqueness of (userId, promptId)
// is enforced in the API layer via read-then-upsert, with a supporting index
// for the lookup.

export const reviews = sqliteTable(
  'reviews',
  {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    promptId: text('prompt_id').notNull(),       // matches Prompt.id from JSON, free-text not FK
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),         // 1-5
    comment: text('comment'),                    // optional, max 500 chars enforced at API
    verifiedPurchaser: integer('verified_purchaser', { mode: 'boolean' })
      .notNull()
      .default(false),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    byPrompt: index('reviews_by_prompt').on(t.promptId),
    byUser: index('reviews_by_user').on(t.userId),
    uniqByUserPrompt: index('reviews_uniq_user_prompt').on(t.userId, t.promptId), // soft unique via app logic
  }),
);

// ---------- Type exports ----------

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
