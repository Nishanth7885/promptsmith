import 'server-only';
import { eq } from 'drizzle-orm';
import { db, schema } from '@/db';

export type SettingKey =
  | 'price_inr'
  | 'price_inr_category'
  | 'price_usd'
  | 'product_name'
  | 'cross_border_enabled';

const DEFAULTS: Record<SettingKey, string> = {
  price_inr: '299',
  price_inr_category: '99',
  price_usd: '2.99',
  product_name: 'Prompt Smith — 4,900+ Expert AI Prompts',
  cross_border_enabled: 'false',
};

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, key))
    .limit(1);
  return row[0]?.value ?? DEFAULTS[key];
}

export async function setSetting(
  key: SettingKey,
  value: string,
  updatedBy: string | null,
): Promise<void> {
  await db
    .insert(schema.settings)
    .values({ key, value, updatedBy: updatedBy ?? undefined, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { value, updatedBy: updatedBy ?? undefined, updatedAt: new Date() },
    });
}

export interface PricingSnapshot {
  inr: number;
  usd: number;
  productName: string;
  crossBorderEnabled: boolean;
}

export async function getPricing(): Promise<PricingSnapshot> {
  const [inr, usd, productName, crossBorder] = await Promise.all([
    getSetting('price_inr'),
    getSetting('price_usd'),
    getSetting('product_name'),
    getSetting('cross_border_enabled'),
  ]);
  return {
    inr: Number(inr),
    usd: Number(usd),
    productName,
    crossBorderEnabled: crossBorder === 'true',
  };
}
