"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const square_1 = require("../../../../modules/square");
const microservice_1 = __importDefault(require("../../../../modules/square/utils/microservice"));
const GET = async (req, res) => {
    try {
        const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
        const config = await squareService.getActiveConfiguration();
        const location = await microservice_1.default.get(`/locations/${config.location_id}`, {
            headers: {
                "x-merchant-id": config.merchant_id,
                "x-integration-key": config.integration_key,
            },
        });
        const msAppId = await microservice_1.default.get("/square-oauth/application-id", {
            headers: {
                "x-merchant-id": config.merchant_id,
                "x-integration-key": config.integration_key,
            },
        });
        return res.json({
            //id: config.id,
            location_id: config.location_id,
            application_id: msAppId.data.applicationId,
            currency: location.data.location.currency,
            capabilities: location.data.location.capabilities,
        });
    }
    catch (error) {
        if (error.message === "No active Square configuration found") {
            return res.json(null);
        }
        return res.status(404).json({
            error: "Failed to get configuration",
            message: error.message,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL3NxdWFyZS9jb25maWcvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsdURBQTJEO0FBRTNELGlHQUE4RTtBQUV2RSxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDbkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3JDLHNCQUFhLENBQ1MsQ0FBQztRQUV6QixNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBRTVELE1BQU0sUUFBUSxHQUFHLE1BQU0sc0JBQWlCLENBQUMsR0FBRyxDQUMxQyxjQUFjLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFDbEM7WUFDRSxPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLE1BQU0sQ0FBQyxXQUFXO2dCQUNuQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsZUFBZTthQUM1QztTQUNGLENBQ0YsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHLE1BQU0sc0JBQWlCLENBQUMsR0FBRyxDQUN6Qyw4QkFBOEIsRUFDOUI7WUFDRSxPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLE1BQU0sQ0FBQyxXQUFXO2dCQUNuQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsZUFBZTthQUM1QztTQUNGLENBQ0YsQ0FBQztRQUVGLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLGdCQUFnQjtZQUNoQixXQUFXLEVBQUUsTUFBTSxDQUFDLFdBQVc7WUFDL0IsY0FBYyxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUMxQyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUTtZQUN6QyxZQUFZLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWTtTQUNsRCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLElBQUksS0FBSyxDQUFDLE9BQU8sS0FBSyxzQ0FBc0MsRUFBRSxDQUFDO1lBQzdELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixDQUFDO1FBRUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsNkJBQTZCO1lBQ3BDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBN0NXLFFBQUEsR0FBRyxPQTZDZCJ9