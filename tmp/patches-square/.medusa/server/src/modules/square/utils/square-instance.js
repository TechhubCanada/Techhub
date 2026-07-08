"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.squareLocationId = void 0;
exports.getSquareClient = getSquareClient;
exports.getAccessToken = getAccessToken;
const square_1 = require("square");
const microservice_1 = __importDefault(require("./microservice"));
function getSquareClient(token, isSandbox) {
    return new square_1.SquareClient({
        token,
        environment: isSandbox
            ? square_1.SquareEnvironment.Sandbox
            : square_1.SquareEnvironment.Production,
    });
}
async function getAccessToken(merchant_id, integration_key) {
    const { data: { access_token }, } = await microservice_1.default.get("/square-oauth/retrieve-token", {
        headers: {
            "x-merchant-id": merchant_id,
            "x-integration-key": integration_key,
        },
    });
    return access_token;
}
exports.squareLocationId = process.env.SQUARE_LOCATION_ID ?? "";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1YXJlLWluc3RhbmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3F1YXJlL3V0aWxzL3NxdWFyZS1pbnN0YW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQSwwQ0FVQztBQUVELHdDQWFDO0FBNUJELG1DQUF5RDtBQUN6RCxrRUFBK0M7QUFFL0MsU0FBZ0IsZUFBZSxDQUM3QixLQUFhLEVBQ2IsU0FBa0I7SUFFbEIsT0FBTyxJQUFJLHFCQUFZLENBQUM7UUFDdEIsS0FBSztRQUNMLFdBQVcsRUFBRSxTQUFTO1lBQ3BCLENBQUMsQ0FBQywwQkFBaUIsQ0FBQyxPQUFPO1lBQzNCLENBQUMsQ0FBQywwQkFBaUIsQ0FBQyxVQUFVO0tBQ2pDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxLQUFLLFVBQVUsY0FBYyxDQUNsQyxXQUFtQixFQUNuQixlQUF1QjtJQUV2QixNQUFNLEVBQ0osSUFBSSxFQUFFLEVBQUUsWUFBWSxFQUFFLEdBQ3ZCLEdBQUcsTUFBTSxzQkFBaUIsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUU7UUFDOUQsT0FBTyxFQUFFO1lBQ1AsZUFBZSxFQUFFLFdBQVc7WUFDNUIsbUJBQW1CLEVBQUUsZUFBZTtTQUNyQztLQUNGLENBQUMsQ0FBQztJQUNILE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFFWSxRQUFBLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLElBQUksRUFBRSxDQUFDIn0=