"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const uiPath = path.resolve(require.resolve("@medusajs/ui"), "../..", "\*_/_.{js,jsx,ts,tsx}");
module.exports = {
    presets: [require("@medusajs/ui-preset")],
    content: [
        // ...
        "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
        uiPath,
    ],
    // ...
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFpbHdpbmQuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGFpbHdpbmQuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBRTVCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ3pCLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQy9CLE9BQU8sRUFDUCx1QkFBdUIsQ0FDeEIsQ0FBQTtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN6QyxPQUFPLEVBQUU7UUFDUCxNQUFNO1FBQ04sdURBQXVEO1FBQ3ZELE1BQU07S0FDUDtJQUNELE1BQU07Q0FDUCxDQUFBIn0=