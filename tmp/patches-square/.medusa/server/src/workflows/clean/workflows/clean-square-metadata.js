"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMedusaSqaureWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/workflows-sdk");
const steps_1 = require("../steps");
exports.syncMedusaSqaureWorkflow = (0, workflows_sdk_1.createWorkflow)("clean-square-metadata-workflow", function () {
    (0, steps_1.cleanSquareStep)();
    return new workflows_sdk_1.WorkflowResponse("success");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4tc3F1YXJlLW1ldGFkYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9jbGVhbi93b3JrZmxvd3MvY2xlYW4tc3F1YXJlLW1ldGFkYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJEQUEyRTtBQUMzRSxvQ0FBMkM7QUFFOUIsUUFBQSx3QkFBd0IsR0FBRyxJQUFBLDhCQUFjLEVBQ3BELGdDQUFnQyxFQUNoQztJQUNFLElBQUEsdUJBQWUsR0FBRSxDQUFDO0lBRWxCLE9BQU8sSUFBSSxnQ0FBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QyxDQUFDLENBQ0YsQ0FBQyJ9