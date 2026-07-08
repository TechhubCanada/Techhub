"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformVariantToMedusa = exports.transformProductToMedusa = exports.transformCategoryToMedusa = exports.transformCustomerToMedusa = void 0;
const transformCustomerToMedusa = (squareCustomer) => {
    return {
        email: squareCustomer?.emailAddress?.toLowerCase(),
        first_name: squareCustomer.givenName || "",
        last_name: squareCustomer.familyName || "",
        phone: squareCustomer.phoneNumber || null,
        metadata: {
            square_id: squareCustomer.id,
            square_version: squareCustomer.version?.toString(),
            is_guest: true,
        },
    };
};
exports.transformCustomerToMedusa = transformCustomerToMedusa;
const transformCategoryToMedusa = (obj, parentId) => {
    const name = obj?.categoryData?.name ?? "";
    return {
        name,
        handle: obj.id,
        is_active: true,
        is_internal: false,
        parent_category_id: parentId,
        metadata: {
            square_id: obj.id,
            square_version: obj.version?.toString(),
        },
    };
};
exports.transformCategoryToMedusa = transformCategoryToMedusa;
const transformProductToMedusa = ({ item, imageMap, medusaCategoryId, variantsData, }) => {
    const optionsMap = new Map();
    variantsData.forEach((variant) => {
        Object.entries(variant.options || {}).forEach(([title, value]) => {
            if (!optionsMap.has(title)) {
                optionsMap.set(title, new Set());
            }
            optionsMap.get(title)?.add(value);
        });
    });
    const productOptions = Array.from(optionsMap.entries()).map(([title, values]) => ({
        title,
        values: Array.from(values),
    }));
    const finalOptions = productOptions.length > 0
        ? productOptions
        : [{ title: "Variation", values: ["Standard"] }];
    return {
        title: item.itemData?.name || "Untitled Product",
        description: item.itemData?.description || "",
        status: "published",
        options: finalOptions,
        images: (item.itemData?.imageIds || [])
            .map((id) => imageMap.get(id))
            .filter(Boolean)
            .map((url) => ({ url })),
        categories: medusaCategoryId ? [{ id: medusaCategoryId }] : [],
        metadata: {
            square_id: item.id,
            square_version: item.version?.toString(),
        },
        variants: variantsData,
    };
};
exports.transformProductToMedusa = transformProductToMedusa;
const transformVariantToMedusa = ({ variant, existingProduct, optionsMapping, }) => {
    const existingVariant = existingProduct?.variants?.find((mv) => mv.metadata?.square_id === variant.id);
    const options = {};
    const optionValues = variant.itemVariationData?.itemOptionValues || [];
    if (optionValues.length > 0) {
        optionValues.forEach((optionValue, index) => {
            const optionName = optionsMapping.get(optionValue.itemOptionId) || `Option ${index + 1}`;
            const rawName = variant.itemVariationData?.name || "";
            const segments = rawName.split(",").map((s) => s.trim());
            options[optionName] = segments[index] || "Default";
        });
    }
    else {
        const variantName = variant.itemVariationData?.name || "Standard";
        options["Variation"] = variantName;
    }
    return {
        ...(existingVariant ? { id: existingVariant.id } : {}),
        title: variant.itemVariationData?.name || "Default Variant",
        sku: variant.itemVariationData?.sku || `SQ-${variant.id}`,
        manage_inventory: true,
        options,
        metadata: {
            square_id: variant.id,
            square_version: variant.version?.toString(),
        },
        prices: [
            {
                amount: Number(variant.itemVariationData?.priceMoney?.amount || 0) / 100,
                currency_code: variant.itemVariationData?.priceMoney?.currency?.toLowerCase() ||
                    "usd",
            },
        ],
    };
};
exports.transformVariantToMedusa = transformVariantToMedusa;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLXRvLW1lZHVzYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy93b3JrZmxvd3Mvc3luYy91dGlscy90cmFuc2Zvcm0tdG8tbWVkdXNhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUdPLE1BQU0seUJBQXlCLEdBQUcsQ0FBQyxjQUErQixFQUFFLEVBQUU7SUFDM0UsT0FBTztRQUNMLEtBQUssRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRTtRQUNsRCxVQUFVLEVBQUUsY0FBYyxDQUFDLFNBQVMsSUFBSSxFQUFFO1FBQzFDLFNBQVMsRUFBRSxjQUFjLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDMUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxXQUFXLElBQUksSUFBSTtRQUN6QyxRQUFRLEVBQUU7WUFDUixTQUFTLEVBQUUsY0FBYyxDQUFDLEVBQUU7WUFDNUIsY0FBYyxFQUFFLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO1lBQ2xELFFBQVEsRUFBRSxJQUFJO1NBQ2Y7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBWlcsUUFBQSx5QkFBeUIsNkJBWXBDO0FBRUssTUFBTSx5QkFBeUIsR0FBRyxDQUN2QyxHQUFpQyxFQUNqQyxRQUF1QixFQUN2QixFQUFFO0lBQ0YsTUFBTSxJQUFJLEdBQUcsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFLLElBQUksRUFBRSxDQUFDO0lBQzVDLE9BQU87UUFDTCxJQUFJO1FBQ0osTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1FBQ2QsU0FBUyxFQUFFLElBQUk7UUFDZixXQUFXLEVBQUUsS0FBSztRQUNsQixrQkFBa0IsRUFBRSxRQUFRO1FBQzVCLFFBQVEsRUFBRTtZQUNSLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNqQixjQUFjLEVBQUUsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7U0FDeEM7S0FDRixDQUFDO0FBQ0os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