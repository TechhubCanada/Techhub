"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const square_1 = require("../../../../modules/square");
const GET = async (req, res) => {
    try {
        const merchantId = req.query.merchant_id;
        const integrationKey = req.query.integration_key;
        const env = req.query.env;
        if (!merchantId || !integrationKey) {
            return res.status(422).json({
                error: "merchant_id or integration_key not in payload",
            });
        }
        const isSandbox = env === "sandbox";
        const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
        await squareService.setActiveConfiguration(String(merchantId), String(integrationKey), isSandbox);
        return res.redirect("/app/square?status=ok");
    }
    catch (error) {
        return res.status(404).json({
            error: "Failed to update configuration",
            message: error.message,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NxdWFyZS9vYXV0aC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSx1REFBMkQ7QUFHcEQsTUFBTSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ25FLElBQUksQ0FBQztRQUNILE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3pDLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDO1FBQ2pELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBeUIsQ0FBQztRQUVoRCxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDbkMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDMUIsS0FBSyxFQUFFLCtDQUErQzthQUN2RCxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxLQUFLLFNBQVMsQ0FBQztRQUVwQyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FDckMsc0JBQWEsQ0FDUyxDQUFDO1FBRXpCLE1BQU0sYUFBYSxDQUFDLHNCQUFzQixDQUN4QyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQ2xCLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFDdEIsU0FBUyxDQUNWLENBQUM7UUFFRixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLGdDQUFnQztZQUN2QyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDdkIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUMsQ0FBQztBQS9CVyxRQUFBLEdBQUcsT0ErQmQifQ==