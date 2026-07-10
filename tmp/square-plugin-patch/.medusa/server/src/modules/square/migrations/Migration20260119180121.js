"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260117003420 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20260117003420 extends migrations_1.Migration {
    async up() {
        this.addSql(`ALTER TABLE IF EXISTS "square_configuration"
      ADD COLUMN IF NOT EXISTS "integration_key" text NOT NULL DEFAULT '';`);
    }
    async down() {
        this.addSql(`ALTER TABLE IF EXISTS "square_configuration"
      DROP COLUMN IF EXISTS "integration_key";`);
    }
}
exports.Migration20260117003420 = Migration20260117003420;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjAxMTkxODAxMjEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zcXVhcmUvbWlncmF0aW9ucy9NaWdyYXRpb24yMDI2MDExOTE4MDEyMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBa0Q7QUFFbEQsTUFBYSx1QkFBd0IsU0FBUSxzQkFBUztJQUMzQyxLQUFLLENBQUMsRUFBRTtRQUNmLElBQUksQ0FBQyxNQUFNLENBQ1Q7MkVBQ3FFLENBQ3RFLENBQUM7SUFDSixDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FDVDsrQ0FDeUMsQ0FDMUMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWRELDBEQWNDIn0=