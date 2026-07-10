"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260117003420 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260117003420 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table if exists "square_configuration" add column if not exists "is_sandbox" boolean not null default false, add column if not exists "apple_pay_domain" text null;`);
    }
    async down() {
        this.addSql(`alter table if exists "square_configuration" drop column if exists "is_sandbox", drop column if exists "apple_pay_domain";`);
    }
}
exports.Migration20260117003420 = Migration20260117003420;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjAxMTcwMDM0MjAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zcXVhcmUvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDExNzAwMzQyMC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUMzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQ1QsMktBQTJLLENBQzVLLENBQUM7SUFDSixDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FDVCw0SEFBNEgsQ0FDN0gsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQVpELDBEQVlDIn0=