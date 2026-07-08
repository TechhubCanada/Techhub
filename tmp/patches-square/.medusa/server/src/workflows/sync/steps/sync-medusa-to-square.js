"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMedusaToSquareStep = void 0;
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const square_1 = require("../../../modules/square");
const categoryFields = [
    "name",
    "handle",
    "metadata",
    "parent_category",
    "parent_category.metadata",
];
const productFields = [
    "*",
    "categories.*",
    "variants.*",
    "variants.prices.*",
    "variants.inventory_items.*",
];
exports.syncMedusaToSquareStep = (0, workflows_sdk_1.createStep)({
    name: "sync-medusa-to-square-step",
    async: true,
}, async (_, { container }) => {
    //Services
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const productService = container.resolve(utils_1.Modules.PRODUCT);
    const notificationModuleService = container.resolve(utils_1.Modules.NOTIFICATION);
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    logger.info("Starting Category Sync...");
    await squareService.setMetadata({
        ...config.metadata,
        is_synchronizing: true,
    });
    //Square Client
    const squareClient = await squareService.getSquareClientInstance();
    //---------------------CUSTOMERS-------------------------
    if (config?.metadata?.sync_customers &&
        config?.metadata?.sync_source === "medusa") {
        logger.info("Syncing Customers Square...");
        try {
            const batchSize = 20;
            let skip = 0;
            let hasMore = true;
            while (hasMore) {
                const { data: customers, metadata } = await query.graph({
                    entity: "customer",
                    fields: ["*", "metadata"],
                    pagination: {
                        take: batchSize,
                        skip: skip,
                    },
                });
                const count = metadata?.count ?? 0;
                if (customers.length === 0) {
                    hasMore = false;
                    break;
                }
                logger.info(`Syncing batch: customers ${skip + 1} to ${Math.min(skip + batchSize, count)} of ${count}`);
                for (const customer of customers) {
                    try {
                        await squareService.createOrUpdateCustomer(customer, squareClient);
                    }
                    catch (e) {
                        logger.error(`Failed to sync customer ${customer.email}: ${e.message}`);
                    }
                }
                skip += batchSize;
                hasMore = skip < count;
            }
            logger.info("Customer synchronization finished.");
        }
        catch (error) {
            logger.error(`Syncing Customers Failed: ${error.message}`);
            // await notificationModuleService.createNotifications({
            //   to: "",
            //   channel: "feed",
            //   template: "admin-ui",
            //   data: {
            //     title: "ERROR: Square Plugin ",
            //     description: `Syncing Customers Failed: ${error.message}`,
            //   },
            // });
        }
    }
    //---------------------CATALOG-------------------------
    if (config?.metadata?.sync_catalog &&
        config?.metadata?.sync_source === "medusa") {
        //----------CATEGORIES--------------
        try {
            //Initial Data
            const initialCategoriesData = await productService.listProductCategories({}, { select: categoryFields });
            for (const category of initialCategoriesData) {
                try {
                    await squareService.createOrUpdateCategory(category, squareClient, productService);
                }
                catch (e) {
                    logger.error(e);
                }
            }
            //Adjusting Categories tree structure (New traverse)
            const categories = await productService.listProductCategories({}, { select: categoryFields });
            for (const category of categories) {
                try {
                    await squareService.createOrUpdateCategory(category, squareClient, productService);
                }
                catch (e) {
                    logger.error(e);
                }
            }
        }
        catch (error) {
            logger.error(`Syncing Categories Failed: ${error.message}`);
            // await notificationModuleService.createNotifications({
            //   to: "",
            //   channel: "feed",
            //   template: "admin-ui",
            //   data: {
            //     title: "ERROR: Square Plugin ",
            //     description: `Syncing Categories Failed: ${error.message}`,
            //   },
            // });
        }
        //----------PRODUCTS--------------
        logger.info("Starting Product Sync...");
        try {
            let hasMore = true;
            let skip = 0;
            const batchSize = 20;
            const allProcessedResults = [];
            while (hasMore) {
                const { data: products, metadata } = await query.graph({
                    entity: "product",
                    fields: productFields,
                    pagination: {
                        take: batchSize,
                        skip: skip,
                    },
                });
                if (!products?.length) {
                    hasMore = false;
                    break;
                }
                for (const product of products) {
                    await squareService.createOrUpdateProduct(product, squareClient, productService);
                    const { data: [updatedProduct], } = await query.graph({
                        entity: "product",
                        fields: [
                            ...productFields,
                            "variants.inventory_items.inventory.location_levels.*",
                        ],
                        filters: { id: product.id },
                    });
                    await squareService.createOrUpdateInventory(updatedProduct, squareClient);
                    allProcessedResults.push({ id: product.id, status: "processed" });
                }
                logger.log(`Products ${skip + products.length} of ${metadata?.count}`);
                skip += batchSize;
                hasMore = skip < (metadata?.count || 0);
            }
        }
        catch (error) {
            logger.error(`Syncing Product Failed: ${error.message}`);
            // await notificationModuleService.createNotifications({
            //   to: "",
            //   channel: "feed",
            //   template: "admin-ui",
            //   data: {
            //     title: "ERROR: Square Plugin ",
            //     description: `Syncing Product Failed: ${error.message}`,
            //   },
            // });
        }
        logger.info("Square Sync Completed");
        // await notificationModuleService.createNotifications({
        //   to: "",
        //   channel: "feed",
        //   template: "admin-ui",
        //   data: {
        //     title: "Square Plugin",
        //     description: `Medusa -> Square Sync Completed`,
        //   },
        // });
        await squareService.setMetadata({
            ...config.metadata,
            is_synchronizing: false,
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1tZWR1c2EtdG8tc3F1YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9zeW5jL3N0ZXBzL3N5bmMtbWVkdXNhLXRvLXNxdWFyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBK0U7QUFDL0UscUVBQStEO0FBRS9ELG9EQUF3RDtBQUV4RCxNQUFNLGNBQWMsR0FBRztJQUNyQixNQUFNO0lBQ04sUUFBUTtJQUNSLFVBQVU7SUFDVixpQkFBaUI7SUFDakIsMEJBQTBCO0NBQzNCLENBQUM7QUFFRixNQUFNLGFBQWEsR0FBRztJQUNwQixHQUFHO0lBQ0gsY0FBYztJQUNkLFlBQVk7SUFDWixtQkFBbUI7SUFDbkIsNEJBQTRCO0NBQzdCLENBQUM7QUFFVyxRQUFBLHNCQUFzQixHQUFHLElBQUEsMEJBQVUsRUFDOUM7SUFDRSxJQUFJLEVBQUUsNEJBQTRCO0lBQ2xDLEtBQUssRUFBRSxJQUFJO0NBQ1osRUFDRCxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN6QixVQUFVO0lBQ1YsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFELE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUUsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBc0Isc0JBQWEsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sTUFBTSxHQUFHLE1BQU0sYUFBYSxDQUFDLHNCQUFz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