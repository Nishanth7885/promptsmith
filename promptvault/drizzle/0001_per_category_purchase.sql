-- Per-category purchase support.
-- Adds orderType + categorySlug to `orders`, plus a composite index for
-- the per-user access lookups in `hasCategoryAccess`.
ALTER TABLE `orders` ADD COLUMN `order_type` TEXT NOT NULL DEFAULT 'ALL';
--> statement-breakpoint
ALTER TABLE `orders` ADD COLUMN `category_slug` TEXT;
--> statement-breakpoint
CREATE INDEX `orders_by_access` ON `orders` (`user_id`, `status`, `order_type`, `category_slug`);
