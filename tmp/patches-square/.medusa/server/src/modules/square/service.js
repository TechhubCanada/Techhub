"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const models_1 = require("./models");
const microservice_1 = __importDefault(require("./utils/microservice"));
const transform_to_square_1 = require("../../workflows/sync/utils/transform-to-square");
const square_instance_1 = require("./utils/square-instance");
const format_data_1 = require("../../providers/square-payment/utils/format-data");
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("./utils/helpers");
class SquareModuleService extends (0, utils_1.MedusaService)({
    SquareConfiguration: models_1.SquareConfiguration,
}) {
    constructor({ logger }) {
        super(...arguments);
        this.logger_ = logger;
    }
    async getActiveConfiguration() {
        const configs = await this.listSquareConfigurations({
            is_active: true,
        });
        if (!configs || configs.length === 0) {
            throw new Error("No active Square configuration found");
        }
        return configs[0];
    }
    async getAccessToken(merchant_id, integration_key) {
        const { data: { access_token }, } = await microservice_1.default.get("/square-oauth/retrieve-token", {
            headers: {
                "x-merchant-id": merchant_id,
                "x-integration-key": integration_key,
            },
        });
        return access_token;
    }
    async getSquareClientInstance() {
        const config = await this.getActiveConfiguration();
        const access_token = await this.getAccessToken(config.merchant_id, config.integration_key);
        return (0, square_instance_1.getSquareClient)(access_token, config.is_sandbox);
    }
    async deleteActiveConfiguration() {
        const configs = await this.listSquareConfigurations({
            is_active: true,
        });
        if (!configs || configs.length === 0) {
            throw new Error("No active Square configuration found");
        }
        const config = configs[0];
        await this.deleteSquareConfigurations({ id: config.id });
    }
    async setActiveConfiguration(merchantId, integrationKey, isSandbox = false) {
        const configs = await this.listSquareConfigurations({
            merchant_id: merchantId,
            is_active: true,
        });
        if (!configs || configs.length === 0) {
            await this.createSquareConfigurations({
                merchant_id: merchantId,
                integration_key: integrationKey,
                location_id: "",
                is_sandbox: isSandbox,
            });
        }
        else {
            const baseConfig = configs[0];
            await this.updateSquareConfigurations({
                id: baseConfig.id,
                merchant_id: merchantId,
                is_sandbox: isSandbox,
            });
        }
    }
    async setActiveLocation(locationId, currency) {
        try {
            const config = await this.getActiveConfiguration();
            await this.updateSquareConfigurations({
                id: config.id,
                location_id: locationId,
                currency,
            });
            this.logger_.info(`Set active location: ${locationId}`);
        }
        catch (error) {
            this.logger_.error(`Failed to set active location: ${error.message}`);
            throw error;
        }
    }
    async setMetadata(data) {
        try {
            const config = await this.getActiveConfiguration();
            await this.updateSquareConfigurations({
                id: config.id,
                metadata: { ...config.metadata, ...data },
            });
            this.logger_.info(`Set metadata: ${JSON.stringify(data)}`);
        }
        catch (error) {
            this.logger_.error(`Failed to set metadata: ${error.message}`);
            throw error;
        }
    }
    async setApplePayDomain(domain) {
        const config = await this.getActiveConfiguration();
        try {
            const response = await microservice_1.default.post("/apple/domain", {
                domain_name: domain,
            }, {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            if (response.data.success === false) {
                this.logger_.error(`Square microservice error: ${response.data.status}`);
                return {
                    success: false,
                    message: response.data.status,
                };
            }
            await this.updateSquareConfigurations({
                id: config.id,
                apple_pay_domain: domain,
            });
            return response.data;
        }
        catch (e) {
            this.logger_.error(`Failed to set Apple Pay domain: ${e.message}`);
            return {
                success: false,
                message: `Failed to set Apple Pay domain: ${e.message}`,
            };
        }
    }
    // Square Sync Methods
    async getInventoryCounts(squareClient, variationIds) {
        const response = await squareClient.inventory.batchGetCounts({
            catalogObjectIds: variationIds,
        });
        return (response.data || []).reduce((acc, count) => {
            acc[count.catalogObjectId] = Number(count.quantity || 0);
            return acc;
        }, {});
    }
    async listSquareCatalog(squareClient, types) {
        const response = await squareClient.catalog.list({
            types: types.join(","),
        });
        return response;
    }
    async listSquareCustomers(squareClient, cursor) {
        const resṕonse = await squareClient.customers.search({
            limit: BigInt(20),
            cursor,
            count: true,
            query: {
                sort: {
                    field: "CREATED_AT",
                    order: "DESC",
                },
            },
        });
        return resṕonse;
    }
    async createOrUpdateCustomer(customer, squareClient) {
        let squareCustomer;
        const customerPayload = {
            givenName: customer?.first_name ?? "",
            familyName: customer.last_name || "",
            emailAddress: customer.email,
            referenceId: customer.id,
            note: "Synced from Medusa",
        };
        try {
            this.logger_.info(`Searching for customer by email: ${customer.email}`);
            const searchResponse = await squareClient.customers.search({
                query: {
                    filter: {
                        emailAddress: {
                            exact: customer.email,
                        },
                    },
                },
            });
            const existingSquareCustomer = searchResponse.customers?.find(Boolean);
            if (existingSquareCustomer?.id) {
                this.logger_.info(`Found existing Square customer by email, updating: ${existingSquareCustomer.id}`);
                const response = await squareClient.customers.update({
                    customerId: existingSquareCustomer.id,
                    version: existingSquareCustomer.version,
                    ...customerPayload,
                });
                squareCustomer = response.customer;
            }
            else {
                this.logger_.info(`Creating new Square customer for: ${customer.email}`);
                const response = await squareClient.customers.create({
                    idempotencyKey: crypto.randomUUID(),
                    ...customerPayload,
                });
                squareCustomer = response.customer;
            }
            return squareCustomer;
        }
        catch (error) {
            this.logger_.error(`Failed to sync customer ${customer.id} to Square: ${error.message}`);
            throw error;
        }
    }
    async syncProductImages(productId, images, squareItemId, squareClient, productService) {
        const currentProduct = await productService.retrieveProduct(productId);
        const existingImageIds = currentProduct.metadata?.square_image_ids || [];
        if (existingImageIds.length > 0) {
            try {
                await squareClient.catalog.batchDelete({
                    objectIds: existingImageIds,
                });
                this.logger_.info(`Deleted ${existingImageIds.length} old images for product ${productId}`);
            }
            catch (error) {
                this.logger_.warn(`Failed to delete some old images for ${productId}: ${error.message}`);
            }
        }
        const newSquareImageIds = [];
        for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i].url;
            try {
                const axiosResponse = await axios_1.default.get(imageUrl, {
                    responseType: "arraybuffer",
                    timeout: 30_000,
                });
                const buffer = Buffer.from(axiosResponse.data);
                const contentType = (0, helpers_1.detectMimeType)(imageUrl);
                const blob = new Blob([buffer], { type: contentType });
                const result = await squareClient.catalog.images.create({
                    request: {
                        idempotencyKey: crypto.randomUUID(),
                        objectId: squareItemId,
                        image: {
                            type: "IMAGE",
                            id: `#${productId}_${i}_${Date.now()}`,
                            imageData: {
                                caption: `${currentProduct.title} – image ${i + 1}`,
                            },
                        },
                    },
                    imageFile: blob,
                });
                if (result.image?.id) {
                    newSquareImageIds.push(result.image.id);
                    this.logger_.info(`Uploaded image ${i + 1}/${images.length} for product ${productId}: ${result.image.id}`);
                }
            }
            catch (error) {
                this.logger_.error(`Failed to upload image ${i} for ${productId}:`, error.message);
            }
        }
        await productService.updateProducts(productId, {
            metadata: {
                ...currentProduct.metadata,
                square_image_ids: newSquareImageIds,
            },
        });
        this.logger_.info(`Synced ${newSquareImageIds.length} images for product ${productId}`);
    }
    async createOrUpdateCategory(category, squareClient, productService) {
        const categoryPayload = (0, transform_to_square_1.transformToSquare)("category", category);
        const squareCategoryResponse = await squareClient.catalog.batchUpsert({
            idempotencyKey: crypto.randomUUID(),
            batches: [{ objects: [{ ...categoryPayload }] }],
        });
        const squareObject = squareCategoryResponse.objects?.find(Boolean);
        if (squareObject) {
            const metadata = (0, format_data_1.FormatData)({
                square_id: squareObject.id,
                square_version: squareObject.version,
            });
            await productService.updateProductCategories(category.id, {
                metadata,
            });
        }
    }
    async createOrUpdateProduct(product, squareClient, productService) {
        const config = await this.getActiveConfiguration();
        const productPayload = (0, transform_to_square_1.transformToSquare)("product", product, config.currency);
        const squareProductResponse = await squareClient.catalog.batchUpsert({
            idempotencyKey: crypto.randomUUID(),
            batches: [{ objects: [{ ...productPayload }] }],
        });
        let squareObject = squareProductResponse.objects?.find(Boolean);
        if (squareObject) {
            const medusaImages = [...(product.images || [])];
            if (medusaImages.length === 0 && product.thumbnail) {
                medusaImages.push({ url: product.thumbnail });
            }
            if (medusaImages.length > 0 && squareObject.id) {
                try {
                    await this.syncProductImages(product.id, medusaImages, squareObject.id, squareClient, productService);
                    const refetchedResult = await squareClient.catalog.object.get({
                        objectId: squareObject.id,
                    });
                    if (refetchedResult.object) {
                        squareObject = refetchedResult.object;
                    }
                }
                catch (imageError) {
                    this.logger_.error(`Image sync failed for product ${product.id}: ${imageError.message}`);
                }
            }
            const productMetadata = {
                ...product.metadata,
                square_id: squareObject?.id,
                square_version: squareObject?.version?.toString(),
            };
            await productService.updateProducts(product.id, {
                metadata: productMetadata,
            });
            if (squareObject?.type === "ITEM") {
                const updates = squareObject?.itemData?.variations?.map(async (variation) => {
                    const variantId = squareProductResponse.idMappings
                        ? squareProductResponse.idMappings.find((item) => item.objectId === variation.id)?.clientObjectId
                        : product?.variants?.find((variant) => variant?.metadata?.square_id === variation?.id)?.id;
                    if (variantId) {
                        const existingVariant = product.variants?.find((v) => v.id === variantId);
                        const existingMetadata = existingVariant?.metadata || {};
                        await productService.updateProductVariants(variantId.replace("#", ""), {
                            metadata: {
                                ...existingMetadata,
                                square_id: variation.id,
                                square_version: variation.version?.toString(),
                            },
                        });
                    }
                });
                if (updates)
                    await Promise.all(updates);
            }
        }
    }
    async createOrUpdateInventory(product, squareClient) {
        const config = await this.getActiveConfiguration();
        const changes = product.variants.map((variant) => {
            return (0, transform_to_square_1.transformInventoryToSquare)(variant, config.location_id);
        });
        await squareClient.inventory.batchCreateChanges({
            idempotencyKey: crypto.randomUUID(),
            changes,
        });
    }
    async deleteCatalogObject(squareId) {
        const squareClient = await this.getSquareClientInstance();
        try {
            const result = await squareClient.catalog.batchDelete({
                objectIds: [squareId],
            });
            this.logger_.info(`Successfully deleted Square object with ID: ${squareId}`);
            return result;
        }
        catch (error) {
            if (error.statusCode === 404) {
                this.logger_.warn(`Square object ${squareId} not found or already deleted.`);
                return { deletedObjectIds: [] };
            }
            this.logger_.error(`Failed to delete Square object ${squareId}: ${error.message}`);
            throw error;
        }
    }
}
exports.default = SquareModuleService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3NxdWFyZS9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBT0EscURBQTBEO0FBQzFELHFDQUErQztBQUMvQyx3RUFBcUQ7QUFDckQsd0ZBR3dEO0FBQ3hELDZEQUEwRDtBQUUxRCxrRkFBOEU7QUFDOUUsa0RBQTBCO0FBQzFCLDZDQUFpRDtBQU1qRCxNQUFNLG1CQUFvQixTQUFRLElBQUEscUJBQWEsRUFBQztJQUM5QyxtQkFBbUIsRUFBbkIsNEJBQW1CO0NBQ3BCLENBQUM7SUFHQSxZQUFZLEVBQUUsTUFBTSxFQUF3QjtRQUMxQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN4QixDQUFDO0lBRUQsS0FBSyxDQUFDLHNCQUFzQjtRQUMxQixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztZQUNsRCxTQUFTLEVBQUUsSUFBSTtTQUNoQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFDRCxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFtQixFQUFFLGVBQXVCO1FBQy9ELE1BQU0sRUFDSixJQUFJLEVBQUUsRUFBRSxZQUFZLEVBQUUsR0FDdkIsR0FBRyxNQUFNLHNCQUFpQixDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRTtZQUM5RCxPQUFPLEVBQUU7Z0JBQ1AsZUFBZSxFQUFFLFdBQVc7Z0JBQzVCLG1CQUFtQixFQUFFLGVBQWU7YUFDckM7U0FDRixDQUFD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