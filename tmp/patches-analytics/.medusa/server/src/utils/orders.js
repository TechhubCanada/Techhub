"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDateRangeMethod = void 0;
exports.getWeekRangeKeyForDate = getWeekRangeKeyForDate;
exports.getAllWeekRangeKeys = getAllWeekRangeKeys;
exports.getDateGroupingKey = getDateGroupingKey;
exports.getAllDateGroupingKeys = getAllDateGroupingKeys;
const date_fns_1 = require("date-fns");
/**
 * Preset functions to calculate current and previous date ranges.
 * @param query Query object containing optional date_from, date_to, and preset name.
 * @returns Object with current date range, previous date range, and number of days in current range.
 */
exports.calculateDateRangeMethod = {
    custom: (query) => {
        if (!query.date_from || !query.date_to) {
            throw new Error('No date range provided');
        }
        const start = (0, date_fns_1.parseISO)(query.date_from);
        const end = (0, date_fns_1.parseISO)(query.date_to);
        const days = (0, date_fns_1.differenceInCalendarDays)(end, start) + 1;
        const prevEnd = new Date(start);
        prevEnd.setDate(start.getDate() - 1);
        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevEnd.getDate() - (days - 1));
        return {
            current: {
                start: new Date(query.date_from),
                end: new Date(query.date_to),
            },
            previous: { start: prevStart, end: prevEnd },
            days,
        };
    },
    'this-month': () => {
        const now = new Date();
        const start = (0, date_fns_1.startOfMonth)(now);
        const end = (0, date_fns_1.endOfMonth)(now);
        const prevStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const prevEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const days = (0, date_fns_1.differenceInCalendarDays)(end, start) + 1;
        return {
            current: { start, end },
            previous: { start: prevStart, end: prevEnd },
            days,
        };
    },
    'last-month': () => {
        const last = (0, date_fns_1.subMonths)(new Date(), 1);
        const start = (0, date_fns_1.startOfMonth)(last);
        const end = (0, date_fns_1.endOfMonth)(last);
        const prevStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(last, 1));
        const prevEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(last, 1));
        const days = (0, date_fns_1.differenceInCalendarDays)(end, start) + 1;
        return {
            current: { start, end },
            previous: { start: prevStart, end: prevEnd },
            days,
        };
    },
    'last-3-months': () => {
        const now = new Date();
        const start = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 3));
        const end = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const prevStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 6));
        const prevEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(now, 4));
        const days = (0, date_fns_1.differenceInCalendarDays)(end, start) + 1;
        return {
            current: { start, end },
            previous: { start: prevStart, end: prevEnd },
            days,
        };
    },
};
/**
 * Returns a formatted key representing the week range in which a given date falls,
 * based on a provided overall date range.
 *
 * @param date The date to check.
 * @param dateFrom The start date of the overall range (in ISO string format).
 * @param dateTo The end date of the overall range (in ISO string format).
 * @returns A string key in the format 'dd.MM-dd.MM' or fallback 'yyyy-MM-dd' if no range is found.
 */
function getWeekRangeKeyForDate(date, dateFrom, dateTo) {
    const start = (0, date_fns_1.startOfDay)((0, date_fns_1.parseISO)(dateFrom));
    const end = (0, date_fns_1.endOfDay)((0, date_fns_1.parseISO)(dateTo));
    const targetDate = (0, date_fns_1.startOfDay)(date);
    let current = start;
    while (current <= end) {
        const weekStart = current;
        const weekEnd = (0, date_fns_1.isAfter)((0, date_fns_1.addDays)(current, 6), end)
            ? end
            : (0, date_fns_1.addDays)(current, 6);
        if (targetDate >= weekStart && targetDate <= weekEnd) {
            const startMonth = weekStart.getMonth();
            const endMonth = weekEnd.getMonth();
            if (startMonth === endMonth) {
                const startDay = weekStart.getDate();
                const endDay = weekEnd.getDate();
                if (startDay === endDay) {
                    return `${(0, date_fns_1.format)(weekStart, 'd.M')}`;
                }
                return `${(0, date_fns_1.format)(weekStart, 'd.')}-${(0, date_fns_1.format)(weekEnd, 'd.M')}`;
            }
            else {
                return `${(0, date_fns_1.format)(weekStart, 'd.M')}-${(0, date_fns_1.format)(weekEnd, 'd.M')}`;
            }
        }
        current = (0, date_fns_1.addDays)(weekEnd, 1);
    }
    return (0, date_fns_1.format)(targetDate, 'yyyy-MM-dd');
}
/**
 * Generates a list of week range keys (formatted as 'dd.MM-dd.MM') between the given start and end dates.
 *
 * @param start The start date of the overall range.
 * @param end The end date of the overall range.
 * @returns An array of strings representing week ranges.
 */
