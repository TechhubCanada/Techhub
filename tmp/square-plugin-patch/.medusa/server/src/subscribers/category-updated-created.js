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
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productService = container.resolve(utils_1.Modules.PRODUCT);
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    if (config?.metadata?.sync_catalog &&
        config?.metadata?.sync_source !== "square") {
        logger.info(`Starting Category Sync: ${id}`);
        const squareClient = await squareService.getSquareClientInstance();
        const category = await productService.retrieveProductCategory(id, {
            select: categoryFields,
        });
        try {
            await squareService.createOrUpdateCategory(category, squareClient, productService);
        }
        catch (e) {
            logger.error(e);
        }
    }
}
exports.config = {
    event: ["product-category.created", "product-category.updated"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnktdXBkYXRlZC1jcmVhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL2NhdGVnb3J5LXVwZGF0ZWQtY3JlYXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFhQSwrQ0ErQkM7QUEzQ0QscURBQStFO0FBRS9FLDhDQUFrRDtBQUVsRCxNQUFNLGNBQWMsR0FBRztJQUNyQixNQUFNO0lBQ04sUUFBUTtJQUNSLFVBQVU7SUFDVixpQkFBaUI7SUFDakIsMEJBQTBCO0NBQzNCLENBQUM7QUFFYSxLQUFLLFVBQVUsNEJBQTRCLENBQUMsRUFDekQsS0FBSyxFQUFFLEVBQ0wsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQ2IsRUFDRCxTQUFTLEdBR1Q7SUFDQSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQXNCLHNCQUFhLENBQUMsQ0FBQztJQUM1RSxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQzVELElBQ0UsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZO1FBQzlCLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLLFFBQVEsRUFDMUMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0MsTUFBTSxZQUFZLEdBQUcsTUFBTSxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNuRSxNQUFNLFFBQVEsR0FBRyxNQUFNLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLEVBQUU7WUFDaEUsTUFBTSxFQUFFLGNBQWM7U0FDdkIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDO1lBQ0gsTUFBTSxhQUFhLENBQUMsc0JBQXNCLENBQ3hDLFFBQVEsRUFDUixZQUFZLEVBQ1osY0FBYyxDQUNmLENBQUM7UUFDSixDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRVksUUFBQSxNQUFNLEdBQXFCO0lBQ3RDLEtBQUssRUFBRSxDQUFDLDBCQUEwQixFQUFFLDBCQUEwQixDQUFDO0NBQ2hFLENBQUMifQ==