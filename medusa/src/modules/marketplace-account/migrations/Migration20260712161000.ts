import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260712161000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table if not exists "marketplace_account" ("id" text not null, "name" text not null, "platform" text not null, "description" text null, "url" text not null, "cta_label" text not null, "sort_order" integer not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "marketplace_account_pkey" primary key ("id"));`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_marketplace_account_deleted_at" ON "marketplace_account" ("deleted_at") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_marketplace_account_active_sort" ON "marketplace_account" ("is_active", "sort_order") WHERE deleted_at IS NULL;`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_marketplace_account_platform" ON "marketplace_account" ("platform") WHERE deleted_at IS NULL;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "marketplace_account" cascade;`);
  }
}
