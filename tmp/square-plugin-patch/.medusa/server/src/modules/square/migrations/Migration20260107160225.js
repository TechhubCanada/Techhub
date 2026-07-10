"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260107160225 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260107160225 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "square_configuration" drop constraint if exists "square_configuration_location_id_unique";`);
        this.addSql(`alter table if exists "square_configuration" drop constraint if exists "square_configuration_merchant_id_unique";`);
        this.addSql(`create table if not exists "square_configuration" ("id" text not null, "merchant_id" text not null, "location_id" text not null, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "square_configuration_pkey" primary key ("id"));`);
        this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_square_configuration_merchant_id_unique" ON "square_configuration" (merchant_id) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_square_configuration_location_id_unique" ON "square_configuration" (location_id) WHERE deleted_at IS NULL;`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_square_configuration_deleted_at" ON "square_configuration" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "square_configuration" cascade;`);
    }
}
exports.Migration20260107160225 = Migration20260107160225;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjAxMDcxNjAyMjUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zcXVhcmUvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDEwNzE2MDIyNS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUUzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsbUhBQW1ILENBQUMsQ0FBQztRQUNqSSxJQUFJLENBQUMsTUFBTSxDQUFDLG1IQUFtSCxDQUFDLENBQUM7UUFDakksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpWUFBaVksQ0FBQyxDQUFDO1FBQy9ZLElBQUksQ0FBQyxNQUFNLENBQUMsbUpBQW1KLENBQUMsQ0FBQztRQUNqSyxJQUFJLENBQUMsTUFBTSxDQUFDLG1KQUFtSixDQUFDLENBQUM7UUFDakssSUFBSSxDQUFDLE1BQU0sQ0FBQyxtSUFBbUksQ0FBQyxDQUFDO0lBQ25KLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLHNEQUFzRCxDQUFDLENBQUM7SUFDdEUsQ0FBQztDQUVGO0FBZkQsMERBZUMifQ==