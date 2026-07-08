"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260117003420 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260117003420 extends migrations_1.Migration {
    async up() {
        this.addSql(`ALTER TABLE IF EXISTS "square_configuration"
      ADD COLUMN IF NOT EXISTS "currency" text NULL DEFAULT NULL;`);
    }
    async down() {
        this.addSql(`ALTER TABLE IF EXISTS "square_configuration"
      DROP COLUMN IF EXISTS "currency";`);
    }
}
exports.Migration20260117003420 = Migration20260117003420;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjAyMDQxODAxMjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zcXVhcmUvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDIwNDE4MDEyMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUMzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQ1Q7a0VBQzRELENBQzdELENBQUM7SUFDSixDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FDVDt3Q0FDa0MsQ0FDbkMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWRELDBEQWNDIn0=