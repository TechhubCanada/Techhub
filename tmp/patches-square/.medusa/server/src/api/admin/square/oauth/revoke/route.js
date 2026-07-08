"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE = void 0;
const square_1 = require("../../../../../modules/square");
const microservice_1 = __importDefault(require("../../../../../modules/square/utils/microservice"));
const DELETE = async (req, res) => {
    const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
    // Get the global active configuration
    const config = await squareService.getActiveConfiguration();
    if (!config) {
        return res.status(500).json({
            error: "Square not configured",
            message: "No active Square configuration found",
        });
    }
    try {
        await microservice_1.default.get("/square-oauth/revoke-token/", {
            headers: {
                "x-merchant-id": config.merchant_id,
                "x-integration-key": config.integration_key,
            },
        });
        await squareService.deleteActiveConfiguration();
        res.status(200).json({ message: "Token revoked successfully." });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to revoke token." });
    }
};
exports.DELETE = DELETE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NxdWFyZS9vYXV0aC9yZXZva2Uvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsMERBQThEO0FBRTlELG9HQUFpRjtBQUUxRSxNQUFNLE1BQU0sR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDdEUsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsc0JBQWEsQ0FBd0IsQ0FBQztJQUU5RSxzQ0FBc0M7SUFDdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUU1RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLEtBQUssRUFBRSx1QkFBdUI7WUFDOUIsT0FBTyxFQUFFLHNDQUFzQztTQUNoRCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsNkJBQTZCLEVBQUU7WUFDekQsT0FBTyxFQUFFO2dCQUNQLGVBQWUsRUFBRSxNQUFNLENBQUMsV0FBVztnQkFDbkMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLGVBQWU7YUFDNUM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBRWhELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDZCQUE2QixFQUFFLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQztJQUM3RCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBM0JXLFFBQUEsTUFBTSxVQTJCakIifQ==