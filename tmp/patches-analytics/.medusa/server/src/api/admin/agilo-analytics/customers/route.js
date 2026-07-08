"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCustomerAnalyticsQuerySchema = void 0;
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
const date_fns_1 = require("date-fns");
const zod_1 = require("zod");
const orders_1 = require("../../../../utils/orders");
const luxon_1 = require("luxon");
exports.adminCustomerAnalyticsQuerySchema = zod_1.z.object({
    date_from: zod_1.z.string(),
    date_to: zod_1.z.string(),
});
const DEFAULT_CURRENCY = 'EUR';
async function GET(req, res) {
    const result = exports.adminCustomerAnalyticsQuerySchema.safeParse(req.query);
    const query = req.scope.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const storeModuleService = req.scope.resolve(utils_1.Modules.STORE);
    const cacheModuleService = req.scope.resolve(utils_1.Modules.CACHE);
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
    if (!result.success) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, result.error.errors.map((err) => err.message).join(', '));
    }
    const { data: orders } = await query.graph({
        entity: 'order',
        fields: [
            'id',
            'created_at',
            'customer.*',
            'customer.orders.*',
            'currency_code',
            'customer.groups.*',
            'total',
        ],
        filters: {
            created_at: {
                $gte: result.data.date_from + 'T00:00:00Z',
                $lte: result.data.date_to + 'T23:59:59.999Z',
            },
            status: { $nin: ['draft', 'canceled'] },
        },
    });
    const customers = Object.values(orders.reduce((acc, { customer }) => {
        if (customer && !acc[customer.id]) {
            acc[customer.id] = customer;
        }
        return acc;
    }, {}));
    const newCustomers = customers.filter((customer) => customer &&
        typeof customer === 'object' &&
        'orders' in customer &&
        Array.isArray(customer.orders) &&
        customer?.orders?.every((order) => new Date(order.created_at) >=
            new Date(result.data.date_from + 'T00:00:00Z')));
    const calculateDateRange = orders_1.calculateDateRangeMethod['custom'];
    if (!calculateDateRange) {
        throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, 'Invalid preset value');
    }
    const { days, current } = calculateDateRange({
        ...result.data,
        preset: 'custom',
    });
    const currentFrom = (0, date_fns_1.format)(current.start, 'yyyy-MM-dd');
    const currentTo = (0, date_fns_1.format)(current.end, 'yyyy-MM-dd');
    let groupBy = 'day';
    if (days > 120) {
        groupBy = 'month';
    }
    else if (days > 30) {
        groupBy = 'week';
    }
    const keyRange = (0, orders_1.getAllDateGroupingKeys)(groupBy, currentFrom, currentTo);
    const groupedByKey = {};
    const customerGroup = {};
    const customerSales = {};
    for (const order of orders) {
        const exchangeRate = order.currency_code.toUpperCase() !== currencyCode
            ? exchangeRates?.rates[order.currency_code.toUpperCase()]
            : 1;
        const orderTotal = new utils_1.BigNumber(order.total).numeric / exchangeRate;
        const key = (0, orders_1.getDateGroupingKey)(new Date(order.created_at), groupBy, currentFrom, currentTo);
        if (!groupedByKey[key]) {
            groupedByKey[key] = {
                returningCustomers: new Set(),
                newCustomers: new Set(),
            };
        }
        if (order.customer &&
            order.customer.id &&
            newCustomers.some((c) => c && typeof c === 'object' && 'id' in c && c.id === order.customer.id)) {
            groupedByKey[key].newCustomers.add(order.customer.id);
        }
        else if (order.customer && order.customer.id) {
            groupedByKey[key].returningCustomers.add(order.customer.id);
        }
        if (order.customer?.groups?.length) {
            for (const group of order.customer.groups) {
                if (!customerGroup[group.name]) {
                    customerGroup[group.name] = 0;
                }
                customerGroup[group.name] += orderTotal;
            }
        }
        else {
            if (!customerGroup['No Group']) {
                customerGroup['No Group'] = 0;
            }
            customerGroup['No Group'] += orderTotal;
        }
        if (order?.customer?.id && !customerSales[order.customer.id]) {
            customerSales[order.customer.id] = {
                sales: 0,
                name: (order.customer?.first_name || '') +
                    ' ' +
                    (order.customer?.last_name || ''),
                groups: order.customer?.groups?.map((g) => g.name) || [],
                count: 0,
                last_order: new Date(order.created_at),
                email: order.customer?.email || '',
            };
        }
        if (order.customer?.id) {
            customerSales[order.customer.id].sales += orderTotal;
            customerSales[order.customer.id].count += 1;
            if (new Date(order.created_at) > customerSales[order.customer.id].last_order) {
                customerSales[order.customer.id].last_order = new Date(order.created_at);
            }
        }
    }
    const customerCountArray = keyRange.map((date) => ({
        name: date,
        returning_customers: groupedByKey[date]?.returningCustomers.size || 0,
        new_customers: groupedByKey[date]?.newCustomers.size || 0,
    }));
    const customerGroupArray = Object.entries(customerGroup).map(([name, total]) => ({
        name,
        total,
    }));
    const customerSalesArray = Object.entries(customerSales)
        .map(([customerId, customer]) => ({
        customer_id: customerId,
        sales: customer.sales,
        name: customer.name,
        groups: customer.groups,
        order_count: customer.count,
        last_order: customer.last_order,
        email: customer.email,
    }))
        .sort((a, b) => b.sales - a.sales);
    const customerData = {
        total_customers: customers.length,
        new_customers: newCustomers.length,
        returning_customers: customers.length - newCustomers.length,
        customer_count: customerCountArray,
        customer_group: customerGroupArray,
        customer_sales: customerSalesArray,
        currency_code: currencyCode,
    };
    res.json(customerData);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2FnaWxvLWFuYWx5dGljcy9jdXN0b21lcnMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBd0JBLGtCQTJPQztBQWxRRCxxREFLbUM7QUFDbkMsdUNBQWtDO0FBQ2xDLDZCQUF3QjtBQUV4QixxREFJa0M7QUFDbEMsaUNBQWlDO0FBRXBCLFFBQUEsaUNBQWlDLEdBQUcsT0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN4RCxTQUFTLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtJQUNyQixPQUFPLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRTtDQUNwQixDQUFDLENBQUM7QUFFSCxNQUFNLGdCQUFnQixHQUFHLEtBQUssQ0FBQztBQUV4QixLQUFLLFVBQVUsR0FBRyxDQUFDLEdBQWtCLEVBQUUsR0FBbUI7SUFDL0QsTUFBTSxNQUFNLEdBQUcseUNBQWlDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0RSxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqRSxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RCxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RCxNQUFNLE1BQU0sR0FBRyxNQUFNLGtCQUFrQixDQUFDLFVBQVUsQ0FDaEQsRUFBRSxFQUNGLEVBQUUsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUN4QyxDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUIsTUFBTSxZQUFZLEdBQ2hCLEtBQUssRUFBRSxvQkFBb0I7UUFDekIsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDM0IsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLElBQUksZ0JBQWdCLENBQUM7SUFFdkQsTUFBTSxRQUFRLEdBQUcsa0JBQWtCLFlBQVksRUFBRSxDQUFDO0lBRWxELElBQUksYUFBYSxHQUNmLE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXpDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNuQixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FDMUIsOENBQThDLFlBQVksRUFBRSxDQUM3RCxDQUFDO1FBQ0YsYUFBYSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRXRDLE1BQU0sR0FBRyxHQUFHLGdCQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3BELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzRSxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQztZQUNwQixRQUFRLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTlELE1BQU0sa0JBQWtCLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDOUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUN6RCxDQUFDO0lBQ0osQ0FBQztJQUNELE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFO1lBQ04sSUFBSTtZQUNKLFlBQVk7WUFDWixZQUFZO1lBQ1osbUJBQW1CO1lBQ25CLGVBQWU7WUFDZixtQkFBbUI7WUFDbkIsT0FBTztTQUNSO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZO2dCQUMxQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCO2FBQzdDO1lBQ0QsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxFQUFFO1NBQ3hDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7UUFDbEMsSUFBSSxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDbEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7UUFDOUIsQ0FBQztRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNQLENBQUM7SUFFRixNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUNuQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQ1gsUUFBUTtRQUNSLE9BQU8sUUFBUSxLQUFLLFFBQVE7UUFDNUIsUUFBUSxJQUFJLFFBQVE7UUFDcEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQzlCLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUNyQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQ1IsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztZQUMxQixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FDakQsQ0FDSixDQUFDO0lBRUYsTUFBTSxrQkFBa0IsR0FBRyxpQ0FBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5RCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUN4QixNQUFNLElBQUksbUJBQVcsQ0FDbkIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUM5QixzQkFBc0IsQ0FDdkIsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLGtCQUFrQixDQUFDO1FBQzNDLEdBQUcsTUFBTSxDQUFDLElBQUk7UUFDZCxNQUFNLEVBQUUsUUFBUTtLQUNqQixDQUFDLENBQUM7SUFFSCxNQUFNLFdBQVcsR0FBRyxJQUFBLGlCQUFNLEVBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN4RCxNQUFNLFNBQVMsR0FBRyxJQUFBLGlCQUFNLEVBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUVwRCxJQUFJLE9BQU8sR0FBNkIsS0FBSyxDQUFDO0lBQzlDLElBQUksSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2YsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNwQixDQUFDO1NBQU0sSUFBSSxJQUFJLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDckIsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUNuQixDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQUcsSUFBQSwrQkFBc0IsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRXpFLE1BQU0sWUFBWSxHQUdkLEVBQUUsQ0FBQztJQUVQLE1BQU0sYUFBYSxHQUEyQixFQUFFLENBQUM7SUFDakQsTUFBTSxhQUFhLEdBVWYsRUFBRSxDQUFDO0lBRVAsS0FBSyxNQUFNLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUMzQixNQUFNLFlBQVksR0FDaEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsS0FBSyxZQUFZO1lBQ2hELENBQUMsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLE1BQU0sVUFBVSxHQUFHLElBQUksaUJBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQztRQUNyRSxNQUFNLEdBQUcsR0FBRyxJQUFBLDJCQUFrQixFQUM1QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQzFCLE9BQU8sRUFDUCxXQUFXLEVBQ1gsU0FBUyxDQUNWLENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkIsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHO2dCQUNsQixrQkFBa0IsRUFBRSxJQUFJLEdBQUcsRUFBVTtnQkFDckMsWUFBWSxFQUFFLElBQUksR0FBRyxFQUFVO2FBQ2hDLENBQUM7UUFDSixDQUFDO1FBQ0QsSUFDRSxLQUFLLENBQUMsUUFBUTtZQUNkLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNqQixZQUFZLENBQUMsSUFBSSxDQUNmLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FDSixDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FDeEUsRUFDRCxDQUFDO1lBQ0QsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4RCxDQUFDO2FBQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDL0MsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ25DLEtBQUssTUFBTSxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztvQkFDL0IsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7Z0JBQ0QsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7YUFBTSxDQUFDO1lBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO2dCQUMvQixhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hDLENBQUM7WUFDRCxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksVUFBVSxDQUFDO1FBQzFDLENBQUM7UUFDRCxJQUFJLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUM3RCxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsR0FBRztnQkFDakMsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUNGLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDO29CQUNsQyxHQUFHO29CQUNILENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLElBQUksRUFBRSxDQUFDO2dCQUNuQyxNQUFNLEVBQUUsS0FBSyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDeEQsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsVUFBVSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQ3RDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssSUFBSSxFQUFFO2FBQ25DLENBQUM7UUFDSixDQUFDO1FBQ0QsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDO1lBQ3ZCLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUM7WUFDckQsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUM1QyxJQUNFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQ3hFLENBQUM7Z0JBQ0QsYUFBYSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLElBQUksSUFBSSxDQUNwRCxLQUFLLENBQUMsVUFBVSxDQUNqQixDQUFDO1lBQ0osQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxrQkFBa0IsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksRUFBRSxJQUFJO1FBQ1YsbUJBQW1CLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLGtCQUFrQixDQUFDLElBQUksSUFBSSxDQUFDO1FBQ3JFLGFBQWEsRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsWUFBWSxDQUFDLElBQUksSUFBSSxDQUFDO0tBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUosTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsQ0FDMUQsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNsQixJQUFJO1FBQ0osS0FBSztLQUNOLENBQUMsQ0FDSCxDQUFDO0lBRUYsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztTQUNyRCxHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNoQyxXQUFXLEVBQUUsVUFBVTtRQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7UUFDckIsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJO1FBQ25CLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTTtRQUN2QixXQUFXLEVBQUUsUUFBUSxDQUFDLEtBQUs7UUFDM0IsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVO1FBQy9CLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztLQUN0QixDQUFDLENBQUM7U0FDRixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVyQyxNQUFNLFlBQVksR0FBRztRQUNuQixlQUFlLEVBQUUsU0FBUyxDQUFDLE1BQU07UUFDakMsYUFBYSxFQUFFLFlBQVksQ0FBQyxNQUFNO1FBQ2xDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU07UUFDM0QsY0FBYyxFQUFFLGtCQUFrQjtRQUNsQyxjQUFjLEVBQUUsa0JBQWtCO1FBQ2xDLGNBQWMsRUFBRSxrQkFBa0I7UUFDbEMsYUFBYSxFQUFFLFlBQVk7S0FDNUIsQ0FBQztJQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekIsQ0FBQyJ9