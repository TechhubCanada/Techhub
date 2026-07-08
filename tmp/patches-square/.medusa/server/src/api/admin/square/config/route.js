"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const square_1 = require("../../../../modules/square");
const GET = async (req, res) => {
    try {
        const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
        const config = await squareService.getActiveConfiguration();
        const { integration_key, ...params } = config;
        const maskedIntegrationKey = integration_key
            ? `${integration_key.slice(0, 5)}-***`
            : null;
        return res.json({
            ...params,
            integration_key: maskedIntegrationKey,
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
const POST = async (req, res) => {
    try {
        const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
        const config = await squareService.getActiveConfiguration();
        if (!config) {
            return res.status(500).json({
                error: "Square not configured",
                message: "No active Square configuration found",
            });
        }
        const body = req.body;
        await squareService.setMetadata(body);
        return res.status(200).json({
            message: `Square metadata has been updated`,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "Failed to update metadata",
            message: error.message,
        });
    }
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NxdWFyZS9jb25maWcvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdURBQTJEO0FBR3BELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxJQUFJLENBQUM7UUFDSCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDckMsc0JBQWEsQ0FDUyxDQUFDO1FBRXpCLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDNUQsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUU5QyxNQUFNLG9CQUFvQixHQUFHLGVBQWU7WUFDMUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU07WUFDdEMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUVULE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQztZQUNkLEdBQUcsTUFBTTtZQUNULGVBQWUsRUFBRSxvQkFBb0I7U0FDdEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssc0NBQXNDLEVBQUUsQ0FBQztZQUM3RCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVELE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLDZCQUE2QjtZQUNwQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUMsQ0FBQztBQTNCVyxRQUFBLEdBQUcsT0EyQmQ7QUFFSyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFtQixFQUFFLEVBQUU7SUFDcEUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQ3JDLHNCQUFhLENBQ1MsQ0FBQztRQUV6QixNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzVELElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNaLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQzFCLEtBQUssRUFBRSx1QkFBdUI7Z0JBQzlCLE9BQU8sRUFBRSxzQ0FBc0M7YUFDaEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFXLENBQUM7UUFDN0IsTUFBTSxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsT0FBTyxFQUFFLGtDQUFrQztTQUM1QyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLDJCQUEyQjtZQUNsQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUMsQ0FBQztBQTFCVyxRQUFBLElBQUksUUEwQmYifQ==