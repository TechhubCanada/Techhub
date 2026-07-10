"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOAuthRedirectUrl = exports.getMedusaBackendUrl = exports.getSquareMicroserviceUrl = void 0;
/**
 * CRITICAL: Square Microservice URL - HARDCODED FOR SECURITY
 *
 * This URL points to the Square payment microservice and is intentionally
 * hardcoded to prevent clients from accidentally or maliciously changing it.
 *
 * ⚠️ WARNING: Do NOT make this configurable via environment variables.
 * Any changes to this URL should be:
 * 1. Reviewed by the security team
 * 2. Tested thoroughly in staging
 * 3. Deployed via code release (not configuration)
 *
 * If you need to update this URL:
 * - Modify this constant directly in code
 * - Submit a pull request with proper review
 * - Deploy through normal release channels
 *
 * @constant {string} SQUARE_MICROSERVICE_URL - The immutable Square microservice endpoint
 */
const SQUARE_MICROSERVICE_URL = "https://prod-medusa-square-plugin-249319284730.us-central1.run.app";
//const SQUARE_MICROSERVICE_URL = "http://localhost:5000" as const;
/**
 * Get the Square microservice base URL
 *
 * NOTE: This function returns a hardcoded constant and does NOT read from
 * environment variables. This is intentional for security reasons.
 *
 * @returns {string} The hardcoded Square microservice URL
 */
const getSquareMicroserviceUrl = () => {
    return SQUARE_MICROSERVICE_URL;
};
exports.getSquareMicroserviceUrl = getSquareMicroserviceUrl;
/**
 * Get the Medusa backend base URL from environment variables
 */
const getMedusaBackendUrl = () => {
    return process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
};
exports.getMedusaBackendUrl = getMedusaBackendUrl;
/**
 * Construct the OAuth redirect URL
 */
const getOAuthRedirectUrl = () => {
    const backendUrl = (0, exports.getMedusaBackendUrl)();
    const baseUrl = backendUrl.replace(/\/$/, ""); // Remove trailing slash
    return `${baseUrl}/admin/square/oauth`;
};
exports.getOAuthRedirectUrl = getOAuthRedirectUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvc3F1YXJlL3V0aWxzL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsTUFBTSx1QkFBdUIsR0FDM0Isb0VBQTZFLENBQUM7QUFDaEYsbUVBQW1FO0FBQ25FOzs7Ozs7O0dBT0c7QUFDSSxNQUFNLHdCQUF3QixHQUFHLEdBQVcsRUFBRTtJQUNuRCxPQUFPLHVCQUF1QixDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUZXLFFBQUEsd0JBQXdCLDRCQUVuQztBQUVGOztHQUVHO0FBQ0ksTUFBTSxtQkFBbUIsR0FBRyxHQUFXLEVBQUU7SUFDOUMsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixJQUFJLHVCQUF1QixDQUFDO0FBQ25FLENBQUMsQ0FBQztBQUZXLFFBQUEsbUJBQW1CLHVCQUU5QjtBQUVGOztHQUVHO0FBQ0ksTUFBTSxtQkFBbUIsR0FBRyxHQUFXLEVBQUU7SUFDOUMsTUFBTSxVQUFVLEdBQUcsSUFBQSwyQkFBbUIsR0FBRSxDQUFDO0lBQ3pDLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0JBQXdCO0lBQ3ZFLE9BQU8sR0FBRyxPQUFPLHFCQUFxQixDQUFDO0FBQ3pDLENBQUMsQ0FBQztBQUpXLFFBQUEsbUJBQW1CLHVCQUk5QiJ9