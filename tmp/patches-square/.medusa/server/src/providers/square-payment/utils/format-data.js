"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatData = FormatData;
function FormatData(obj) {
    return JSON.parse(JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? v.toString() : v)));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvcHJvdmlkZXJzL3NxdWFyZS1wYXltZW50L3V0aWxzL2Zvcm1hdC1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0NBSUM7QUFKRCxTQUFnQixVQUFVLENBQUMsR0FBUTtJQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUMxRSxDQUFBO0FBQ0gsQ0FBQyJ9