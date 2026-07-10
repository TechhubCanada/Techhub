"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = void 0;
const config_1 = require("../../../../../modules/square/utils/config");
const microservice_1 = __importDefault(require("../../../../../modules/square/utils/microservice"));
const normalizeSquareOAuthUrl = (url, environment) => {
    const squareOAuthUrl = new URL(url);
    if (environment === "sandbox" && squareOAuthUrl.searchParams.get("session") === "false") {
        squareOAuthUrl.searchParams.delete("session");
    }
    return squareOAuthUrl.toString();
};
const GET = async (req, res) => {
    try {
        const isSandbox = req.query.is_sandbox === "true";
        const environment = isSandbox ? "sandbox" : "prod";
        const response = await microservice_1.default.get("/square-oauth/authorize", {
            params: {
                redirect_url: (0, config_1.getOAuthRedirectUrl)(),
                environment,
            },
        });
        return res.redirect(normalizeSquareOAuthUrl(response.data.url, environment));
    }
    catch (error) {
        return res.status(500).json({
            error: "Failed to start oauth process",
            message: error.message,
        });
    }
};
exports.GET = GET;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NxdWFyZS9vYXV0aC9zdGFydC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSx1RUFBaUY7QUFDakYsb0dBQWlGO0FBRTFFLE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNuRSxJQUFJLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUM7UUFDbEQsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsRUFBRTtZQUN0RSxNQUFNLEVBQUU7Z0JBQ04sWUFBWSxFQUFFLElBQUEsNEJBQW1CLEdBQUU7Z0JBQ25DLFdBQVc7YUFDWjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsK0JBQStCO1lBQ3RDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBbkJXLFFBQUEsR0FBRyxPQW1CZCJ9