"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const microserviceAxios = axios_1.default.create({
    baseURL: (0, config_1.getSquareMicroserviceUrl)(),
});
exports.default = microserviceAxios;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3F1YXJlL3V0aWxzL21pY3Jvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixxQ0FBb0Q7QUFFcEQsTUFBTSxpQkFBaUIsR0FBRyxlQUFLLENBQUMsTUFBTSxDQUFDO0lBQ3JDLE9BQU8sRUFBRSxJQUFBLGlDQUF3QixHQUFFO0NBQ3BDLENBQUMsQ0FBQztBQUVILGtCQUFlLGlCQUFpQixDQUFDIn0=