"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrdersListQuerySchema = void 0;
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
const zod_1 = require("zod");
const date_fns_1 = require("date-fns");
const orders_1 = require("../../../../utils/orders");
const luxon_1 = require("luxon");
exports.adminOrdersListQuerySchema = zod_1.z.discriminatedUnion('preset', [
    zod_1.z.object({
        preset: zod_1.z.literal('custom'),
        date_from: zod_1.z.string(),
        date_to: zod_1.z.string(),
    }),
    zod_1.z.object({
        preset: zod_1.z.literal('this-month'),
    }),
    zod_1.z.object({
        preset: zod_1.z.literal('last-month'),
    }),
    zod_1.z.object({
        preset: zod_1.z.literal('last-3-months'),
    }),
]);
const DEFAULT_CURRENCY = 'EUR';
function getPercentChange(current, previous) {
    if (previous === 0)
        return current === 0 ? 0 : 100;
    return Number((((current - previous) / previous) * 100).toFixed(2));
}
async function GET(req, res) {
    const result = exports.adminOrdersListQuerySchema.safeParse(req.query);
    if (!result.success) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, result.error.errors.map((err) => err.message).join(', '));
    }
    const validatedQuery = result.data;
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const storeModuleService = req.scope.resolve(utils_1.Modules.STORE);
    const cacheModuleService = req.scope.resolve(utils_1.Modules.CACHE);
    const fetchOrders = async (dateRange) => {
        const { data: orders } = await query.graph({
            entity: 'order',
            fields: [
                'id',
                'total',
                'created_at',
                'status',
                'currency_code',
                'region.name',
            ],
            pagination: {
                order: {
                    created_at: 'asc',
                },
            },
            filters: {
                created_at: {
                    $gte: dateRange.from + 'T00:00:00Z',
                    $lte: dateRange.to + 'T23:59:59.999Z',
                },
                status: { $nin: ['draft'] },
            },
        });
        return orders;
    };
    const stores = await storeModuleService.listStores({}, { relations: ['supported_currencies'] });
    const store = stores?.[0];
    const currencyCode = store?.supported_currencies
        ?.find((c) => c.is_default)
        ?.currency_code?.toUpperCase() || DEFAULT_CURRENCY;
    const cacheKey = `exchange_rates_${currencyCode}`;
    let exchangeRates = await cacheModuleService.get(cacheKey);
    if (!exchangeRates) {
        const response = await fetch(`https://api.frankfurter.dev/v1/latest?base=${currencyCode}`);
        exchangeRates = await response.json();
        const now = luxon_1.DateTime.now().setZone('Europe/Berlin');
        let expireAt = now.set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
        if (now >= expireAt) {
            expireAt = expireAt.plus({ days: 1 });
        }
        const ttl = Math.floor(expireAt.diff(now, 'seconds').seconds);
        await cacheModuleService.set(cacheKey, exchangeRates, ttl);
    }
    const calculateDateRange = orders_1.calculateDateRangeMethod[validatedQuery.preset];
    if (!calculateDateRange) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, 'Invalid preset value');
    }
    const { current, previous, days } = calculateDateRange(validatedQuery);
    const currentFrom = (0, date_fns_1.format)(current.start, 'yyyy-MM-dd');
    const currentTo = (0, date_fns_1.format)(current.end, 'yyyy-MM-dd');
    const previousFrom = (0, date_fns_1.format)(previous.start, 'yyyy-MM-dd');
    const previousTo = (0, date_fns_1.format)(previous.end, 'yyyy-MM-dd');
    const orders = await fetchOrders({
        from: currentFrom,
        to: currentTo,
    });
    const prevRangeOrders = await fetchOrders({
        from: previousFrom,
        to: previousTo,
    });
    let groupBy = 'day';
    if (days > 120) {
        groupBy = 'month';
    }
    else if (days > 30) {
        groupBy = 'week';
    }
    const keyRange = (0, orders_1.getAllDateGroupingKeys)(groupBy, currentFrom, currentTo);
    let regions = {};
    let totalSales = 0;
    let statuses = {};
    const groupedByKey = {};
    for (const order of orders) {
        const exchangeRate = order.currency_code.toUpperCase() !== currencyCode
            ? exchangeRates?.rates[order.currency_code.toUpperCase()]
            : 1;
        const orderTotal = new utils_1.BigNumber(order.total).numeric / exchangeRate;
        const key = (0, orders_1.getDateGroupingKey)(new Date(order.created_at), groupBy, currentFrom, currentTo);
        if (!groupedByKey[key]) {
            groupedByKey[key] = { orderCount: 0, sales: 0 };
        }
        groupedByKey[key].orderCount += 1;
        groupedByKey[key].sales += orderTotal;
        totalSales += orderTotal;
        if (order.region?.name) {
            regions[order.region.name] =
                (regions[order.region.name] ?? 0) + orderTotal;
        }
        if (order.status) {
            statuses[order.status] = (statuses[order.status] ?? 0) + 1;
        }
    }
    let prevTotalSales = 0;
    for (const order of prevRangeOrders) {
        const exchangeRate = order.currency_code.toUpperCase() !== currencyCode
            ? exchangeRates?.rates[order.currency_code.toUpperCase()]
            : 1;
        const orderTotal = new utils_1.BigNumber(order.total).numeric / exchangeRate;
        prevTotalSales += orderTotal;
    }
    const prevTotalOrders = prevRangeOrders.length;
    const percentOrders = getPercentChange(orders.length, prevTotalOrders);
    const percentSales = getPercentChange(totalSales, prevTotalSales);
    const salesArray = keyRange.map((date) => ({
        name: date,
        sales: groupedByKey[date]?.sales ?? 0,
    }));
    const orderCountArray = keyRange.map((date) => ({
        name: date,
        count: groupedByKey[date]?.orderCount ?? 0,
    }));
    const regionsArray = Object.entries(regions)
        .map(([region, amount]) => ({
        name: region,
        sales: Number(amount.toFixed(2)),
    }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);
    const statusesArray = Object.entries(statuses).map(([status, count]) => ({
        name: status,
        count,
    }));
    const orderData = {
        total_orders: orders.length,
        prev_orders_percent: percentOrders,
        regions: regionsArray,
        total_sales: totalSales,
        prev_sales_percent: percentSales,
        statuses: statusesArray,
        order_sales: salesArray,
        order_count: orderCountArray,
        currency_code: currencyCode,
    };
    res.json(orderData);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2FnaWxvLWFuYWx5dGljcy9vcmRlcnMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBdUNBLGtCQXVNQztBQTdPRCxxREFLbUM7QUFDbkMsNkJBQXdCO0FBQ3hCLHVDQUFrQztBQUNsQyxxREFJa0M7QUFDbEMsaUNBQWlDO0FBRXBCLFFBQUEsMEJBQTBCLEdBQUcsT0FBQyxDQUFDLGtCQUFrQixDQUFDLFFBQVEsRUFBRTtJQUN2RSxPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsTUFBTSxFQUFFLE9BQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQzNCLFNBQVMsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3JCLE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0tBQ3BCLENBQUM7SUFDRixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsTUFBTSxFQUFFLE9BQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0tBQ2hDLENBQUM7SUFDRixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsTUFBTSxFQUFFLE9BQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0tBQ2hDLENBQUM7SUFDRixPQUFDLENBQUMsTUFBTSxDQUFDO1FBQ1AsTUFBTSxFQUFFLE9BQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0tBQ25DLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFDSCxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQztBQUUvQixTQUFTLGdCQUFnQixDQUFDLE9BQWUsRUFBRSxRQUFnQjtJQUN6RCxJQUFJLFFBQVEsS0FBSyxDQUFDO1FBQUUsT0FBTyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUNuRCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FB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