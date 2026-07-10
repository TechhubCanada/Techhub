"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const square_1 = require("../../../../modules/square");
const microservice_1 = __importDefault(require("../../../../modules/square/utils/microservice"));
const GET = async (req, res) => {
    try {
        const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
        // Get the global active configuration
        const config = await squareService.getActiveConfiguration();
        if (!config) {
            return res.status(500).json({
                error: "Square not configured",
                message: "No active Square configuration found",
            });
        }
        const locations = await microservice_1.default.get("/locations/", {
            headers: {
                "x-merchant-id": config.merchant_id,
                "x-integration-key": config.integration_key,
            },
        });
        // Get all locations for this configuration
        return res.json({
            locations: locations.data.locations,
            total: locations.data.locations.length,
            main_location_id: config.location_id || null,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "Failed to fetch locations",
            message: error.message,
        });
    }
};
exports.GET = GET;
const POST = async (req, res) => {
    try {
        const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
        // Get the global active configuration
        const config = await squareService.getActiveConfiguration();
        if (!config) {
            return res.status(500).json({
                error: "Square not configured",
                message: "No active Square configuration found",
            });
        }
        const body = req.body;
        await squareService.setActiveLocation(body.location_id, body.currency);
        return res.json({
            message: `Location ${body.location_id} seted as default location`,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "Failed to update main location",
            message: error.message,
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NxdWFyZS9sb2NhdGlvbnMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsdURBQTJEO0FBRTNELGlHQUE4RTtBQUV2RSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3JDLHNCQUFhLENBQ1MsQ0FBQztRQUV6QixzQ0FBc0M7UUFDdEMsTUFBTSxNQUFNLEdBQUcsTUFBTSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUU1RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDWixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixLQUFLLEVBQUUsdUJBQXVCO2dCQUM5QixPQUFPLEVBQUUsc0NBQXNDO2FBQ2hELENBQUMsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUU7WUFDM0QsT0FBTyxFQUFFO2dCQUNQLGVBQWUsRUFBRSxNQUFNLENBQUMsV0FBVztnQkFDbkMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLGVBQWU7YUFDNUM7U0FDRixDQUFDLENBQUM7UUFFSCwyQ0FBMkM7UUFFM0MsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ2QsU0FBUyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUztZQUNuQyxLQUFLLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTTtZQUN0QyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsV0FBVyxJQUFJLElBQUk7U0FDN0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLEtBQUssRUFBRSwyQkFBMkI7WUFDbEMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUM7QUFwQ1csUUFBQSxHQUFHLE9Bb0NkO0FBRUssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ3BFLElBQUksQ0FBQztRQUNILE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUNyQyxzQkFBYSxDQUNTLENBQUM7UUFFekIsc0NBQXNDO1FBQ3RDLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFNUQsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ1osT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsS0FBSyxFQUFFLHVCQUF1QjtnQkFDOUIsT0FBTyxFQUFFLHNDQUFzQzthQUNoRCxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQVcsQ0FBQztRQUM3QixNQUFNLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV2RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7WUFDZCxPQUFPLEVBQUUsWUFBWSxJQUFJLENBQUMsV0FBVyw0QkFBNEI7U0FDbEUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLEtBQUssRUFBRSxnQ0FBZ0M7WUFDdkMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDLENBQUM7QUE1QlcsUUFBQSxJQUFJLFFBNEJmIn0=