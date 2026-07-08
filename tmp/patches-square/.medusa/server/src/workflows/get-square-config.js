"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSquareConfigWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const square_1 = require("../modules/square");
/**
 * Step to get active Square configuration from the module service
 */
const getSquareConfigStep = (0, workflows_sdk_1.createStep)("get-square-config", async (input, { container }) => {
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    return new workflows_sdk_1.StepResponse(config);
});
/**
 * Workflow that exposes getting active Square configuration
 * This can be called from payment providers and other services
 */
exports.getSquareConfigWorkflow = (0, workflows_sdk_1.createWorkflow)("get-square-config", () => {
    const config = getSquareConfigStep();
    return new workflows_sdk_1.WorkflowResponse(config);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LXNxdWFyZS1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL2dldC1zcXVhcmUtY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUsyQztBQUMzQyw4Q0FBa0Q7QUFFbEQ7O0dBRUc7QUFDSCxNQUFNLG1CQUFtQixHQUFHLElBQUEsMEJBQVUsRUFDcEMsbUJBQW1CLEVBQ25CLEtBQUssRUFBRSxLQUFXLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ25DLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsc0JBQWEsQ0FBUSxDQUFDO0lBQzlELE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDNUQsT0FBTyxJQUFJLDRCQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUNGLENBQUM7QUFFRjs7O0dBR0c7QUFDVSxRQUFBLHVCQUF1QixHQUFHLElBQUEsOEJBQWMsRUFDbkQsbUJBQW1CLEVBQ25CLEdBQUcsRUFBRTtJQUNILE1BQU0sTUFBTSxHQUFHLG1CQUFtQixFQUFFLENBQUM7SUFDckMsT0FBTyxJQUFJLGdDQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FDRixDQUFDIn0=