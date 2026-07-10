"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectMimeType = detectMimeType;
function detectMimeType(url) {
    const lower = url.split("?")[0].toLowerCase();
    if (lower.endsWith(".png"))
        return "image/png";
    if (lower.endsWith(".gif"))
        return "image/gif";
    if (lower.endsWith(".webp"))
        return "image/webp";
    return "image/jpeg";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3NxdWFyZS91dGlscy9oZWxwZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBTUM7QUFORCxTQUFnQixjQUFjLENBQUMsR0FBVztJQUN4QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFBRSxPQUFPLFdBQVcsQ0FBQztJQUMvQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQUUsT0FBTyxXQUFXLENBQUM7SUFDL0MsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUFFLE9BQU8sWUFBWSxDQUFDO0lBQ2pELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUMifQ==