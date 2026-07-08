"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = productUpatedCreatedHandler;
const utils_1 = require("@medusajs/framework/utils");
const square_1 = require("../modules/square");
const productFields = [
    "*",
    "categories.*",
    "variants.*",
    "variants.prices.*",
    "variants.inventory_items.*",
];
async function productUpatedCreatedHandler({ event: { data: { id }, }, container, }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productService = container.resolve(utils_1.Modules.PRODUCT);
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    if (config?.metadata?.sync_catalog &&
        config?.metadata?.sync_source !== "square") {
        logger.info(`Starting Product Sync: ${id}`);
        const squareClient = await squareService.getSquareClientInstance();
        const { data: [product], } = await query.graph({
            entity: "product",
            filters: { id },
            fields: productFields,
        });
        try {
            await squareService.createOrUpdateProduct(product, squareClient, productService);
        }
        catch (e) {
            logger.error(e);
        }
    }
}
exports.config = {
    event: ["product.created", "product.updated"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC11cGRhdGVkLWNyZWF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3Vic2NyaWJlcnMvcHJvZHVjdC11cGRhdGVkLWNyZWF0ZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBYUEsOENBb0NDO0FBaERELHFEQUErRTtBQUUvRSw4Q0FBa0Q7QUFFbEQsTUFBTSxhQUFhLEdBQUc7SUFDcEIsR0FBRztJQUNILGNBQWM7SUFDZCxZQUFZO0lBQ1osbUJBQW1CO0lBQ25CLDRCQUE0QjtDQUM3QixDQUFDO0FBRWEsS0FBSyxVQUFVLDJCQUEyQixDQUFDLEVBQ3hELEtBQUssRUFBRSxFQUNMLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUNiLEVBQ0QsU0FBUyxHQUdUO0lBQ0EsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQXNCLHNCQUFhLENBQUMsQ0FBQztJQUM1RSxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQzVELElBQ0UsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZO1FBQzlCLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLLFFBQVEsRUFDMUMsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxhQUFhLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUNuRSxNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQ2hCLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3BCLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRTtZQUNmLE1BQU0sRUFBRSxhQUFhO1NBQ3RCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQztZQUNILE1BQU0sYUFBYSxDQUFDLHFCQUFxQixDQUN2QyxPQUFPLEVBQ1AsWUFBWSxFQUNaLGNBQWMsQ0FDZixDQUFDO1FBQ0osQ0FBQztRQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVZLFFBQUEsTUFBTSxHQUFxQjtJQUN0QyxLQUFLLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsQ0FBQztDQUM5QyxDQUFDIn0=