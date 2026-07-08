"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformToSquare = exports.transformInventoryToSquare = void 0;
const transformInventoryToSquare = (variant, squareLocationId) => {
    const totalQuantity = variant?.inventory_items?.reduce((acc, item) => {
        const location = item?.inventory?.location_levels?.find(Boolean);
        return acc + (location?.available_quantity || 0);
    }, 0) || 0;
    return {
        type: "PHYSICAL_COUNT",
        physicalCount: {
            catalogObjectId: variant?.metadata?.square_id,
            locationId: squareLocationId,
            state: "IN_STOCK",
            quantity: totalQuantity.toString(),
            occurredAt: new Date().toISOString(),
        },
    };
};
exports.transformInventoryToSquare = transformInventoryToSquare;
const transformToSquare = (entity, data, currency_code = "USD") => {
    if (entity === "category") {
        const category = data;
        const categoryObject = {
            type: "CATEGORY",
            id: category?.metadata?.square_id || `#${category.id}`,
            version: category?.metadata?.square_version
                ? BigInt(category?.metadata?.square_version)
                : undefined,
            categoryData: {
                name: category?.name,
            },
        };
        if (category?.parent_category?.metadata?.square_id) {
            categoryObject["categoryData"]["parentCategory"] = {
                id: category?.parent_category?.metadata?.square_id,
            };
        }
        return categoryObject;
    }
    const product = data;
    const category = product?.categories?.[0];
    return {
        type: "ITEM",
        id: product?.metadata?.square_id || `#${product.id}`,
        version: product?.metadata?.square_version
            ? BigInt(product?.metadata?.square_version)
            : undefined,
        itemData: {
            name: product?.title,
            description: product?.description || "",
            categories: category?.metadata?.square_id
                ? [
                    {
                        id: category?.metadata?.square_id || undefined,
                    },
                ]
                : undefined,
            variations: product.variants?.map((v) => {
                const price = v.prices.find((price) => price?.currency_code?.toUpperCase() === currency_code);
                const priceAmount = price?.amount;
                return {
                    type: "ITEM_VARIATION",
                    id: v?.metadata?.square_id || `#${v.id}`,
                    version: v?.metadata?.square_version
                        ? BigInt(v?.metadata?.square_version)
                        : undefined,
                    itemVariationData: {
                        name: v?.title,
                        sku: v?.sku || undefined,
                        pricingType: "FIXED_PRICING",
                        priceMoney: {
                            amount: priceAmount
                                ? BigInt(Number(Number(priceAmount * 100).toFixed(2)))
                                : BigInt(0),
                            currency: currency_code,
                        },
                        trackInventory: v.manage_inventory,
                    },
                };
            }),
        },
    };
};
exports.transformToSquare = transformToSquare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLXRvLXNxdWFyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3luYy91dGlscy90cmFuc2Zvcm0tdG8tc3F1YXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdPLE1BQU0sMEJBQTBCLEdBQUcsQ0FDeEMsT0FBWSxFQUNaLGdCQUF3QixFQUNBLEVBQUU7SUFDMUIsTUFBTSxhQUFhLEdBQ2pCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzdDLE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRSxPQUFPLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxrQkFBa0IsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2IsT0FBTztRQUNMLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsYUFBYSxFQUFFO1lBQ2IsZUFBZSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsU0FBbUI7WUFDdkQsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixLQUFLLEVBQUUsVUFBVTtZQUNqQixRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVEsRUFBRTtZQUNsQyxVQUFVLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7U0FDckM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBbkJXLFFBQUEsMEJBQTBCLDhCQW1CckM7QUFFSyxNQUFNLGlCQUFpQixHQUFHLENBQy9CLE1BQThCLEVBQzlCLElBQVMsRUFDVCxnQkFBaUMsS0FBSyxFQUNoQixFQUFFO0lBQ3hCLElBQUksTUFBTSxLQUFLLFVBQVUsRUFBRSxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLElBQTBCLENBQUM7UUFD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