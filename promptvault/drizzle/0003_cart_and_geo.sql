-- Cart support + geo tracking.
--
-- 1. orders.category_slugs: JSON array of category slugs covered by this order.
--    Used for multi-category cart purchases. For single-category (CATEGORY)
--    orders, also populated with a one-element array so the access check has
--    one place to look. ALL-access orders leave it NULL.
--
-- 2. page_views.city: best-effort city from geoip-lite, populated server-side
--    in /api/track. Country was already there but unpopulated on a bare-VM
--    deployment without Cloudflare; geoip-lite gives us both offline.
ALTER TABLE `orders` ADD COLUMN `category_slugs` TEXT;
--> statement-breakpoint
ALTER TABLE `page_views` ADD COLUMN `city` TEXT;
--> statement-breakpoint
CREATE INDEX `page_views_by_country` ON `page_views` (`country`);
