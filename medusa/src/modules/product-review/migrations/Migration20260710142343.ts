import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260710142343 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_review" ("id" text not null, "product_id" text not null, "customer_id" text null, "order_id" text null, "rating" integer not null, "title" text null, "content" text not null, "customer_name" text null, "customer_email" text null, "verified_purchase" boolean not null default false, "status" text check ("status" in ('pending', 'approved', 'rejected')) not null default 'pending', "moderation_note" text null, "moderated_by" text null, "moderated_at" timestamptz null, "published_at" timestamptz null, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_review_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_deleted_at" ON "product_review" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_product_status" ON "product_review" ("product_id", "status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_customer" ON "product_review" ("customer_id") WHERE customer_id IS NOT NULL AND deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_review_status" ON "product_review" ("status") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_review" cascade;`);
  }

}
