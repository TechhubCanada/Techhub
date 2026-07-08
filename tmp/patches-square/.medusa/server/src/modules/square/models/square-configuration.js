"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareConfiguration = void 0;
const utils_1 = require("@medusajs/framework/utils");
exports.SquareConfiguration = utils_1.model.define("square_configuration", {
    id: utils_1.model.id().primaryKey(),
    merchant_id: utils_1.model.text().unique(),
    integration_key: utils_1.model.text().unique(),
    location_id: utils_1.model.text().unique(),
    currency: utils_1.model.text().nullable(),
    is_active: utils_1.model.boolean().default(true),
    is_sandbox: utils_1.model.boolean().default(false),
    apple_pay_domain: utils_1.model.text().nullable(),
    metadata: utils_1.model.json().nullable(),
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YXJlLWNvbmZpZ3VyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9zcXVhcmUvbW9kZWxzL3NxdWFyZS1jb25maWd1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUFrRDtBQUVyQyxRQUFBLG1CQUFtQixHQUFHLGFBQUssQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUU7SUFDdEUsRUFBRSxFQUFFLGFBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLEVBQUU7SUFDM0IsV0FBVyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDbEMsZUFBZSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDdEMsV0FBVyxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUU7SUFDbEMsUUFBUSxFQUFFLGFBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7SUFDakMsU0FBUyxFQUFFLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0lBQ3hDLFVBQVUsRUFBRSxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztJQUMxQyxnQkFBZ0IsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0lBQ3pDLFFBQVEsRUFBRSxhQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO0NBQ2xDLENBQUMsQ0FBQyJ9