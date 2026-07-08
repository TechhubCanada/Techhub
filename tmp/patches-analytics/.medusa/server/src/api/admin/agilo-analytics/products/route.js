"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductAnalyticsQuerySchema = void 0;
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
const DEFAULT_THRESHOLD = 5;
exports.adminProductAnalyticsQuerySchema = zod_1.z.object({
    date_from: zod_1.z.string(),
    date_to: zod_1.z.string(),
});
async function GET(req, res) {
    const result = exports.adminProductAnalyticsQuerySchema.safeParse(req.query);
    if (!result.success) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, result.error.errors.map((err) => err.message).join(', '));
    }
    const validatedQuery = result.data;
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const productService = req.scope.resolve(utils_1.Modules.PRODUCT);
    const inventoryService = req.scope.resolve(utils_1.Modules.INVENTORY);
    const config = req.scope.resolve(utils_1.ContainerRegistrationKeys.CONFIG_MODULE);
    const pluginConfig = config.plugins.find((p) => typeof p === 'string'
        ? p === '@agilo/medusa-analytics-plugin'
        : p.resolve === '@agilo/medusa-analytics-plugin');
    const threshold = typeof pluginConfig === 'string'
        ? DEFAULT_THRESHOLD
        : pluginConfig?.options?.stock_threshold || DEFAULT_THRESHOLD;
    const { data: orders } = await query.graph({
        entity: 'order',
        fields: [
            'id',
            'items.quantity',
            'items.variant.id',
            'items.variant.title',
            'items.product.title',
            'items.*',
        ],
        pagination: {
            order: {
                created_at: 'asc',
            },
        },
        filters: {
            created_at: {
                $gte: validatedQuery.date_from + 'T00:00:00Z',
                $lte: validatedQuery.date_to + 'T23:59:59.999Z',
            },
            status: { $nin: ['draft'] },
        },
    });
    let variantQuantitySold = {};
    orders.forEach((o) => {
        o.items?.forEach((i) => {
            if (i?.variant?.id) {
                if (!variantQuantitySold[i?.variant?.id]) {
                    variantQuantitySold[i?.variant.id] = {
                        title: i.product?.title + ' ' + i.variant.title,
                        quantity: 0,
                    };
                }
                variantQuantitySold[i.variant.id].quantity += i.quantity;
            }
        });
    });
    const sortedVariantQuantitySold = Object.values(variantQuantitySold)
        .map(({ title, quantity }) => ({ title, quantity }))
        .sort((a, b) => b.quantity - a.quantity);
    const inventoryLevel = await inventoryService.listInventoryLevels({
        stocked_quantity: { $lte: threshold },
    }, { select: ['id', 'inventory_item_id', 'stocked_quantity'] });
    const inventoryItems = await inventoryService.listInventoryItems({
        id: inventoryLevel.map((i) => i.inventory_item_id),
    }, { select: ['id', 'sku'] });
    const productVariants = await productService.listProductVariants({
        sku: inventoryItems
            .map((i) => i.sku)
            .filter((i) => i !== undefined && i !== null),
    }, { select: ['id', 'title', 'sku', 'product_id'] });
    const quantityByItemId = {};
    inventoryLevel.forEach((level) => {
        quantityByItemId[level?.inventory_item_id] = level.stocked_quantity;
    });
    const quantityBySku = {};
    inventoryItems.forEach((item) => {
        if (item.sku) {
            quantityBySku[item.sku] = quantityByItemId[item.id];
        }
    });
    const lowStockVariants = [];
    productVariants.forEach((variant) => {
        if (variant.sku) {
            lowStockVariants.push({
                sku: variant.sku,
                inventoryQuantity: quantityBySku[variant.sku],
                variantName: variant.title,
                productId: variant.product_id || '',
                variantId: variant.id,
            });
        }
    });
    res.json({
        lowStockVariants,
        variantQuantitySold: sortedVariantQuantitySold.slice(0, 10),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2FnaWxvLWFuYWx5dGljcy9wcm9kdWN0cy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFlQSxrQkErSEM7QUE3SUQscURBSW1DO0FBQ25DLDZCQUF3QjtBQUV4QixNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUVmLFFBQUEsZ0NBQWdDLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN2RCxTQUFTLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNyQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtDQUNwQixDQUFDLENBQUM7QUFFSSxLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxNQUFNLEdBQUcsd0NBQWdDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLE1BQU0sSUFBSSxtQkFBVyxDQUNuQixtQkFBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FDekQsQ0FBQztJQUNKLENBQUM7SUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ25DLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pFLE1BQU0sY0FBYyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxN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