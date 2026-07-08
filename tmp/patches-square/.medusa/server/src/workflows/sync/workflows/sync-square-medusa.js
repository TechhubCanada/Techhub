"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSquareMedusaWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.syncSquareMedusaWorkflow = (0, workflows_sdk_1.createWorkflow)("sync-square-medusa-workflow", function () {
    (0, steps_1.syncSquareToMedusaStep)();
    return new workflows_sdk_1.WorkflowResponse("success");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1zcXVhcmUtbWVkdXNhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9zeW5jL3dvcmtmbG93cy9zeW5jLXNxdWFyZS1tZWR1c2EudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkRBQTJFO0FBQzNFLG9DQUFrRDtBQUVyQyxRQUFBLHdCQUF3QixHQUFHLElBQUEsOEJBQWMsRUFDcEQsNkJBQTZCLEVBQzdCO0lBQ0UsSUFBQSw4QkFBc0IsR0FBRSxDQUFDO0lBQ3pCLE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQ0YsQ0FBQyJ9