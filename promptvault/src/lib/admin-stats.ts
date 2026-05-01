import 'server-only';
import { sql } from 'drizzle-orm';
import { db, schema } from '@/db';

export interface DashboardStats {
  ordersToday: number;
  ordersThisWeek: number;
  ordersThisMonth: number;
  revenueINRThisMonth: number;
  revenueUSDThisMonth: number;
  signupsToday: number;
  signupsThisWeek: number;
  pageViewsToday: number;
  waitlistCount: number;
}

const DAY = 24 * 60 * 60 * 1000;

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = Date.now();
  const startToday = startOfDayMs(now);
  const startWeek = now - 7 * DAY;
  const startMonth = now - 30 * DAY;

  const ordersTodayRow = await db
    .select({ c: sql<number>`count(*)` })
    .from(schema.orders)
    .where(sql`${schema.orders.status} = 'PAID' AND ${schema.orders.paidAt} >= ${startToday}`);

  const ordersWeekRow = await db
    .select({ c: sql<number>`count(*)` })
    .from(schema.orders)
    .where(sql`${schema.orders.status} = 'PAID' AND ${schema.orders.paidAt} >= ${startWeek}`);

  const ordersMonthRow = await db
    .select({ c: sql<number>`count(*)` })
    .from(schema.orders)
    .where(sql`${schema.orders.status} = 'PAID' AND ${schema.orders.paidAt} >= ${startMonth}`);

  const revenueRow = await db
    .select({
      currency: schema.orders.currency,
      total: sql<number>`coalesce(sum(${schema.orders.amountTotal}), 0)`,
    })
    .from(schema.orders)
    .where(sql`${schema.orders.status} = 'PAID' AND ${schema.orders.paidAt} >= ${startMonth}`)
    .groupBy(schema.orders.currency);

  const signupsTodayRow = await db
    .select({ c: sql<number>`count(*)` })
    .from(schema.users)
    .where(sql`${schema.users.createdAt} >= ${startToday}`);
  const signupsWeekRow = await db
    .select({ c: sql<number>`count(*)` })
    .from(schema.users)
    .where(sql`${schema.users.createdAt} >= ${startWeek}`);

  const pageViewsTodayRow = await db
    .select({ c: sql<number>`count(*)` })
    .from(schema.pageViews)
    .where(sql`${schema.pageViews.ts} >= ${startToday}`);

  const waitlistRow = await db.select({ c: sql<number>`count(*)` }).from(schema.waitlist);

  let revINR = 0;
  let revUSD = 0;
  for (const r of revenueRow) {
    if (r.currency === 'INR') revINR = Number(r.total);
    if (r.currency === 'USD') revUSD = Number(r.total);
  }

  return {
    ordersToday: Number(ordersTodayRow[0]?.c ?? 0),
    ordersThisWeek: Number(ordersWeekRow[0]?.c ?? 0),
    ordersThisMonth: Number(ordersMonthRow[0]?.c ?? 0),
    revenueINRThisMonth: revINR,
    revenueUSDThisMonth: revUSD,
    signupsToday: Number(signupsTodayRow[0]?.c ?? 0),
    signupsThisWeek: Number(signupsWeekRow[0]?.c ?? 0),
    pageViewsToday: Number(pageViewsTodayRow[0]?.c ?? 0),
    waitlistCount: Number(waitlistRow[0]?.c ?? 0),
  };
}

export interface DailySeriesPoint {
  date: string;
  views: number;
  signups: number;
  paidOrders: number;
}

export async function getDailySeries(days = 14): Promise<DailySeriesPoint[]> {
  const start = startOfDayMs(Date.now()) - (days - 1) * DAY;
  const out: DailySeriesPoint[] = [];
  for (let i = 0; i < days; i++) {
    const dayStart = start + i * DAY;
    const dayEnd = dayStart + DAY;
    const v = await db
      .select({ c: sql<number>`count(*)` })
      .from(schema.pageViews)
      .where(sql`${schema.pageViews.ts} >= ${dayStart} AND ${schema.pageViews.ts} < ${dayEnd}`);
    const s = await db
      .select({ c: sql<number>`count(*)` })
      .from(schema.users)
      .where(sql`${schema.users.createdAt} >= ${dayStart} AND ${schema.users.createdAt} < ${dayEnd}`);
    const o = await db
      .select({ c: sql<number>`count(*)` })
      .from(schema.orders)
      .where(
        sql`${schema.orders.status} = 'PAID' AND ${schema.orders.paidAt} >= ${dayStart} AND ${schema.orders.paidAt} < ${dayEnd}`,
      );
    out.push({
      date: new Date(dayStart).toISOString().slice(0, 10),
      views: Number(v[0]?.c ?? 0),
      signups: Number(s[0]?.c ?? 0),
      paidOrders: Number(o[0]?.c ?? 0),
    });
  }
  return out;
}

export async function getTopPaths(days = 7, limit = 10) {
  const start = startOfDayMs(Date.now()) - (days - 1) * DAY;
  const rows = await db
    .select({
      path: schema.pageViews.path,
      views: sql<number>`count(*)`,
    })
    .from(schema.pageViews)
    .where(sql`${schema.pageViews.ts} >= ${start}`)
    .groupBy(schema.pageViews.path)
    .orderBy(sql`count(*) desc`)
    .limit(limit);
  return rows.map((r) => ({ path: r.path, views: Number(r.views) }));
}

function startOfDayMs(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
