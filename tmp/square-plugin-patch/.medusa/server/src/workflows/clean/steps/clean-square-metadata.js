"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanSquareStep = void 0;
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
exports.cleanSquareStep = (0, workflows_sdk_1.createStep)({
    name: "clean-square-step",
    async: true,
}, async (_, { container }) => {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productService = container.resolve(utils_1.Modules.PRODUCT);
    const batchSize = 20;
    logger.info("Starting Square metadata cleanup process");
    let hasMoreCategories = true;
    let categorySkip = 0;
    // Cleaning Categories
    while (hasMoreCategories) {
        const [categories, count] = await productService.listAndCountProductCategories({}, { select: ["id", "metadata"], take: batchSize, skip: categorySkip });
        const categoriesToUpdate = categories.filter((cat) => cat.metadata?.square_id || cat.metadata?.square_version);
        if (categoriesToUpdate.length > 0) {
            await Promise.all(categoriesToUpdate.map((cat) => {
                const { square_id, square_version, ...cleanMetadata } = cat.metadata || {};
                return productService.updateProductCategories(cat.id, {
                    metadata: cleanMetadata,
                });
            }));
        }
        categorySkip += batchSize;
        hasMoreCategories = categorySkip < count;
        logger.info(`Processed ${Math.min(categorySkip, count)} of ${count} categories`);
    }
    // Cleaning Products
    let hasMoreProducts = true;
    let productSkip = 0;
    while (hasMoreProducts) {
        const [products, count] = await productService.listAndCountProducts({}, { select: ["id", "metadata"], take: batchSize, skip: productSkip });
        const toUpdate = products.filter((prod) => prod.metadata?.square_id ||
            prod.metadata?.square_version ||
            prod.metadata?.square_image_ids);
        if (toUpdate.length > 0) {
            await Promise.all(toUpdate.map((prod) => {
                const { square_id, square_version, square_image_ids, ...cleanMetadata } = prod.metadata || {};
                return productService.updateProducts(prod.id, {
                    metadata: cleanMetadata,
                });
            }));
        }
        productSkip += batchSize;
        hasMoreProducts = productSkip < count;
        logger.info(`Processed ${Math.min(productSkip, count)} of ${count} products`);
    }
    // Cleaning Variants
    let hasMoreVariants = true;
    let variantSkip = 0;
    while (hasMoreVariants) {
        const [variants, count] = await productService.listAndCountProductVariants({}, { select: ["id", "metadata"], take: batchSize, skip: variantSkip });
        const toUpdate = variants.filter((variant) => variant?.metadata?.square_id || variant?.metadata?.square_version);
        if (toUpdate.length > 0) {
            await Promise.all(toUpdate.map((variant) => {
                const { square_id, square_version, ...cleanMetadata } = variant.metadata || {};
                return productService.updateProductVariants(variant.id, {
                    metadata: cleanMetadata,
                });
            }));
        }
        variantSkip += batchSize;
        hasMoreVariants = variantSkip < count;
        logger.info(`Processed ${Math.min(variantSkip, count)} of ${count} variants`);
    }
    logger.info("Cleanup process completed successfully");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW4tc3F1YXJlLW1ldGFkYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9jbGVhbi9zdGVwcy9jbGVhbi1zcXVhcmUtbWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBQStFO0FBQy9FLHFFQUErRDtBQUVsRCxRQUFBLGVBQWUsR0FBRyxJQUFBLDBCQUFVLEVBQ3ZDO0lBQ0UsSUFBSSxFQUFFLG1CQUFtQjtJQUN6QixLQUFLLEVBQUUsSUFBSTtDQUNaLEVBQ0QsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekIsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLGNBQWMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFFckIsTUFBTSxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBRXhELElBQUksaUJBQWlCLEdBQUcsSUFBSSxDQUFDO0lBQzdCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztJQUVyQixzQkFBc0I7SUFDdEIsT0FBTyxpQkFBaUIsRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEdBQ3ZCLE1BQU0sY0FBYyxDQUFDLDZCQUE2QixDQUNoRCxFQUFFLEVBQ0YsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLENBQ3BFLENBQUM7UUFDSixNQUFNLGtCQUFrQixHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQzFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMs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