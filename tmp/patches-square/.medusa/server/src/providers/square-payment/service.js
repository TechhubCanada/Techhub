"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const framework_1 = require("@medusajs/framework");
const utils_1 = require("@medusajs/framework/utils");
const crypto_1 = require("crypto");
const microservice_1 = __importDefault(require("../../modules/square/utils/microservice"));
const square_instance_1 = require("../../modules/square/utils/square-instance");
const get_square_config_1 = require("../../workflows/get-square-config");
const format_data_1 = require("./utils/format-data");
const texts = {
    invalidData: "Invalid data, please update your Square credentials before continuing.",
    setupCompleted: "Square setup completed successfully ✅",
    initiatePayment: "Session Payment initiated - {0}",
    authorizePayment: "Authorize Payment initiated - {0}",
    authorizePaymentResponse: "Authorize Payment Square - {0} - Status {1}",
    capturePayment: "Capture Payment initiated - {0}",
    capturePaymentResponse: "Capture Payment Square - {0} - Status {1}",
    cancelPayment: "Cancel Payment initiated - {0}",
    cancelPaymentResponse: "Cancel Payment Square - {0} - Status {1}",
    updatePayment: "Update Payment initiated - {0}",
    updatePaymentResponse: "Update Payment Square - {0} - Status {1}",
    retrievePaymentResponse: "Retrieve Payment Square - {0} - Status {1}",
};
class SquarePaymentProviderService extends utils_1.AbstractPaymentProvider {
    constructor(container) {
        super(container, {});
        this.logger_ = container.logger;
        this.container_ = container;
        this.query_ = framework_1.container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    }
    async getActiveConfiguration() {
        const { result } = await (0, get_square_config_1.getSquareConfigWorkflow)(this.container_).run({
            input: undefined,
        });
        return result;
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
    async getCurrentCart(id) {
        const { data: [queryCart], } = await this.query_.graph({
            entity: "cart",
            filters: { id },
            fields: [
                "*",
                "customer.*",
                "region.id",
                "shipping_address.*",
                "shipping_methods.*",
                "payment_collection.*",
                "payment_collection.payments.*",
                "billing_address.*",
                "items.*",
                "customer_id",
                "metadata",
                "total",
            ],
        });
        return queryCart;
    }
    async initiatePayment(input) {
        if (!input?.data?.cart_id) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "cart_id is required");
        }
        this.logger_.info(texts.initiatePayment.replace("{0}", input?.data?.session_id ?? ""));
        const idempotencyKey = (0, crypto_1.randomUUID)();
        const id = input?.data?.session_id ?? idempotencyKey;
        return {
            id,
            data: {
                idempotencyKey,
                amount: input.amount,
                currency_code: input.currency_code.toUpperCase(),
                ...input.data,
            },
        };
    }
    async authorizePayment(input) {
        this.logger_.info(texts.authorizePayment.replace("{0}", input?.data?.session_id ?? ""));
        const _input = (0, format_data_1.FormatData)(input);
        if (_input?.data?.idempotencyKey &&
            _input?.data?.token?.token &&
            _input?.data?.currency_code &&
            _input?.data?.amount) {
            const config = await this.getActiveConfiguration();
            const syncOrders = config?.metadata?.sync_orders;
            let squareOrderId;
            if (syncOrders) {
                const access_token = await this.getAccessToken(config.merchant_id, config.integration_key);
                const cart = await this.getCurrentCart(input?.data?.cart_id);
                const shipingMethod = cart?.shipping_methods?.find(Boolean);
                const squareClient = (0, square_instance_1.getSquareClient)(access_token, config.is_sandbox);
                const { order } = await squareClient.orders.create({
                    idempotencyKey: (0, crypto_1.randomUUID)(),
                    order: {
                        locationId: config.location_id,
                        state: "OPEN",
                        //customerId: customerSquare.id,
                        referenceId: input?.data?.cart_id,
                        lineItems: cart?.items?.map((item) => ({
                            name: item.title,
                            quantity: `${item.quantity}`,
                            basePriceMoney: {
                                amount: BigInt(Number((Number(item.unit_price.toFixed(2)) * 100).toFixed(2))),
                                currency: _input?.data?.currency_code,
                            },
                        })),
                        serviceCharges: [
                            {
                                uid: (0, crypto_1.randomUUID)(),
                                name: "Shipping",
                                calculationPhase: "SUBTOTAL_PHASE",
                                amountMoney: {
                                    amount: BigInt(Number((Number(shipingMethod?.amount?.toFixed(2) ?? 0) * 100).toFixed(2))),
                                    currency: _input?.data?.currency_code,
                                },
                            },
                        ],
                    },
                });
                squareOrderId = order?.id;
            }
            const amount = Number((Number(_input?.data?.amount?.toFixed(2) ?? 0) * 100).toFixed(0));
            const payload = {
                idempotency_key: _input?.data?.idempotencyKey,
                source_id: _input?.data?.token?.token,
                location_id: config.location_id,
                amount_money: {
                    currency: _input?.data?.currency_code,
                    amount: amount, //square works with cents
                },
                autocomplete: true,
            };
            if (syncOrders && squareOrderId)
                payload["order_id"] = squareOrderId;
            const { data: payment } = await microservice_1.default.post("/payments/", (0, format_data_1.FormatData)(payload), {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            this.logger_.info(texts.authorizePaymentResponse
                .replace("{0}", input?.data?.session_id ?? "")
                .replace("{1}", payment?.status ?? ""));
            return {
                status: "captured",
                data: {
                    ..._input.data,
                    squareOrderId,
                    payment: (0, format_data_1.FormatData)(payment),
                },
            };
        }
        return {
            status: "error",
            data: _input.data,
        };
    }
    async capturePayment(input) {
        this.logger_.info(texts.capturePayment.replace("{0}", input?.data?.session_id ?? ""));
        const paymentData = input?.data?.payment;
        if (paymentData && paymentData?.id && paymentData?.status === "APPROVED") {
            const config = await this.getActiveConfiguration();
            this.logger_.info(`/payments/${paymentData.id}/complete`);
            const { data: payment } = await microservice_1.default.post(`/payments/${paymentData.id}/complete`, {}, {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            this.logger_.info(texts.capturePaymentResponse
                .replace("{0}", input?.data?.session_id ?? "")
                .replace("{1}", payment?.status ?? ""));
            return {
                data: {
                    ...input.data,
                    payment: (0, format_data_1.FormatData)(payment),
                },
            };
        }
        return { ...input };
    }
    async cancelPayment(input) {
        this.logger_.info(texts.cancelPayment.replace("{0}", input?.data?.session_id ?? ""));
        const paymentData = input?.data?.payment;
        if (paymentData && paymentData?.id && paymentData?.status === "APPROVED") {
            const config = await this.getActiveConfiguration();
            const { data: payment } = await microservice_1.default.post(`/payments/${paymentData.id}/cancel`, {}, {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            this.logger_.info(texts.cancelPaymentResponse
                .replace("{0}", input?.data?.session_id ?? "")
                .replace("{1}", payment?.status ?? ""));
            return {
                data: {
                    ...input.data,
                    payment: (0, format_data_1.FormatData)(payment),
                },
            };
        }
        return { ...input };
    }
    async updatePayment(input) {
        this.logger_.info(texts.updatePayment.replace("{0}", input?.data?.session_id ?? ""));
        const paymentData = input?.data?.payment;
        if (input.data &&
            paymentData &&
            input.currency_code &&
            input.data.idempotencyKey &&
            paymentData?.id &&
            paymentData?.status === "APPROVED") {
            const config = await this.getActiveConfiguration();
            const amount = (Number(input.amount) * 100).toFixed(2);
            const { data: payment } = await microservice_1.default.patch(`/payments/${paymentData.id}`, {
                paymentId: paymentData.id,
                idempotencyKey: input.data.idempotencyKey,
                payment: {
                    amountMoney: {
                        amount: BigInt(Number(amount)), //square works with cents
                        currency: input.currency_code.toUpperCase(),
                    },
                },
            }, {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            this.logger_.info(texts.updatePaymentResponse
                .replace("{0}", input?.data?.session_id ?? "")
                .replace("{1}", payment?.status ?? ""));
            return {
                data: {
                    ...input.data,
                    payment: (0, format_data_1.FormatData)(payment),
                },
            };
        }
        return { ...input };
    }
    async getPaymentStatus(input) {
        const paymentData = input?.data?.payment;
        if (paymentData && paymentData?.id) {
            const config = await this.getActiveConfiguration();
            const { data: payment } = await microservice_1.default.get(`/payments/${paymentData.id}`, {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            switch (payment?.status) {
                case "APPROVED":
                    return { status: "authorized" };
                case "PENDING":
                    return { status: "pending" };
                case "COMPLETED":
                    return { status: "captured" };
                case "CANCELED":
                    return { status: "canceled" };
                case "FAILED":
                    return { status: "error" };
                default:
                    return { status: "pending" };
            }
        }
        return {
            status: "pending",
        };
    }
    async retrievePayment(input) {
        const paymentData = input?.data?.payment;
        if (paymentData && paymentData?.id) {
            const config = await this.getActiveConfiguration();
            const { data: payment } = await microservice_1.default.get(`/payments/${paymentData.id}`, {
                headers: {
                    "x-merchant-id": config.merchant_id,
                    "x-integration-key": config.integration_key,
                },
            });
            this.logger_.info(texts.retrievePaymentResponse
                .replace("{0}", input?.data?.session_id ?? "")
                .replace("{1}", payment?.status ?? ""));
            return {
                data: {
                    ...input.data,
                    payment: (0, format_data_1.FormatData)(payment),
                },
            };
        }
        return { data: {} };
    }
    //Not implemented
    async deletePayment(input) {
        return { data: {} };
    }
    //Not implemented
    async refundPayment(input) {
        return { data: {} };
    }
    //Not implemented
    async getWebhookActionAndData(payload) {
        return { action: "not_supported" };
    }
}
SquarePaymentProviderService.identifier = "square";
exports.default = SquarePaymentProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9wcm92aWRlcnMvc3F1YXJlLXBheW1lbnQvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1EQUFtRTtBQW9CbkUscURBSW1DO0FBRW5DLG1DQUFvQztBQUVwQywyRkFBd0U7QUFDeEUsZ0ZBQTZFO0FBQzdFLHlFQUE0RTtBQU01RSxxREFBaUQ7QUFFakQsTUFBTSxLQUFLLEdBQUc7SUFDWixXQUFXLEVBQ1Qsd0VBQXdFO0lBQzFFLGNBQWMsRUFBRSx1Q0FBdUM7SUFDdkQsZUFBZSxFQUFFLGlDQUFpQztJQUNsRCxnQkFBZ0IsRUFBRSxtQ0FBbUM7SUFDckQsd0JBQXdCLEVBQUUsNkNBQTZDO0lBQ3ZFLGNBQWMsRUFBRSxpQ0FBaUM7SUFDakQsc0JBQXNCLEVBQUUsMkNBQTJDO0lBQ25FLGFBQWEsRUFBRSxnQ0FBZ0M7SUFDL0MscUJBQXFCLEVBQUUsMENBQTBDO0lBQ2pFLGFBQWEsRUFBRSxnQ0FBZ0M7SUFDL0MscUJBQXFCLEVBQUUsMENBQTBDO0lBQ2pFLHVCQUF1QixFQUFFLDRDQUE0QztDQUN0RSxDQUFDO0FBRUYsTUFBTSw0QkFBNkIsU0FBUSwrQkFFMUM7SUFNQyxZQUFZLFNBQStCO1FBQ3pDLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcscUJBQWUsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVPLEtBQUssQ0FBQyxzQkFBc0I7UUFDbEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sSUFBQSwyQ0FBdUIsRUFDOUMsSUFBSSxDQUFDLFVBQWlC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