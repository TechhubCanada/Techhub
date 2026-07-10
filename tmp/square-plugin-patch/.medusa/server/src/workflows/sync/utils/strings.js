"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = slugify;
function slugify(text) {
    return text
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters except spaces and hyphens
        .trim() // remove leading/trailing spaces
        .replace(/\s+/g, "-") // replace spaces with single hyphen
        .replace(/-+/g, "-"); // collapse multiple hyphens into one
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3luYy91dGlscy9zdHJpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMEJBT0M7QUFQRCxTQUFnQixPQUFPLENBQUMsSUFBWTtJQUNsQyxPQUFPLElBQUk7U0FDUixXQUFXLEVBQUUsQ0FBQyx1QkFBdUI7U0FDckMsT0FBTyxDQUFDLGVBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxzREFBc0Q7U0FDbkYsSUFBSSxFQUFFLENBQUMsaUNBQWlDO1NBQ3hDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsb0NBQW9DO1NBQ3pELE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxxQ0FBcUM7QUFDL0QsQ0FBQyJ9