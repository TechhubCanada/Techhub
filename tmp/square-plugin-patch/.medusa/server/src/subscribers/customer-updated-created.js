"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = categoryUpatedCreatedHandler;
const utils_1 = require("@medusajs/framework/utils");
const square_1 = require("../modules/square");
const categoryFields = [
    "name",
    "handle",
    "metadata",
    "parent_category",
    "parent_category.metadata",
];
async function categoryUpatedCreatedHandler({ event: { data: { id }, }, container, }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    if (config?.metadata?.sync_customers &&
        config?.metadata?.sync_source !== "square") {
        logger.info(`Starting Customer Sync: ${id}`);
        const squareClient = await squareService.getSquareClientInstance();
        const { data: [customer], } = await query.graph({
            entity: "customer",
            filters: { id },
            fields: ["*"],
        });
        try {
            await squareService.createOrUpdateCustomer(customer, squareClient);
        }
        catch (e) {
            logger.error(e);
        }
    }
}
exports.config = {
    event: ["customer.created", "customer.updated"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItdXBkYXRlZC1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2N1c3RvbWVyLXVwZGF0ZWQtY3JlYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFhQSwrQ0ErQkM7QUEzQ0QscURBQStFO0FBRS9FLDhDQUFrRDtBQUVsRCxNQUFNLGNBQWMsR0FBRztJQUNyQixNQUFNO0lBQ04sUUFBUTtJQUNSLFVBQVU7SUFDVixpQkFBaUI7SUFDakIsMEJBQTBCO0NBQzNCLENBQUM7QUFFYSxLQUFLLFVBQVUsNEJBQTRCLENBQUMsRUFDekQsS0FBSyxFQUFFLEVBQ0wsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQ2IsRUFDRCxTQUFTLEdBR1Q7SUFDQSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBc0Isc0JBQWEsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDNUQsSUFDRSxNQUFNLEVBQUUsUUFBUSxFQUFFLGNBQWM7UUFDaEMsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEtBQUssUUFBUSxFQUMxQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM3QyxNQUFNLFlBQVksR0FBRyxNQUFNLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO1FBQ25FLE1BQU0sRUFDSixJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FDakIsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDcEIsTUFBTSxFQUFFLFVBQVU7WUFDbEIsT0FBTyxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ2YsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2QsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxhQUFhLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUM7Q0FDaEQsQ0FBQyJ9