"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSquareToMedusaStep = void 0;
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const square_1 = require("../../../modules/square");
const transform_to_medusa_1 = require("../utils/transform-to-medusa");
const categoryFields = [
    "id",
    "handle",
    "name",
    "metadata",
    "parent_category_id",
    "parent_category.*",
];
const productFields = [
    "id",
    "title",
    "handle",
    "metadata",
    "variants.id",
    "variants.metadata",
];
exports.syncSquareToMedusaStep = (0, workflows_sdk_1.createStep)({
    name: "sync-square-to-medusa-step",
    async: true,
}, async (_, { container }) => {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const notificationModuleService = container.resolve(utils_1.Modules.NOTIFICATION);
    const productService = container.resolve(utils_1.Modules.PRODUCT);
    const customerService = container.resolve(utils_1.Modules.CUSTOMER);
    const inventoryService = container.resolve(utils_1.Modules.INVENTORY);
    const stockLocationService = container.resolve(utils_1.Modules.STOCK_LOCATION);
    const squareService = container.resolve(square_1.SQUARE_MODULE);
    const config = await squareService.getActiveConfiguration();
    const squareClient = await squareService.getSquareClientInstance();
    logger.info("Starting Square -> Medusa Sync via Core Flows...");
    const locations = await stockLocationService.listStockLocations({}, { take: 1 });
    let stockLocationId = locations?.[0]?.id;
    if (!stockLocationId) {
        const newLoc = await stockLocationService.createStockLocations({
            name: "Square Warehouse",
        });
        stockLocationId = newLoc.id;
    }
    await squareService.setMetadata({
        ...config.metadata,
        is_synchronizing: true,
    });
    //---------------------CUSTOMERS-------------------------
    if (config?.metadata?.sync_customers &&
        config?.metadata?.sync_source === "square") {
        try {
            logger.info("Syncing Customers (Square -> Medusa Guest Users)...");
            let cursor;
            let hasMore = true;
            let totalProcessed = 0;
            while (hasMore) {
                const squareResponse = await squareService.listSquareCustomers(squareClient, cursor);
                const squareCustomers = squareResponse.customers || [];
                if (squareCustomers.length === 0) {
                    hasMore = false;
                    break;
                }
                for (const squareCustomer of squareCustomers) {
                    if (!squareCustomer.emailAddress)
                        continue;
                    const { data: [existingCustomer], } = await query.graph({
                        entity: "customer",
                        fields: ["id", "metadata"],
                        filters: {
                            $or: [
                                { metadata: { square_id: squareCustomer.id } },
                                { email: squareCustomer.emailAddress },
                            ],
                        },
                    });
                    const customerData = (0, transform_to_medusa_1.transformCustomerToMedusa)(squareCustomer);
                    if (existingCustomer) {
                        await customerService.updateCustomers(existingCustomer.id, customerData);
                        logger.info(`Updated customer: ${squareCustomer.emailAddress}`);
                    }
                    else {
                        await customerService.createCustomers([customerData]);
                        logger.info(`Created guest customer: ${squareCustomer.emailAddress}`);
                    }
                }
                totalProcessed += squareCustomers.length;
                const newCursor = squareResponse.cursor;
                if (!newCursor ||
                    (squareResponse.count &&
                        squareResponse.count <= BigInt(totalProcessed))) {
                    hasMore = false;
                }
                cursor = newCursor;
                logger.info(`Batch finished. Total processed: ${totalProcessed}`);
            }
            logger.info("Customer Sync Completed Successfully");
        }
        catch (error) {
            logger.error(`Customer Sync Failed: ${error.message}`);
            // await notificationModuleService.createNotifications({
            //   to: "",
            //   channel: "feed",
            //   template: "admin-ui",
            //   data: {
            //     title: "ERROR: Square Plugin ",
            //     description: `Customer Sync Failed: ${error.message}`,
            //   },
            // });
        }
    }
    //---------------------CATALOG-------------------------
    if (config?.metadata?.sync_catalog &&
        config?.metadata?.sync_source === "square") {
        try {
            //----------CATEGORIES--------------
            logger.info("Syncing Categories...");
            for (let i = 1; i <= 2; i++) {
                logger.info(`Categories Step: ${i}`);
                let categoryResponse = await squareService.listSquareCatalog(squareClient, ["CATEGORY"]);
                while (categoryResponse) {
                    const objects = categoryResponse.data || [];
                    for (const obj of objects) {
                        if (obj.type !== "CATEGORY")
                            continue;
                        let parentCategory = null;
                        const { data: [existing], } = await query.graph({
                            entity: "product_category",
                            fields: categoryFields,
                            filters: { metadata: { square_id: obj.id } },
                        });
                        if (obj?.categoryData?.parentCategory?.id) {
                            const { data: [parent], } = await query.graph({
                                entity: "product_category",
                                fields: categoryFields,
                                filters: {
                                    metadata: {
                                        square_id: obj?.categoryData?.parentCategory?.id,
                                    },
                                },
                            });
                            parentCategory = parent.id;
                        }
                        const categoryData = (0, transform_to_medusa_1.transformCategoryToMedusa)(obj, parentCategory);
                        if (existing) {
                            await productService.updateProductCategories(existing.id, categoryData);
                        }
                        else {
                            await productService.createProductCategories([categoryData]);
                        }
                    }
                    if (!categoryResponse.hasNextPage())
                        break;
                    categoryResponse = await categoryResponse.getNextPage();
                }
            }
            //----------PRODUCTS--------------
            logger.info("Fetching Square Item Options for mapping...");
            const optionsMapping = new Map();
            let optionsResponse = await squareService.listSquareCatalog(squareClient, ["ITEM_OPTION"]);
            while (optionsResponse) {
                const optionObjects = optionsResponse.data || [];
                for (const opt of optionObjects) {
                    if (opt.type === "ITEM_OPTION" && opt.itemOptionData?.name) {
                        optionsMapping.set(opt.id, opt.itemOptionData.name);
                    }
                }
                if (!optionsResponse.hasNextPage())
                    break;
                optionsResponse = await optionsResponse.getNextPage();
            }
            logger.info("Syncing Products & Variants...");
            let itemResponse = await squareService.listSquareCatalog(squareClient, [
                "ITEM",
                "IMAGE",
            ]);
            const { data: [salesChannel], } = await query.graph({
                entity: "sales_channel",
                fields: ["id"],
                pagination: { take: 1 },
            });
            const { data: [shippingProfile], } = await query.graph({
                entity: "shipping_profile",
                fields: ["id"],
                pagination: { take: 1 },
            });
            while (itemResponse) {
                const allObjects = itemResponse.data || [];
                const imageMap = new Map();
                allObjects
                    .filter((o) => o.type === "IMAGE")
                    .forEach((img) => img.imageData?.url && imageMap.set(img.id, img.imageData.url));
                const items = allObjects.filter((o) => o.type === "ITEM");
                for (const item of items) {
                    const { data: [existingProduct], } = await query.graph({
                        entity: "product",
                        fields: productFields,
                        filters: { metadata: { square_id: item.id } },
                    });
                    let medusaCategoryId;
                    const squareCategoryId = item.itemData?.categories?.[0]?.id || item.itemData?.categoryId;
                    if (squareCategoryId) {
                        const { data: [cat], } = await query.graph({
                            entity: "product_category",
                            fields: ["id"],
                            filters: { metadata: { square_id: squareCategoryId } },
                        });
                        medusaCategoryId = cat?.id;
                    }
                    const variantsData = (item.itemData?.variations || []).map((v) => (0, transform_to_medusa_1.transformVariantToMedusa)({
                        variant: v,
                        existingProduct,
                        optionsMapping,
                    }));
                    const productPayload = {
                        sales_channels: [{ id: salesChannel.id }],
                        shipping_profile_id: shippingProfile.id,
                        ...(0, transform_to_medusa_1.transformProductToMedusa)({
                            item,
                            imageMap,
                            medusaCategoryId,
                            variantsData,
                        }),
                    };
                    try {
                        let medusaProduct;
                        if (existingProduct) {
                            const result = await (0, core_flows_1.updateProductsWorkflow)(container).run({
                                input: {
                                    products: [
                                        {
                                            ...productPayload,
                                            id: existingProduct.id,
                                        },
                                    ],
                                },
                            });
                            medusaProduct = result.result[0];
                        }
                        else {
                            const result = await (0, core_flows_1.createProductsWorkflow)(container).run({
                                input: {
                                    products: [productPayload],
                                },
                            });
                            medusaProduct = result.result[0];
                        }
                        const squareVariationIds = (item.itemData?.variations || []).map((v) => v.id);
                        const squareInventoryMap = await squareService.getInventoryCounts(squareClient, squareVariationIds);
                        for (const squareVar of item.itemData?.variations || []) {
                            const medusaVariant = medusaProduct.variants.find((mv) => mv.metadata?.square_id === squareVar.id);
                            if (medusaVariant) {
                                const quantity = squareInventoryMap[squareVar.id] || 0;
                                let [inventoryItem] = await inventoryService.listInventoryItems({
                                    sku: medusaVariant.sku,
                                });
                                if (!inventoryItem) {
                                    const { result: createdItems } = await (0, core_flows_1.createInventoryItemsWorkflow)(container).run({
                                        input: {
                                            items: [
                                                {
                                                    sku: medusaVariant.sku,
                                                    requires_shipping: true,
                                                },
                                            ],
                                        },
                                    });
                                    inventoryItem = createdItems[0];
                                    (0, core_flows_1.attachInventoryItemToVariants)([
                                        {
                                            tag: medusaVariant.id,
                                            inventoryItemId: inventoryItem.id,
                                        },
                                    ]);
                                }
                                const [existingLevel] = await inventoryService.listInventoryLevels({
                                    inventory_item_id: inventoryItem.id,
                                    location_id: stockLocationId,
                                });
                                if (existingLevel) {
                                    await inventoryService.updateInventoryLevels([
                                        {
                                            id: existingLevel.id,
                                            inventory_item_id: inventoryItem.id,
                                            location_id: stockLocationId,
                                            stocked_quantity: quantity,
                                        },
                                    ]);
                                }
                                else {
                                    await inventoryService.createInventoryLevels([
                                        {
                                            inventory_item_id: inventoryItem.id,
                                            location_id: stockLocationId,
                                            stocked_quantity: quantity,
                                        },
                                    ]);
                                }
                            }
                        }
                    }
                    catch (error) {
                        logger.error(`Workflow failed for product ${item.id}: ${error.message}`);
                    }
                }
                if (!itemResponse.hasNextPage())
                    break;
                itemResponse = await itemResponse.getNextPage();
            }
            logger.info("Sync Completed Successfully");
        }
        catch (error) {
            logger.error(`Sync Failed: ${error.message}`);
            // await notificationModuleService.createNotifications({
            //   to: "",
            //   channel: "feed",
            //   template: "admin-ui",
            //   data: {
            //     title: "ERROR: Square Plugin ",
            //     description: `Sync Failed: ${error.message}`,
            //   },
            // });
        }
    }
    // await notificationModuleService.createNotifications({
    //   to: "",
    //   channel: "feed",
    //   template: "admin-ui",
    //   data: {
    //     title: "Square Plugin",
    //     description: `Square -> Medusa Sync Completed`,
    //   },
    // });
    await squareService.setMetadata({
        ...config.metadata,
        is_synchronizing: false,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy1zcXVhcmUtdG8ubWVkdXNhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3dvcmtmbG93cy9zeW5jL3N0ZXBzL3N5bmMtc3F1YXJlLXRvLm1lZHVzYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxREFBK0U7QUFDL0UscUVBQStEO0FBQy9ELDREQUtxQztBQUVyQyxvREFBd0Q7QUFDeEQsc0VBS3NDO0FBRXRDLE1BQU0sY0FBYyxHQUFHO0lBQ3JCLElBQUk7SUFDSixRQUFRO0lBQ1IsTUFBTTtJQUNOLFVBQVU7SUFDVixvQkFBb0I7SUFDcEIsbUJBQW1CO0NBQ3BCLENBQUM7QUFDRixNQUFNLGFBQWEsR0FBRztJQUNwQixJQUFJO0lBQ0osT0FBTztJQUNQLFFBQVE7SUFDUixVQUFVO0lBQ1YsYUFBYTtJQUNiLG1CQUFtQjtDQUNwQixDQUFDO0FBRVcsUUFBQSxzQkFBc0IsR0FBRyxJQUFBLDBCQUFVLEVBQzlDO0lBQ0UsSUFBSSxFQUFFLDRCQUE0QjtJQUNsQyxLQUFLLEVBQUUsSUFBSTtDQUNaLEVBQ0QsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekIsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDMUUsTUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUQsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUQsTUFBTSxnQkFBZ0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5RCxNQUFNLG9CQUFvQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQXNCLHNCQUFhLENBQUMsQ0FBQztJQUU1RSxNQUFNLE1BQU0sR0FBRyxNQUFNLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQzVELE1BQU0sWUFBWSxHQUFHLE1BQU0sYUFBYSxDQUFDLHVCQUF1QixFQUFFLENBQUM7SUFFbkUsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBRWhFLE1BQU0sU0FBUyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsa0JBQWtCLENBQzdELEVBQUUsRUFDRixFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FDWixDQUFDO0lBQ0YsSUFBSSxlQUFlLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBRXpDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQixNQUFNLE1BQU0sR0FBRyxNQUFNLG9CQUFvQixDQUFDLG9CQUFvQixDQUFDO1lBQzdELElBQUksRUFBRSxrQkFBa0I7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsZUFBZSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELE1BQU0sYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUM5QixHQUFHLE1BQU0sQ0FBQyxRQUFRO1FBQ2xCLGdCQUFnQixFQUFFLElBQUk7S0FDdkIsQ0FBQyxDQUFDO0lBRUgseURBQXlEO0lBQ3pELElBQ0UsTUFBTSxFQUFFLFFBQVEsRUFBRSxjQUFjO1FBQ2hDLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLLFFBQVEsRUFDMUMsQ0FBQztRQUNELElBQUksQ0FBQztZQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMscURBQXFELENBQUMsQ0FBQztZQUVuRSxJQUFJLE1BQTBCLENBQUM7WUFDL0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztZQUV2QixPQUFPLE9BQU8sRUFBRSxDQUFDO2dCQUNmLE1BQU0sY0FBYyxHQUFHLE1BQU0sYUFBYSxDQUFDLG1CQUFtQixDQUM1RCxZQUFZLEVBQ1osTUFBTSxDQUNQLENBQUM7Z0JBQ0YsTUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7Z0JBRXZELElBQUksZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztvQkFDakMsT0FBTyxHQUFHLEtBQUssQ0FBQztvQkFDaEIsTUFBTTtnQkFDUixDQUFDO2dCQUVELEtBQUssTUFBTSxjQUFjLElBQUksZUFBZSxFQUFFLENBQUM7b0JBQzdDLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWTt3QkFBRSxTQUFTO29CQUUzQyxNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FDekIsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ3BCLE1BQU0sRUFBRSxVQUFVO3dCQUNsQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDO3dCQUMxQixPQUFPLEVBQUU7NEJBQ1AsR0FBRyxFQUFFO2dDQUNILEVBQUUsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtnQ0FDOUMsRUFBRSxLQUFLLEVBQUUsY0FBYyxDQUFDLFlBQVksRUFBRTs2QkFDdkM7eUJBQ0Y7cUJBQ0YsQ0FBQyxDQUFDO29CQUVILE1BQU0sWUFBWSxHQUFHLElBQUEsK0NBQXlCLEVBQUMsY0FBYyxDQUFDLENBQUM7b0JBRS9ELElBQUksZ0JBQWdCLEVBQUUsQ0FBQzt3QkFDckIsTUFBTSxlQUFlLENBQUMsZUFBZSxDQUNuQyxnQkFBZ0IsQ0FBQyxFQUFFLEVBQ25CLFlBQVksQ0FDYixDQUFDO3dCQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO29CQUNsRSxDQUFDO3lCQUFNLENBQUM7d0JBQ04sTUFBTSxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQzt3QkFDdEQsTUFBTSxDQUFDLElBQUksQ0FDVCwyQkFBMkIsY0FBYyxDQUFDLFlBQVksRUFBRSxDQUN6RCxDQUFDO29CQUNKLENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxjQUFjLElBQUksZUFBZSxDQUFDLE1BQU0sQ0FBQztnQkFDekMsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztnQkFFeEMsSUFDRSxDQUFDLFNBQVM7b0JBQ1YsQ0FBQyxjQUFjLENBQUMsS0FBSzt3QkFDbkIsY0FBYyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsRUFDakQsQ0FBQztvQkFDRCxPQUFPLEdBQUcsS0FBSyxDQUFDO2dCQUNsQixDQUFDO2dCQUVELE1BQU0sR0FBRyxTQUFTLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDcEUsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELHdEQUF3RDtZQUN4RCxZQUFZO1lBQ1oscUJBQXFCO1lBQ3JCLDBCQUEwQjtZQUMxQixZQUFZO1lBQ1osc0NBQXNDO1lBQ3RDLDZEQUE2RDtZQUM3RCxPQUFPO1lBQ1AsTUFBTTtRQUNSLENBQUM7SUFDSCxDQUFDO0lBRUQsdURBQXVEO0lBQ3ZELElBQ0UsTUFBTSxFQUFFLFFBQVEsRUFBRSxZQUFZO1FBQzlCLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxLQUFLLFFBQVEsRUFDMUMsQ0FBQztRQUNELElBQUksQ0FBQztZQUNILG9DQUFvQztZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDckMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUM1QixNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNyQyxJQUFJLGdCQUFnQixHQUFHLE1BQU0sYUFBYSxDQUFDLGlCQUFpQixDQUMxRCxZQUFZLEVBQ1osQ0FBQyxVQUFVLENBQUMsQ0FDYixDQUFDO2dCQUNGLE9BQU8sZ0JBQWdCLEVBQUUsQ0FBQztvQkFDeEIsTUFBTSxPQUFPLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztvQkFDNUMsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQzt3QkFDMUIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFVBQVU7NEJBQUUsU0FBUzt3QkFDdEMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO3dCQUMxQixNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQ2pCLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDOzRCQUNwQixNQUFNLEVBQUUsa0JBQWtCOzRCQUMxQixNQUFNLEVBQUUsY0FBYzs0QkFDdEIsT0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRTt5QkFDN0MsQ0FBQyxDQUFDO3dCQUVILElBQUksR0FBRyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLENBQUM7NEJBQzFDLE1BQU0sRUFDSixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FDZixHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztnQ0FDcEIsTUFBTSxFQUFFLGtCQUFrQjtnQ0FDMUIsTUFBTSxFQUFFLGNBQWM7Z0NBQ3RCLE9BQU8sRUFBRTtvQ0FDUCxRQUFRLEVBQUU7d0NBQ1IsU0FBUyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLEVBQUU7cUNBQ2pEO2lDQUNGOzZCQUNGLENBQUMsQ0FBQzs0QkFDSCxjQUFjLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQzt3QkFDN0IsQ0FBQzt3QkFFRCxNQUFNLFlBQVksR0FBRyxJQUFBLCtDQUF5QixFQUM1QyxHQUFHLEVBQ0gsY0FBYyxDQUNmLENBQUM7d0JBRUYsSUFBSSxRQUFRLEVBQUUsQ0FBQzs0QkFDYixNQUFNLGNBQWMsQ0FBQyx1QkFBdUIsQ0FDMUMsUUFBUSxDQUFDLEVBQUUsRUFDWCxZQUFZLENBQ2IsQ0FBQzt3QkFDSixDQUFDOzZCQUFNLENBQUM7NEJBQ04sTUFBTSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO3dCQUMvRCxDQUFDO29CQUNILENBQUM7b0JBQ0QsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRTt3QkFBRSxNQUFNO29CQUMzQyxnQkFBZ0IsR0FBRyxNQUFNLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUMxRCxDQUFDO1lBQ0gsQ0FBQztZQUVELGtDQUFrQztZQUVsQyxNQUFNLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7WUFDM0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7WUFDakQsSUFBSSxlQUFlLEdBQUcsTUFBTSxhQUFhLENBQUMsaUJBQWlCLENBQ3pELFlBQVksRUFDWixDQUFDLGFBQWEsQ0FBQyxDQUNoQixDQUFDO1lBQ0YsT0FBTyxlQUFlLEVBQUUsQ0FBQztnQkFDdkIsTUFBTSxhQUFhLEdBQUcsZUFBZSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQ2pELEtBQUssTUFBTSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7b0JBQ2hDLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxhQUFhLElBQUksR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQzt3QkFDM0QsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RELENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRTtvQkFBRSxNQUFNO2dCQUMxQyxlQUFlLEdBQUcsTUFBTSxlQUFlLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDeEQsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUM5QyxJQUFJLFlBQVksR0FBRyxNQUFNLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JFLE1BQU07Z0JBQ04sT0FBTzthQUNSLENBQUMsQ0FBQztZQUVILE1BQU0sRUFDSixJQUFJLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FDckIsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLE1BQU0sRUFBRSxlQUFlO2dCQUN2QixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTthQUN4QixDQUFDLENBQUM7WUFFSCxNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQ3hCLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNwQixNQUFNLEVBQUUsa0JBQWtCO2dCQUMxQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTthQUN4QixDQUFDLENBQUM7WUFFSCxPQUFPLFlBQVksRUFBRSxDQUFDO2dCQUNwQixNQUFNLFVBQVUsR0FBRyxZQUFZLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDM0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7Z0JBRTNDLFVBQVU7cUJBQ1AsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQztxQkFDakMsT0FBTyxDQUNOLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FDTixHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FDaEUsQ0FBQztnQkFFSixNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDO2dCQUUxRCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxDQUFDO29CQUN6QixNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQ3hCLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUNwQixNQUFNLEVBQUUsU0FBUzt3QkFDakIsTUFBTSxFQUFFLGFBQWE7d0JBQ3JCLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7cUJBQzlDLENBQUMsQ0FBQztvQkFFSCxJQUFJLGdCQUFvQyxDQUFDO29CQUN6QyxNQUFNLGdCQUFnQixHQUNwQixJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztvQkFDbEUsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO3dCQUNyQixNQUFNLEVBQ0osSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQ1osR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7NEJBQ3BCLE1BQU0sRUFBRSxrQkFBa0I7NEJBQzFCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQzs0QkFDZCxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRTt5QkFDdkQsQ0FBQyxDQUFDO3dCQUNILGdCQUFnQixHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUM7b0JBQzdCLENBQUM7b0JBRUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQ3hELENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FDVCxJQUFBLDhDQUF3QixFQUFDO3dCQUN2QixPQUFPLEVBQUUsQ0FBQzt3QkFDVixlQUFlO3dCQUNmLGNBQWM7cUJBQ2YsQ0FBQyxDQUNMLENBQUM7b0JBRUYsTUFBTSxjQUFjLEdBQVE7d0JBQzFCLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQzt3QkFDekMsbUJBQW1CLEVBQUUsZUFBZSxDQUFDLEVBQUU7d0JBQ3ZDLEdBQUcsSUFBQSw4Q0FBd0IsRUFBQzs0QkFDMUIsSUFBSTs0QkFDSixRQUFROzRCQUNSLGdCQUFnQjs0QkFDaEIsWUFBWTt5QkFDYixDQUFDO3FCQUNILENBQUM7b0JBRUYsSUFBSSxDQUFDO3dCQUNILElBQUksYUFBYSxDQUFDO3dCQUNsQixJQUFJLGVBQWUsRUFBRSxDQUFDOzRCQUNwQixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsbUNBQXNCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO2dDQUN6RCxLQUFLLEVBQUU7b0NBQ0wsUUFBUSxFQUFFO3dDQUNSOzRDQUNFLEdBQUcsY0FBYzs0Q0FDakIsRUFBRSxFQUFFLGVBQWUsQ0FBQyxFQUFFO3lDQUN2QjtxQ0FDRjtpQ0FDRjs2QkFDRixDQUFDLENBQUM7NEJBQ0gsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLENBQUM7NkJBQU0sQ0FBQzs0QkFDTixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsbUNBQXNCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO2dDQUN6RCxLQUFLLEVBQUU7b0NBQ0wsUUFBUSxFQUFFLENBQUMsY0FBYyxDQUFDO2lDQUMzQjs2QkFDRixDQUFDLENBQUM7NEJBQ0gsYUFBYSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ25DLENBQUM7d0JBRUQsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FDOUQsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFZLENBQ3RCLENBQUM7d0JBRUYsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLGFBQWEsQ0FBQyxrQkFBa0IsQ0FDL0QsWUFBWSxFQUNaLGtCQUFrQixDQUNuQixDQUFDO3dCQUVGLEtBQUssTUFBTSxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFVLElBQUksRUFBRSxFQUFFLENBQUM7NEJBQ3hELE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUMvQyxDQUFDLEVBQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxTQUFTLEtBQUssU0FBUyxDQUFDLEVBQUUsQ0FDckQsQ0FBQzs0QkFFRixJQUFJLGFBQWEsRUFBRSxDQUFDO2dDQUNsQixNQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dDQUV4RCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQ2pCLE1BQU0sZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7b0NBQ3hDLEdBQUcsRUFBRSxhQUFhLENBQUMsR0FBRztpQ0FDdkIsQ0FBQyxDQUFDO2dDQUVMLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztvQ0FDbkIsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FDNUIsTUFBTSxJQUFBLHlDQUE0QixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQzt3Q0FDaEQsS0FBSyxFQUFFOzRDQUNMLEtBQUssRUFBRTtnREFDTDtvREFDRSxHQUFHLEVBQUUsYUFBYSxDQUFDLEdBQUc7b0RBQ3RCLGlCQUFpQixFQUFFLElBQUk7aURBQ3hCOzZDQUNGO3lDQUNGO3FDQUNGLENBQUMsQ0FBQztvQ0FDTCxhQUFhLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUVoQyxJQUFBLDBDQUE2QixFQUFDO3dDQUM1Qjs0Q0FDRSxHQUFHLEVBQUUsYUFBYSxDQUFDLEVBQUU7NENBQ3JCLGVBQWUsRUFBRSxhQUFhLENBQUMsRUFBRTt5Q0FDbEM7cUNBQ0YsQ0FBQyxDQUFDO2dDQUNMLENBQUM7Z0NBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUNuQixNQUFNLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO29DQUN6QyxpQkFBaUIsRUFBRSxhQUFhLENBQUMsRUFBRTtvQ0FDbkMsV0FBVyxFQUFFLGVBQWU7aUNBQzdCLENBQUMsQ0FBQztnQ0FFTCxJQUFJLGFBQWEsRUFBRSxDQUFDO29DQUNsQixNQUFNLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDO3dDQUMzQzs0Q0FDRSxFQUFFLEVBQUUsYUFBYSxDQUFDLEVBQUU7NENBQ3BCLGlCQUFpQixFQUFFLGFBQWEsQ0FBQyxFQUFFOzRDQUNuQyxXQUFXLEVBQUUsZUFBZTs0Q0FDNUIsZ0JBQWdCLEVBQUUsUUFBUTt5Q0FDM0I7cUNBQ0YsQ0FBQyxDQUFDO2dDQUNMLENBQUM7cUNBQU0sQ0FBQztvQ0FDTixNQUFNLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDO3dDQUMzQzs0Q0FDRSxpQkFBaUIsRUFBRSxhQUFhLENBQUMsRUFBRTs0Q0FDbkMsV0FBVyxFQUFFLGVBQWU7NENBQzVCLGdCQUFnQixFQUFFLFFBQVE7eUNBQzNCO3FDQUNGLENBQUMsQ0FBQztnQ0FDTCxDQUFDOzRCQUNILENBQUM7d0JBQ0gsQ0FBQztvQkFDSCxDQUFDO29CQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7d0JBQ2YsTUFBTSxDQUFDLEtBQUssQ0FDViwrQkFBK0IsSUFBSSxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQzNELENBQUM7b0JBQ0osQ0FBQztnQkFDSCxDQUFDO2dCQUVELElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFO29CQUFFLE1BQU07Z0JBQ3ZDLFlBQVksR0FBRyxNQUFNLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsRCxDQUFDO1lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQzdDLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDOUMsd0RBQXdEO1lBQ3hELFlBQVk7WUFDWixxQkFBcUI7WUFDckIsMEJBQTBCO1lBQzFCLFlBQVk7WUFDWixzQ0FBc0M7WUFDdEMsb0RBQW9EO1lBQ3BELE9BQU87WUFDUCxNQUFNO1FBQ1IsQ0FBQztJQUNILENBQUM7SUFFRCx3REFBd0Q7SUFDeEQsWUFBWTtJQUNaLHFCQUFxQjtJQUNyQiwwQkFBMEI7SUFDMUIsWUFBWTtJQUNaLDhCQUE4QjtJQUM5QixzREFBc0Q7SUFDdEQsT0FBTztJQUNQLE1BQU07SUFFTixNQUFNLGFBQWEsQ0FBQyxXQUFXLENBQUM7UUFDOUIsR0FBRyxNQUFNLENBQUMsUUFBUTtRQUNsQixnQkFBZ0IsRUFBRSxLQUFLO0tBQ3hCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FDRixDQUFDIn0=