function getAllWeekRangeKeys(start, end) {
    const weeks = [];
    let current = start;
    while (current <= end) {
        const weekStart = current;
        const weekEnd = (0, date_fns_1.isAfter)((0, date_fns_1.addDays)(current, 6), end)
            ? end
            : (0, date_fns_1.addDays)(current, 6);
        const startMonth = weekStart.getMonth();
        const endMonth = weekEnd.getMonth();
        if (startMonth === endMonth) {
            const startDay = weekStart.getDate();
            const endDay = weekEnd.getDate();
            if (startDay === endDay) {
                weeks.push(`${(0, date_fns_1.format)(weekStart, 'd.M')}`);
            }
            else {
                weeks.push(`${(0, date_fns_1.format)(weekStart, 'd.')}-${(0, date_fns_1.format)(weekEnd, 'd.M')}`);
            }
        }
        else {
            weeks.push(`${(0, date_fns_1.format)(weekStart, 'd.M')}-${(0, date_fns_1.format)(weekEnd, 'd.M')}`);
        }
        current = (0, date_fns_1.addDays)(weekEnd, 1);
    }
    return weeks;
}
/**
 * Generates a grouping key for a given date depending on the selected grouping mode (day, week, or month).
 *
 * @param date The date for which to generate the key.
 * @param groupBy Grouping mode: 'day', 'week', or 'month'.
 * @param dateFrom Optional start date of the range (required for 'week' grouping).
 * @param dateTo Optional end date of the range (required for 'week' grouping).
 * @returns A string key used for grouping data.
 */
function getDateGroupingKey(date, groupBy, dateFrom, dateTo) {
    if (groupBy === 'month') {
        return (0, date_fns_1.format)((0, date_fns_1.startOfMonth)(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))), 'yyyy-MM');
    }
    if (groupBy === 'week' && dateFrom && dateTo) {
        return getWeekRangeKeyForDate(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())), dateFrom, dateTo);
    }
    return (0, date_fns_1.format)(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())), 'yyyy-MM-dd');
}
/**
 * Generates a list of grouping keys for all periods between two dates, depending on the selected grouping mode.
 *
 * @param groupBy Grouping mode: 'day', 'week', or 'month'.
 * @param dateFrom Start date of the range (in ISO string format).
 * @param dateTo End date of the range (in ISO string format).
 * @returns An array of strings representing keys for each grouped period.
 */
function getAllDateGroupingKeys(groupBy, dateFrom, dateTo) {
    const start = (0, date_fns_1.parseISO)(dateFrom);
    const end = (0, date_fns_1.parseISO)(dateTo);
    if (groupBy === 'day') {
        return (0, date_fns_1.eachDayOfInterval)({ start, end }).map((d) => (0, date_fns_1.format)(d, 'yyyy-MM-dd'));
    }
    if (groupBy === 'month') {
        return (0, date_fns_1.eachMonthOfInterval)({ start, end }).map((d) => (0, date_fns_1.format)(d, 'yyyy-MM'));
    }
    return getAllWeekRangeKeys(start, end);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3V0aWxzL29yZGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFrSEEsd0RBc0NDO0FBU0Qsa0RBNkJDO0FBV0QsZ0RBK0JDO0FBVUQsd0RBbUJDO0FBclFELHVDQWFrQjtBQUlsQjs7OztHQUlHO0FBQ1UsUUFBQSx3QkFBd0IsR0FPakM7SUFDRixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVELE1BQU0sS0FBSyxHQUFHLElBQUEsbUJBQVEsRUFBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsTUFBTSxHQUFHLEdBQUcsSUFBQSxtQkFBUSxFQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxNQUFNLElBQUksR0FBRyxJQUFBLG1DQUF3QixFQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRCxPQUFPO1lBQ0wsT0FBTyxFQUFFO2dCQUNQLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFD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