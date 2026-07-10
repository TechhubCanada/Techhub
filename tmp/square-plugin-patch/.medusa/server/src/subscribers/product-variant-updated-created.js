"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = productVariantUpatedCreatedHandler;
const utils_1 = require("@medusajs/framework/utils");
const square_1 = require("../modules/square");
const productFields = [
    "*",
    "categories.*",
    "variants.*",
    "variants.prices.*",
    "variants.inventory_items.*",
];
async function productVariantUpatedCreatedHandler({ event: { data: { id }, }, container, }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productService = container.resolve(utils_1.Modules.PRODUCT);
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    if (config?.metadata?.sync_catalog &&
        config?.metadata?.sync_source !== "square") {
        logger.info(`Starting Product Variant Sync: ${id}`);
        const squareClient = await squareService.getSquareClientInstance();
        const productVariant = await productService.retrieveProductVariant(id);
        const { data: [product], } = await query.graph({
            entity: "product",
            filters: { id: productVariant.product_id },
            fields: productFields,
        });
        if (product?.metadata?.square_id) {
            try {
                await squareService.createOrUpdateProduct(product, squareClient, productService);
            }
            catch (e) {
                logger.error(e);
            }
        }
    }
}
exports.config = {
    event: ["product-variant.created", "product-variant.updated"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC12YXJpYW50LXVwZGF0ZWQtY3JlYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdWJzY3JpYmVycy9wcm9kdWN0LXZhcmlhbnQtdXBkYXRlZC1jcmVhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQWFBLHFEQXVDQztBQW5ERCxxREFBK0U7QUFFL0UsOENBQWtEO0FBRWxELE1BQU0sYUFBYSxHQUFHO0lBQ3BCLEdBQUc7SUFDSCxjQUFjO0lBQ2QsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQiw0QkFBNEI7Q0FDN0IsQ0FBQztBQUVhLEtBQUssVUFBVSxrQ0FBa0MsQ0FBQyxFQUMvRCxLQUFLLEVBQUUsRUFDTCxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FDYixFQUNELFNBQVMsR0FHVDtJQUNBLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFzQixzQkFBYSxDQUFDLENBQUM7SUFDNUUsTUFBTSxNQUFNLEdBQUcsTUFBTSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUM1RCxJQUNFLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWTtRQUM5QixNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsS0FBSyxRQUFRLEVBQzFDLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sWUFBWSxHQUFHLE1BQU0sYUFBYSxDQUFDLHVCQUF1QixFQUFFLENBQUM7UUFDbkUsTUFBTSxjQUFjLEdBQUcsTUFBTSxjQUFjLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkUsTUFBTSxFQUNKLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUNoQixHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNwQixNQUFNLEVBQUUsU0FBUztZQUNqQixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsY0FBYyxDQUFDLFVBQVUsRUFBRTtZQUMxQyxNQUFNLEVBQUUsYUFBYTtTQUN0QixDQUFDLENBQUM7UUFDSCxJQUFJLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDO2dCQUNILE1BQU0sYUFBYSxDQUFDLHFCQUFxQixDQUN2QyxPQUFPLEVBQ1AsWUFBWSxFQUNaLGNBQWMsQ0FDZixDQUFDO1lBQ0osQ0FBQztZQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBRVksUUFBQSxNQUFNLEdBQXFCO0lBQ3RDLEtBQUssRUFBRSxDQUFDLHlCQUF5QixFQUFFLHlCQUF5QixDQUFDO0NBQzlELENBQUMifQ==