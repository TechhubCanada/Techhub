"use strict";
const jsxRuntime = require("react/jsx-runtime");
const React = require("react");
const adminSdk = require("@medusajs/admin-sdk");
const ui = require("@medusajs/ui");
const icons = require("@medusajs/icons");
const lucideReact = require("lucide-react");
const dateFns = require("date-fns");
const reactAriaComponents = require("react-aria-components");
const recharts = require("recharts");
const Medusa = require("@medusajs/js-sdk");
const clsx = require("clsx");
const tailwindMerge = require("tailwind-merge");
const reactQuery = require("@tanstack/react-query");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const React__namespace = /* @__PURE__ */ _interopNamespace(React);
const Medusa__default = /* @__PURE__ */ _interopDefault(Medusa);
function $2b4dce13dd5a17fa$export$842a2cf37af977e1(amount, numerator) {
  return amount - numerator * Math.floor(amount / numerator);
}
const $3b62074eb05584b2$var$EPOCH = 1721426;
function $3b62074eb05584b2$export$f297eb839006d339(era, year, month, day) {
  year = $3b62074eb05584b2$export$c36e0ecb2d4fa69d(era, year);
  let y1 = year - 1;
  let monthOffset = -2;
  if (month <= 2) monthOffset = 0;
  else if ($3b62074eb05584b2$export$553d7fa8e3805fc0(year)) monthOffset = -1;
  return $3b62074eb05584b2$var$EPOCH - 1 + 365 * y1 + Math.floor(y1 / 4) - Math.floor(y1 / 100) + Math.floor(y1 / 400) + Math.floor((367 * month - 362) / 12 + monthOffset + day);
}
function $3b62074eb05584b2$export$553d7fa8e3805fc0(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function $3b62074eb05584b2$export$c36e0ecb2d4fa69d(era, year) {
  return era === "BC" ? 1 - year : year;
}
function $3b62074eb05584b2$export$4475b7e617eb123c(year) {
  let era = "AD";
  if (year <= 0) {
    era = "BC";
    year = 1 - year;
  }
  return [
    era,
    year
  ];
}
const $3b62074eb05584b2$var$daysInMonth = {
  standard: [
    31,
    28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ],
  leapyear: [
    31,
    29,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ]
};
class $3b62074eb05584b2$export$80ee6245ec4f29ec {
  fromJulianDay(jd) {
    let jd0 = jd;
    let depoch = jd0 - $3b62074eb05584b2$var$EPOCH;
    let quadricent = Math.floor(depoch / 146097);
    let dqc = $2b4dce13dd5a17fa$export$842a2cf37af977e1(depoch, 146097);
    let cent = Math.floor(dqc / 36524);
    let dcent = $2b4dce13dd5a17fa$export$842a2cf37af977e1(dqc, 36524);
    let quad = Math.floor(dcent / 1461);
    let dquad = $2b4dce13dd5a17fa$export$842a2cf37af977e1(dcent, 1461);
    let yindex = Math.floor(dquad / 365);
    let extendedYear = quadricent * 400 + cent * 100 + quad * 4 + yindex + (cent !== 4 && yindex !== 4 ? 1 : 0);
    let [era, year] = $3b62074eb05584b2$export$4475b7e617eb123c(extendedYear);
    let yearDay = jd0 - $3b62074eb05584b2$export$f297eb839006d339(era, year, 1, 1);
    let leapAdj = 2;
    if (jd0 < $3b62074eb05584b2$export$f297eb839006d339(era, year, 3, 1)) leapAdj = 0;
    else if ($3b62074eb05584b2$export$553d7fa8e3805fc0(year)) leapAdj = 1;
    let month = Math.floor(((yearDay + leapAdj) * 12 + 373) / 367);
    let day = jd0 - $3b62074eb05584b2$export$f297eb839006d339(era, year, month, 1) + 1;
    return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(era, year, month, day);
  }
  toJulianDay(date) {
    return $3b62074eb05584b2$export$f297eb839006d339(date.era, date.year, date.month, date.day);
  }
  getDaysInMonth(date) {
    return $3b62074eb05584b2$var$daysInMonth[$3b62074eb05584b2$export$553d7fa8e3805fc0(date.year) ? "leapyear" : "standard"][date.month - 1];
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMonthsInYear(date) {
    return 12;
  }
  getDaysInYear(date) {
    return $3b62074eb05584b2$export$553d7fa8e3805fc0(date.year) ? 366 : 365;
  }
  getMaximumMonthsInYear() {
    return 12;
  }
  getMaximumDaysInMonth() {
    return 31;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getYearsInEra(date) {
    return 9999;
  }
  getEras() {
    return [
      "BC",
      "AD"
    ];
  }
  isInverseEra(date) {
    return date.era === "BC";
  }
  balanceDate(date) {
    if (date.year <= 0) {
      date.era = date.era === "BC" ? "AD" : "BC";
      date.year = 1 - date.year;
    }
  }
  constructor() {
    this.identifier = "gregory";
  }
}
function $14e0f24ef4ac5c92$export$dbc69fd56b53d5e(a, b) {
  var _a_isEqual, _b_isEqual;
  var _a_isEqual1, _ref;
  return (_ref = (_a_isEqual1 = (_a_isEqual = a.isEqual) === null || _a_isEqual === void 0 ? void 0 : _a_isEqual.call(a, b)) !== null && _a_isEqual1 !== void 0 ? _a_isEqual1 : (_b_isEqual = b.isEqual) === null || _b_isEqual === void 0 ? void 0 : _b_isEqual.call(b, a)) !== null && _ref !== void 0 ? _ref : a.identifier === b.identifier;
}
function $14e0f24ef4ac5c92$export$68781ddf31c0090f(a, b) {
  return a.calendar.toJulianDay(a) - b.calendar.toJulianDay(b);
}
function $14e0f24ef4ac5c92$export$c19a80a9721b80f6(a, b) {
  return $14e0f24ef4ac5c92$var$timeToMs(a) - $14e0f24ef4ac5c92$var$timeToMs(b);
}
function $14e0f24ef4ac5c92$var$timeToMs(a) {
  return a.hour * 36e5 + a.minute * 6e4 + a.second * 1e3 + a.millisecond;
}
let $14e0f24ef4ac5c92$var$localTimeZone = null;
function $14e0f24ef4ac5c92$export$aa8b41735afcabd2() {
  if ($14e0f24ef4ac5c92$var$localTimeZone == null) $14e0f24ef4ac5c92$var$localTimeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  return $14e0f24ef4ac5c92$var$localTimeZone;
}
function $11d87f3f76e88657$export$bd4fb2bc8bb06fb(date) {
  date = $11d87f3f76e88657$export$b4a036af3fc0b032(date, new $3b62074eb05584b2$export$80ee6245ec4f29ec());
  let year = $3b62074eb05584b2$export$c36e0ecb2d4fa69d(date.era, date.year);
  return $11d87f3f76e88657$var$epochFromParts(year, date.month, date.day, date.hour, date.minute, date.second, date.millisecond);
}
function $11d87f3f76e88657$var$epochFromParts(year, month, day, hour, minute, second, millisecond) {
  let date = /* @__PURE__ */ new Date();
  date.setUTCHours(hour, minute, second, millisecond);
  date.setUTCFullYear(year, month - 1, day);
  return date.getTime();
}
function $11d87f3f76e88657$export$59c99f3515d3493f(ms, timeZone) {
  if (timeZone === "UTC") return 0;
  if (ms > 0 && timeZone === $14e0f24ef4ac5c92$export$aa8b41735afcabd2()) return new Date(ms).getTimezoneOffset() * -6e4;
  let { year, month, day, hour, minute, second } = $11d87f3f76e88657$var$getTimeZoneParts(ms, timeZone);
  let utc = $11d87f3f76e88657$var$epochFromParts(year, month, day, hour, minute, second, 0);
  return utc - Math.floor(ms / 1e3) * 1e3;
}
const $11d87f3f76e88657$var$formattersByTimeZone = /* @__PURE__ */ new Map();
function $11d87f3f76e88657$var$getTimeZoneParts(ms, timeZone) {
  let formatter = $11d87f3f76e88657$var$formattersByTimeZone.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      era: "short",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    $11d87f3f76e88657$var$formattersByTimeZone.set(timeZone, formatter);
  }
  let parts = formatter.formatToParts(new Date(ms));
  let namedParts = {};
  for (let part of parts) if (part.type !== "literal") namedParts[part.type] = part.value;
  return {
    // Firefox returns B instead of BC... https://bugzilla.mozilla.org/show_bug.cgi?id=1752253
    year: namedParts.era === "BC" || namedParts.era === "B" ? -namedParts.year + 1 : +namedParts.year,
    month: +namedParts.month,
    day: +namedParts.day,
    hour: namedParts.hour === "24" ? 0 : +namedParts.hour,
    minute: +namedParts.minute,
    second: +namedParts.second
  };
}
const $11d87f3f76e88657$var$DAYMILLIS = 864e5;
function $11d87f3f76e88657$var$getValidWallTimes(date, timeZone, earlier, later) {
  let found = earlier === later ? [
    earlier
  ] : [
    earlier,
    later
  ];
  return found.filter((absolute) => $11d87f3f76e88657$var$isValidWallTime(date, timeZone, absolute));
}
function $11d87f3f76e88657$var$isValidWallTime(date, timeZone, absolute) {
  let parts = $11d87f3f76e88657$var$getTimeZoneParts(absolute, timeZone);
  return date.year === parts.year && date.month === parts.month && date.day === parts.day && date.hour === parts.hour && date.minute === parts.minute && date.second === parts.second;
}
function $11d87f3f76e88657$export$5107c82f94518f5c(date, timeZone, disambiguation = "compatible") {
  let dateTime = $11d87f3f76e88657$export$b21e0b124e224484(date);
  if (timeZone === "UTC") return $11d87f3f76e88657$export$bd4fb2bc8bb06fb(dateTime);
  if (timeZone === $14e0f24ef4ac5c92$export$aa8b41735afcabd2() && disambiguation === "compatible") {
    dateTime = $11d87f3f76e88657$export$b4a036af3fc0b032(dateTime, new $3b62074eb05584b2$export$80ee6245ec4f29ec());
    let date2 = /* @__PURE__ */ new Date();
    let year = $3b62074eb05584b2$export$c36e0ecb2d4fa69d(dateTime.era, dateTime.year);
    date2.setFullYear(year, dateTime.month - 1, dateTime.day);
    date2.setHours(dateTime.hour, dateTime.minute, dateTime.second, dateTime.millisecond);
    return date2.getTime();
  }
  let ms = $11d87f3f76e88657$export$bd4fb2bc8bb06fb(dateTime);
  let offsetBefore = $11d87f3f76e88657$export$59c99f3515d3493f(ms - $11d87f3f76e88657$var$DAYMILLIS, timeZone);
  let offsetAfter = $11d87f3f76e88657$export$59c99f3515d3493f(ms + $11d87f3f76e88657$var$DAYMILLIS, timeZone);
  let valid = $11d87f3f76e88657$var$getValidWallTimes(dateTime, timeZone, ms - offsetBefore, ms - offsetAfter);
  if (valid.length === 1) return valid[0];
  if (valid.length > 1) switch (disambiguation) {
    case "compatible":
    case "earlier":
      return valid[0];
    case "later":
      return valid[valid.length - 1];
    case "reject":
      throw new RangeError("Multiple possible absolute times found");
  }
  switch (disambiguation) {
    case "earlier":
      return Math.min(ms - offsetBefore, ms - offsetAfter);
    case "compatible":
    case "later":
      return Math.max(ms - offsetBefore, ms - offsetAfter);
    case "reject":
      throw new RangeError("No such absolute time found");
  }
}
function $11d87f3f76e88657$export$e67a095c620b86fe(dateTime, timeZone, disambiguation = "compatible") {
  return new Date($11d87f3f76e88657$export$5107c82f94518f5c(dateTime, timeZone, disambiguation));
}
function $11d87f3f76e88657$export$b21e0b124e224484(date, time) {
  let hour = 0, minute = 0, second = 0, millisecond = 0;
  if ("timeZone" in date) ({ hour, minute, second, millisecond } = date);
  else if ("hour" in date && !time) return date;
  if (time) ({ hour, minute, second, millisecond } = time);
  return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(date.calendar, date.era, date.year, date.month, date.day, hour, minute, second, millisecond);
}
function $11d87f3f76e88657$export$b4a036af3fc0b032(date, calendar) {
  if ($14e0f24ef4ac5c92$export$dbc69fd56b53d5e(date.calendar, calendar)) return date;
  let calendarDate = calendar.fromJulianDay(date.calendar.toJulianDay(date));
  let copy = date.copy();
  copy.calendar = calendar;
  copy.era = calendarDate.era;
  copy.year = calendarDate.year;
  copy.month = calendarDate.month;
  copy.day = calendarDate.day;
  $735220c2d4774dd3$export$c4e2ecac49351ef2(copy);
  return copy;
}
function $735220c2d4774dd3$export$e16d8520af44a096(date, duration) {
  let mutableDate = date.copy();
  let days = "hour" in mutableDate ? $735220c2d4774dd3$var$addTimeFields(mutableDate, duration) : 0;
  $735220c2d4774dd3$var$addYears(mutableDate, duration.years || 0);
  if (mutableDate.calendar.balanceYearMonth) mutableDate.calendar.balanceYearMonth(mutableDate, date);
  mutableDate.month += duration.months || 0;
  $735220c2d4774dd3$var$balanceYearMonth(mutableDate);
  $735220c2d4774dd3$var$constrainMonthDay(mutableDate);
  mutableDate.day += (duration.weeks || 0) * 7;
  mutableDate.day += duration.days || 0;
  mutableDate.day += days;
  $735220c2d4774dd3$var$balanceDay(mutableDate);
  if (mutableDate.calendar.balanceDate) mutableDate.calendar.balanceDate(mutableDate);
  if (mutableDate.year < 1) {
    mutableDate.year = 1;
    mutableDate.month = 1;
    mutableDate.day = 1;
  }
  let maxYear = mutableDate.calendar.getYearsInEra(mutableDate);
  if (mutableDate.year > maxYear) {
    var _mutableDate_calendar_isInverseEra, _mutableDate_calendar;
    let isInverseEra = (_mutableDate_calendar_isInverseEra = (_mutableDate_calendar = mutableDate.calendar).isInverseEra) === null || _mutableDate_calendar_isInverseEra === void 0 ? void 0 : _mutableDate_calendar_isInverseEra.call(_mutableDate_calendar, mutableDate);
    mutableDate.year = maxYear;
    mutableDate.month = isInverseEra ? 1 : mutableDate.calendar.getMonthsInYear(mutableDate);
    mutableDate.day = isInverseEra ? 1 : mutableDate.calendar.getDaysInMonth(mutableDate);
  }
  if (mutableDate.month < 1) {
    mutableDate.month = 1;
    mutableDate.day = 1;
  }
  let maxMonth = mutableDate.calendar.getMonthsInYear(mutableDate);
  if (mutableDate.month > maxMonth) {
    mutableDate.month = maxMonth;
    mutableDate.day = mutableDate.calendar.getDaysInMonth(mutableDate);
  }
  mutableDate.day = Math.max(1, Math.min(mutableDate.calendar.getDaysInMonth(mutableDate), mutableDate.day));
  return mutableDate;
}
function $735220c2d4774dd3$var$addYears(date, years) {
  var _date_calendar_isInverseEra, _date_calendar;
  if ((_date_calendar_isInverseEra = (_date_calendar = date.calendar).isInverseEra) === null || _date_calendar_isInverseEra === void 0 ? void 0 : _date_calendar_isInverseEra.call(_date_calendar, date)) years = -years;
  date.year += years;
}
function $735220c2d4774dd3$var$balanceYearMonth(date) {
  while (date.month < 1) {
    $735220c2d4774dd3$var$addYears(date, -1);
    date.month += date.calendar.getMonthsInYear(date);
  }
  let monthsInYear = 0;
  while (date.month > (monthsInYear = date.calendar.getMonthsInYear(date))) {
    date.month -= monthsInYear;
    $735220c2d4774dd3$var$addYears(date, 1);
  }
}
function $735220c2d4774dd3$var$balanceDay(date) {
  while (date.day < 1) {
    date.month--;
    $735220c2d4774dd3$var$balanceYearMonth(date);
    date.day += date.calendar.getDaysInMonth(date);
  }
  while (date.day > date.calendar.getDaysInMonth(date)) {
    date.day -= date.calendar.getDaysInMonth(date);
    date.month++;
    $735220c2d4774dd3$var$balanceYearMonth(date);
  }
}
function $735220c2d4774dd3$var$constrainMonthDay(date) {
  date.month = Math.max(1, Math.min(date.calendar.getMonthsInYear(date), date.month));
  date.day = Math.max(1, Math.min(date.calendar.getDaysInMonth(date), date.day));
}
function $735220c2d4774dd3$export$c4e2ecac49351ef2(date) {
  if (date.calendar.constrainDate) date.calendar.constrainDate(date);
  date.year = Math.max(1, Math.min(date.calendar.getYearsInEra(date), date.year));
  $735220c2d4774dd3$var$constrainMonthDay(date);
}
function $735220c2d4774dd3$export$3e2544e88a25bff8(duration) {
  let inverseDuration = {};
  for (let key in duration) if (typeof duration[key] === "number") inverseDuration[key] = -duration[key];
  return inverseDuration;
}
function $735220c2d4774dd3$export$4e2d2ead65e5f7e3(date, duration) {
  return $735220c2d4774dd3$export$e16d8520af44a096(date, $735220c2d4774dd3$export$3e2544e88a25bff8(duration));
}
function $735220c2d4774dd3$export$adaa4cf7ef1b65be(date, fields) {
  let mutableDate = date.copy();
  if (fields.era != null) mutableDate.era = fields.era;
  if (fields.year != null) mutableDate.year = fields.year;
  if (fields.month != null) mutableDate.month = fields.month;
  if (fields.day != null) mutableDate.day = fields.day;
  $735220c2d4774dd3$export$c4e2ecac49351ef2(mutableDate);
  return mutableDate;
}
function $735220c2d4774dd3$export$e5d5e1c1822b6e56(value, fields) {
  let mutableValue = value.copy();
  if (fields.hour != null) mutableValue.hour = fields.hour;
  if (fields.minute != null) mutableValue.minute = fields.minute;
  if (fields.second != null) mutableValue.second = fields.second;
  if (fields.millisecond != null) mutableValue.millisecond = fields.millisecond;
  $735220c2d4774dd3$export$7555de1e070510cb(mutableValue);
  return mutableValue;
}
function $735220c2d4774dd3$var$balanceTime(time) {
  time.second += Math.floor(time.millisecond / 1e3);
  time.millisecond = $735220c2d4774dd3$var$nonNegativeMod(time.millisecond, 1e3);
  time.minute += Math.floor(time.second / 60);
  time.second = $735220c2d4774dd3$var$nonNegativeMod(time.second, 60);
  time.hour += Math.floor(time.minute / 60);
  time.minute = $735220c2d4774dd3$var$nonNegativeMod(time.minute, 60);
  let days = Math.floor(time.hour / 24);
  time.hour = $735220c2d4774dd3$var$nonNegativeMod(time.hour, 24);
  return days;
}
function $735220c2d4774dd3$export$7555de1e070510cb(time) {
  time.millisecond = Math.max(0, Math.min(time.millisecond, 1e3));
  time.second = Math.max(0, Math.min(time.second, 59));
  time.minute = Math.max(0, Math.min(time.minute, 59));
  time.hour = Math.max(0, Math.min(time.hour, 23));
}
function $735220c2d4774dd3$var$nonNegativeMod(a, b) {
  let result = a % b;
  if (result < 0) result += b;
  return result;
}
function $735220c2d4774dd3$var$addTimeFields(time, duration) {
  time.hour += duration.hours || 0;
  time.minute += duration.minutes || 0;
  time.second += duration.seconds || 0;
  time.millisecond += duration.milliseconds || 0;
  return $735220c2d4774dd3$var$balanceTime(time);
}
function $735220c2d4774dd3$export$d52ced6badfb9a4c(value, field, amount, options) {
  let mutable = value.copy();
  switch (field) {
    case "era": {
      let eras = value.calendar.getEras();
      let eraIndex = eras.indexOf(value.era);
      if (eraIndex < 0) throw new Error("Invalid era: " + value.era);
      eraIndex = $735220c2d4774dd3$var$cycleValue(eraIndex, amount, 0, eras.length - 1, options === null || options === void 0 ? void 0 : options.round);
      mutable.era = eras[eraIndex];
      $735220c2d4774dd3$export$c4e2ecac49351ef2(mutable);
      break;
    }
    case "year":
      var _mutable_calendar_isInverseEra, _mutable_calendar;
      if ((_mutable_calendar_isInverseEra = (_mutable_calendar = mutable.calendar).isInverseEra) === null || _mutable_calendar_isInverseEra === void 0 ? void 0 : _mutable_calendar_isInverseEra.call(_mutable_calendar, mutable)) amount = -amount;
      mutable.year = $735220c2d4774dd3$var$cycleValue(value.year, amount, -Infinity, 9999, options === null || options === void 0 ? void 0 : options.round);
      if (mutable.year === -Infinity) mutable.year = 1;
      if (mutable.calendar.balanceYearMonth) mutable.calendar.balanceYearMonth(mutable, value);
      break;
    case "month":
      mutable.month = $735220c2d4774dd3$var$cycleValue(value.month, amount, 1, value.calendar.getMonthsInYear(value), options === null || options === void 0 ? void 0 : options.round);
      break;
    case "day":
      mutable.day = $735220c2d4774dd3$var$cycleValue(value.day, amount, 1, value.calendar.getDaysInMonth(value), options === null || options === void 0 ? void 0 : options.round);
      break;
    default:
      throw new Error("Unsupported field " + field);
  }
  if (value.calendar.balanceDate) value.calendar.balanceDate(mutable);
  $735220c2d4774dd3$export$c4e2ecac49351ef2(mutable);
  return mutable;
}
function $735220c2d4774dd3$export$dd02b3e0007dfe28(value, field, amount, options) {
  let mutable = value.copy();
  switch (field) {
    case "hour": {
      let hours = value.hour;
      let min = 0;
      let max = 23;
      if ((options === null || options === void 0 ? void 0 : options.hourCycle) === 12) {
        let isPM = hours >= 12;
        min = isPM ? 12 : 0;
        max = isPM ? 23 : 11;
      }
      mutable.hour = $735220c2d4774dd3$var$cycleValue(hours, amount, min, max, options === null || options === void 0 ? void 0 : options.round);
      break;
    }
    case "minute":
      mutable.minute = $735220c2d4774dd3$var$cycleValue(value.minute, amount, 0, 59, options === null || options === void 0 ? void 0 : options.round);
      break;
    case "second":
      mutable.second = $735220c2d4774dd3$var$cycleValue(value.second, amount, 0, 59, options === null || options === void 0 ? void 0 : options.round);
      break;
    case "millisecond":
      mutable.millisecond = $735220c2d4774dd3$var$cycleValue(value.millisecond, amount, 0, 999, options === null || options === void 0 ? void 0 : options.round);
      break;
    default:
      throw new Error("Unsupported field " + field);
  }
  return mutable;
}
function $735220c2d4774dd3$var$cycleValue(value, amount, min, max, round = false) {
  if (round) {
    value += Math.sign(amount);
    if (value < min) value = max;
    let div = Math.abs(amount);
    if (amount > 0) value = Math.ceil(value / div) * div;
    else value = Math.floor(value / div) * div;
    if (value > max) value = min;
  } else {
    value += amount;
    if (value < min) value = max - (min - value - 1);
    else if (value > max) value = min + (value - max - 1);
  }
  return value;
}
function $fae977aafc393c5c$export$f59dee82248f5ad4(time) {
  return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}:${String(time.second).padStart(2, "0")}${time.millisecond ? String(time.millisecond / 1e3).slice(1) : ""}`;
}
function $fae977aafc393c5c$export$60dfd74aa96791bd(date) {
  let gregorianDate = $11d87f3f76e88657$export$b4a036af3fc0b032(date, new $3b62074eb05584b2$export$80ee6245ec4f29ec());
  let year;
  if (gregorianDate.era === "BC") year = gregorianDate.year === 1 ? "0000" : "-" + String(Math.abs(1 - gregorianDate.year)).padStart(6, "00");
  else year = String(gregorianDate.year).padStart(4, "0");
  return `${year}-${String(gregorianDate.month).padStart(2, "0")}-${String(gregorianDate.day).padStart(2, "0")}`;
}
function $fae977aafc393c5c$export$4223de14708adc63(date) {
  return `${$fae977aafc393c5c$export$60dfd74aa96791bd(date)}T${$fae977aafc393c5c$export$f59dee82248f5ad4(date)}`;
}
function _check_private_redeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _class_private_field_init(obj, privateMap, value) {
  _check_private_redeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function $35ea8db9cb2ccb90$var$shiftArgs(args) {
  let calendar = typeof args[0] === "object" ? args.shift() : new $3b62074eb05584b2$export$80ee6245ec4f29ec();
  let era;
  if (typeof args[0] === "string") era = args.shift();
  else {
    let eras = calendar.getEras();
    era = eras[eras.length - 1];
  }
  let year = args.shift();
  let month = args.shift();
  let day = args.shift();
  return [
    calendar,
    era,
    year,
    month,
    day
  ];
}
var $35ea8db9cb2ccb90$var$_type = /* @__PURE__ */ new WeakMap();
class $35ea8db9cb2ccb90$export$99faa760c7908e4f {
  /** Returns a copy of this date. */
  copy() {
    if (this.era) return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(this.calendar, this.era, this.year, this.month, this.day);
    else return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(this.calendar, this.year, this.month, this.day);
  }
  /** Returns a new `CalendarDate` with the given duration added to it. */
  add(duration) {
    return $735220c2d4774dd3$export$e16d8520af44a096(this, duration);
  }
  /** Returns a new `CalendarDate` with the given duration subtracted from it. */
  subtract(duration) {
    return $735220c2d4774dd3$export$4e2d2ead65e5f7e3(this, duration);
  }
  /** Returns a new `CalendarDate` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(fields) {
    return $735220c2d4774dd3$export$adaa4cf7ef1b65be(this, fields);
  }
  /**
  * Returns a new `CalendarDate` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(field, amount, options) {
    return $735220c2d4774dd3$export$d52ced6badfb9a4c(this, field, amount, options);
  }
  /** Converts the date to a native JavaScript Date object, with the time set to midnight in the given time zone. */
  toDate(timeZone) {
    return $11d87f3f76e88657$export$e67a095c620b86fe(this, timeZone);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return $fae977aafc393c5c$export$60dfd74aa96791bd(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(b) {
    return $14e0f24ef4ac5c92$export$68781ddf31c0090f(this, b);
  }
  constructor(...args) {
    _class_private_field_init(this, $35ea8db9cb2ccb90$var$_type, {
      writable: true,
      value: void 0
    });
    let [calendar, era, year, month, day] = $35ea8db9cb2ccb90$var$shiftArgs(args);
    this.calendar = calendar;
    this.era = era;
    this.year = year;
    this.month = month;
    this.day = day;
    $735220c2d4774dd3$export$c4e2ecac49351ef2(this);
  }
}
var $35ea8db9cb2ccb90$var$_type2 = /* @__PURE__ */ new WeakMap();
class $35ea8db9cb2ccb90$export$ca871e8dbb80966f {
  /** Returns a copy of this date. */
  copy() {
    if (this.era) return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(this.calendar, this.era, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
    else return new $35ea8db9cb2ccb90$export$ca871e8dbb80966f(this.calendar, this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
  }
  /** Returns a new `CalendarDateTime` with the given duration added to it. */
  add(duration) {
    return $735220c2d4774dd3$export$e16d8520af44a096(this, duration);
  }
  /** Returns a new `CalendarDateTime` with the given duration subtracted from it. */
  subtract(duration) {
    return $735220c2d4774dd3$export$4e2d2ead65e5f7e3(this, duration);
  }
  /** Returns a new `CalendarDateTime` with the given fields set to the provided values. Other fields will be constrained accordingly. */
  set(fields) {
    return $735220c2d4774dd3$export$adaa4cf7ef1b65be($735220c2d4774dd3$export$e5d5e1c1822b6e56(this, fields), fields);
  }
  /**
  * Returns a new `CalendarDateTime` with the given field adjusted by a specified amount.
  * When the resulting value reaches the limits of the field, it wraps around.
  */
  cycle(field, amount, options) {
    switch (field) {
      case "era":
      case "year":
      case "month":
      case "day":
        return $735220c2d4774dd3$export$d52ced6badfb9a4c(this, field, amount, options);
      default:
        return $735220c2d4774dd3$export$dd02b3e0007dfe28(this, field, amount, options);
    }
  }
  /** Converts the date to a native JavaScript Date object in the given time zone. */
  toDate(timeZone, disambiguation) {
    return $11d87f3f76e88657$export$e67a095c620b86fe(this, timeZone, disambiguation);
  }
  /** Converts the date to an ISO 8601 formatted string. */
  toString() {
    return $fae977aafc393c5c$export$4223de14708adc63(this);
  }
  /** Compares this date with another. A negative result indicates that this date is before the given one, and a positive date indicates that it is after. */
  compare(b) {
    let res = $14e0f24ef4ac5c92$export$68781ddf31c0090f(this, b);
    if (res === 0) return $14e0f24ef4ac5c92$export$c19a80a9721b80f6(this, $11d87f3f76e88657$export$b21e0b124e224484(b));
    return res;
  }
  constructor(...args) {
    _class_private_field_init(this, $35ea8db9cb2ccb90$var$_type2, {
      writable: true,
      value: void 0
    });
    let [calendar, era, year, month, day] = $35ea8db9cb2ccb90$var$shiftArgs(args);
    this.calendar = calendar;
    this.era = era;
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = args.shift() || 0;
    this.minute = args.shift() || 0;
    this.second = args.shift() || 0;
    this.millisecond = args.shift() || 0;
    $735220c2d4774dd3$export$c4e2ecac49351ef2(this);
  }
}
const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => observer.disconnect();
  }, []);
  return isDark;
};
const LineChart = ({
  data,
  xAxisDataKey,
  yAxisDataKey,
  lineColor = "#3B82F6",
  yAxisTickFormatter
}) => {
  const isDark = useDarkMode();
  const isSingleDataPoint = data && data.length === 1;
  if (isSingleDataPoint) {
    return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { aspect: 16 / 9, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.BarChart, { data, margin: { left: 20 }, children: [
      /* @__PURE__ */ jsxRuntime.jsx(
        recharts.CartesianGrid,
        {
          strokeDasharray: "3 3",
          stroke: isDark ? "#374151" : "#E5E7EB"
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        recharts.XAxis,
        {
          dataKey: xAxisDataKey,
          tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
          axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
          tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
          tickMargin: 10
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        recharts.YAxis,
        {
          tickFormatter: yAxisTickFormatter,
          allowDecimals: false,
          tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
          axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
          tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" }
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        recharts.Tooltip,
        {
          cursor: {
            fill: isDark ? "rgba(55, 65, 81, 0.2)" : "rgba(243, 244, 246, 0.5)"
          },
          formatter: yAxisTickFormatter ? yAxisTickFormatter : void 0,
          contentStyle: {
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
            borderRadius: "0.5rem",
            color: isDark ? "#F9FAFB" : "#111827",
            boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          },
          labelStyle: {
            color: isDark ? "#F9FAFB" : "#111827",
            fontWeight: "500",
            marginBottom: "4px"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(
        recharts.Bar,
        {
          dataKey: yAxisDataKey,
          fill: lineColor,
          radius: [4, 4, 0, 0],
          maxBarSize: 60
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { aspect: 16 / 9, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.LineChart, { data, margin: { left: 20 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.CartesianGrid,
      {
        strokeDasharray: "3 3",
        stroke: isDark ? "#374151" : "#E5E7EB"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.XAxis,
      {
        dataKey: xAxisDataKey,
        tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
        axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickMargin: 10
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.YAxis,
      {
        tickFormatter: yAxisTickFormatter,
        allowDecimals: false,
        tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
        axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Tooltip,
      {
        cursor: {
          stroke: isDark ? "#4B5563" : "#E5E7EB",
          strokeWidth: 1,
          fill: isDark ? "rgba(55, 65, 81, 0.2)" : "rgba(243, 244, 246, 0.5)"
        },
        formatter: yAxisTickFormatter ? yAxisTickFormatter : void 0,
        contentStyle: {
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          borderRadius: "0.5rem",
          color: isDark ? "#F9FAFB" : "#111827",
          boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        },
        labelStyle: {
          color: isDark ? "#F9FAFB" : "#111827",
          fontWeight: "500",
          marginBottom: "4px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Line,
      {
        type: "monotone",
        dataKey: yAxisDataKey,
        stroke: lineColor,
        activeDot: {
          r: 5,
          fill: lineColor,
          stroke: isDark ? "#1F2937" : "#FFFFFF",
          strokeWidth: 2
        },
        strokeWidth: 2,
        dot: {
          r: 4,
          fill: lineColor,
          stroke: isDark ? "#1F2937" : "#FFFFFF",
          strokeWidth: 1
        }
      }
    )
  ] }) });
};
function cn(...inputs) {
  return tailwindMerge.twMerge(clsx.clsx(inputs));
}
function generateStableColor(input, saturation = 70, lightness = 50) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
function generateColorsForData(data, keyField, saturation = 70, lightness = 50) {
  return data.map(
    (item) => generateStableColor(String(item[keyField]), saturation, lightness)
  );
}
const sdk = new Medusa__default.default({
  baseUrl: __BACKEND_URL__ || "/",
  auth: {
    type: "session"
  }
});
const getAdminBasePath = () => {
  const marker = "/app";
  const index = window.location.pathname.indexOf(marker);
  return index >= 0 ? window.location.pathname.slice(0, index + marker.length) : marker;
};
const navigateAdmin = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  window.location.assign(`${getAdminBasePath()}${normalizedPath}`);
};
const getCurrentSearchParams = () => new URLSearchParams(window.location.search);
const pushCurrentSearchParams = (params) => {
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.pushState(window.history.state, "", nextUrl);
};
const BarChart = ({
  data,
  xAxisDataKey,
  yAxisDataKey,
  lineColor = "#3B82F6",
  yAxisTickFormatter,
  useStableColors = false,
  colorKeyField
}) => {
  const isDark = useDarkMode();
  const colors = React__namespace.default.useMemo(() => {
    if (!useStableColors || !data || !colorKeyField) {
      return [];
    }
    return generateColorsForData(data, colorKeyField, 70, isDark ? 60 : 50);
  }, [data, useStableColors, colorKeyField, isDark]);
  return /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { aspect: 16 / 9, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.BarChart, { data, margin: { left: 20 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.CartesianGrid,
      {
        strokeDasharray: "3 3",
        stroke: isDark ? "#374151" : "#E5E7EB"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.XAxis,
      {
        dataKey: String(xAxisDataKey),
        tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
        axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickMargin: 10
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.YAxis,
      {
        tickFormatter: yAxisTickFormatter,
        allowDecimals: false,
        tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
        axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Tooltip,
      {
        cursor: {
          fill: isDark ? "rgba(55, 65, 81, 0.2)" : "rgba(243, 244, 246, 0.5)"
        },
        formatter: yAxisTickFormatter ? yAxisTickFormatter : void 0,
        contentStyle: {
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          borderRadius: "0.5rem",
          color: isDark ? "#F9FAFB" : "#111827",
          boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        },
        labelStyle: {
          color: isDark ? "#F9FAFB" : "#111827",
          fontWeight: "500",
          marginBottom: "4px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(recharts.Bar, { dataKey: String(yAxisDataKey), fill: lineColor, children: useStableColors && colors.length > 0 ? data == null ? void 0 : data.map((_, index) => /* @__PURE__ */ jsxRuntime.jsx(recharts.Cell, { fill: colors[index] }, `cell-${index}`)) : null })
  ] }) });
};
const COLORS = [
  "#3B82F6",
  // blue-500
  "#10B981",
  // emerald-500
  "#F59E0B",
  // amber-500
  "#EF4444",
  // red-500
  "#8B5CF6",
  // violet-500
  "#06B6D4",
  // cyan-500
  "#84CC16",
  // lime-500
  "#F97316"
  // orange-500
];
const DARK_COLORS = [
  "#60A5FA",
  // blue-400
  "#34D399",
  // emerald-400
  "#FBBF24",
  // amber-400
  "#F87171",
  // red-400
  "#A78BFA",
  // violet-400
  "#22D3EE",
  // cyan-400
  "#A3E635",
  // lime-400
  "#FB923C"
  // orange-400
];
const PieChart = ({ data, dataKey }) => {
  const isDark = useDarkMode();
  const colors = isDark ? DARK_COLORS : COLORS;
  return /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { aspect: 16 / 9, maxHeight: 400, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.PieChart, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Pie,
      {
        data,
        label: ({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`,
        dataKey,
        children: data && data.map((_, index) => /* @__PURE__ */ jsxRuntime.jsx(
          recharts.Cell,
          {
            fill: colors[index % colors.length]
          },
          `cell-${index}`
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Tooltip,
      {
        contentStyle: {
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          borderRadius: "0.5rem",
          color: isDark ? "#F9FAFB" : "#111827",
          boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        },
        labelStyle: {
          color: isDark ? "#F9FAFB" : "#111827",
          fontWeight: "500",
          marginBottom: "4px"
        },
        itemStyle: {
          color: isDark ? "#F9FAFB" : "#111827"
        }
      }
    )
  ] }) });
};
const columnHelper$3 = ui.createDataTableColumnHelper();
const columns$2 = [
  columnHelper$3.accessor("sku", {
    header: "SKU",
    enableSorting: true,
    sortLabel: "SKU",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A"
  }),
  columnHelper$3.accessor("variantName", {
    header: "Variant Name",
    enableSorting: true,
    sortLabel: "Variant Name",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A"
  }),
  columnHelper$3.accessor("inventoryQuantity", {
    header: "Inventory",
    enableSorting: true,
    sortLabel: "Inventory",
    sortAscLabel: "Low to High",
    sortDescLabel: "High to Low",
    cell: ({ getValue }) => {
      const value = getValue();
      return /* @__PURE__ */ jsxRuntime.jsx("p", { className: cn(value === 0 && "text-ui-fg-error"), children: value === 0 ? "Out of Stock" : value });
    }
  })
];
const PAGE_SIZE$1 = 10;
const ProductsTable = ({ products }) => {
  const [pagination, setPagination] = React__namespace.useState({
    pageSize: PAGE_SIZE$1,
    pageIndex: 0
  });
  const [search, setSearch] = React__namespace.useState("");
  const [sorting, setSorting] = React__namespace.useState(
    null
  );
  const shownProducts = React__namespace.useMemo(() => {
    let filtered = products.filter(
      (product) => product.variantName.toLowerCase().includes(search.toLowerCase()) || product.sku.toLowerCase().includes(search.toLowerCase())
    );
    if (sorting && sorting.id) {
      filtered = filtered.slice().sort((a, b) => {
        const aVal = a[sorting.id];
        const bVal = b[sorting.id];
        if (aVal < bVal) {
          return sorting.desc ? 1 : -1;
        }
        if (aVal > bVal) {
          return sorting.desc ? -1 : 1;
        }
        return 0;
      });
    }
    return filtered.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
  }, [products, search, sorting, pagination]);
  const table = ui.useDataTable({
    columns: columns$2,
    data: shownProducts,
    getRowId: (product) => product.sku,
    rowCount: products.length,
    search: {
      state: search,
      onSearchChange: setSearch
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination
    },
    sorting: {
      state: sorting,
      onSortingChange: setSorting
    },
    onRowClick: (_, row) => {
      navigateAdmin(`/products/${row.original.productId}/variants/${row.original.variantId}`);
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.DataTable, { instance: table, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Toolbar, { className: "px-0 pt-0", children: /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Search, { placeholder: "Search..." }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.DataTable.Table,
      {
        emptyState: {
          filtered: {
            heading: "No products found"
          },
          empty: {
            heading: "No products available"
          }
        }
      }
    ),
    products.length > PAGE_SIZE$1 && /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Pagination, {})
  ] });
};
async function retrieveProductAnalytics(date) {
  if (!date || !date.from || !(date == null ? void 0 : date.to)) {
    return void 0;
  }
  const dateFrom = dateFns.format(date.from, "yyyy-MM-dd");
  const dateTo = dateFns.format(date.to, "yyyy-MM-dd");
  const productAnalytics = await sdk.client.fetch(
    `/admin/agilo-analytics/products?date_from=${dateFrom}&date_to=${dateTo}`
  );
  return productAnalytics;
}
const useProductAnalytics = (query, options) => {
  return reactQuery.useQuery({
    queryKey: ["product-analytics", query == null ? void 0 : query.from, query == null ? void 0 : query.to],
    queryFn: async () => {
      const data = await retrieveProductAnalytics(query);
      return data;
    },
    ...options
  });
};
async function retrieveOrderAnalytics(preset, date) {
  let url = `/admin/agilo-analytics/orders?preset=${preset}`;
  if (date && date.from && date.to) {
    const dateFrom = dateFns.format(date.from, "yyyy-MM-dd");
    const dateTo = dateFns.format(date.to, "yyyy-MM-dd");
    url = `/admin/agilo-analytics/orders?preset=custom&date_from=${dateFrom}&date_to=${dateTo}`;
  }
  const orderAnalytics = await sdk.client.fetch(url);
  return orderAnalytics;
}
const useOrderAnalytics = (preset, query, options) => {
  return reactQuery.useQuery({
    queryKey: ["order-analytics", query == null ? void 0 : query.from, query == null ? void 0 : query.to],
    queryFn: async () => {
      const data = await retrieveOrderAnalytics(preset, query);
      return data;
    },
    ...options
  });
};
const Skeleton = ({
  className,
  ...props
}) => /* @__PURE__ */ jsxRuntime.jsx(
  "div",
  {
    ...props,
    className: tailwindMerge.twMerge(
      "animate-pulse rounded-md bg-[#F4F4F4] dark:bg-[#3F3F46]",
      className
    )
  }
);
const SmallCardSkeleton = () => /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
  /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-20 h-[1.4375rem] my-1" }),
  /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-40 h-3.5" })
] });
const LineChartSkeleton = () => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-full" }) });
};
const BarChartSkeleton = () => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-full" }) });
};
const PieChartSkeleton = () => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full aspect-square max-h-[400px]", children: /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-full" }) });
};
const dummyData$1 = [
  {
    a: "a",
    b: "b",
    c: 0
  },
  {
    a: "a",
    b: "b",
    c: 0
  },
  {
    a: "a",
    b: "b",
    c: 0
  },
  {
    a: "a",
    b: "b",
    c: 0
  },
  {
    a: "a",
    b: "b",
    c: 0
  },
  {
    a: "a",
    b: "b",
    c: 0
  }
];
const columnHelper$2 = ui.createDataTableColumnHelper();
const columns$1 = [
  columnHelper$2.accessor("a", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  }),
  columnHelper$2.accessor("b", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  }),
  columnHelper$2.accessor("c", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  })
];
const ProductsTableSkeleton = () => {
  const [search, setSearch] = React__namespace.useState("");
  const table = ui.useDataTable({
    columns: columns$1,
    data: dummyData$1,
    getRowId: (product) => product.a,
    rowCount: dummyData$1.length,
    search: {
      state: search,
      onSearchChange: setSearch
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.DataTable, { instance: table, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Toolbar, { className: "px-0 pt-0", children: /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Search, { placeholder: "Search..." }) }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Table, {})
  ] });
};
async function retrieveCustomersAnalytics(date) {
  if (!date || !date.from || !(date == null ? void 0 : date.to)) {
    return void 0;
  }
  const dateFrom = dateFns.format(date.from, "yyyy-MM-dd");
  const dateTo = dateFns.format(date.to, "yyyy-MM-dd");
  const customersAnalytics = await sdk.client.fetch(
    `/admin/agilo-analytics/customers?date_from=${dateFrom}&date_to=${dateTo}`
  );
  return customersAnalytics;
}
const useCustomerAnalytics = (query, options) => {
  return reactQuery.useQuery({
    queryKey: ["customer-analytics", query == null ? void 0 : query.from, query == null ? void 0 : query.to],
    queryFn: async () => {
      const data = await retrieveCustomersAnalytics(query);
      return data;
    },
    ...options
  });
};
const hasTechSpecs = (metadata) => {
  const details = metadata == null ? void 0 : metadata.tech_product_details;
  if (details && typeof details === "object") {
    return Object.values(details).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
  }
  return Array.isArray(metadata == null ? void 0 : metadata.specs) && metadata.specs.length > 0;
};
async function retrieveOperationsAnalytics(date) {
  if (!date || !date.from || !(date == null ? void 0 : date.to)) {
    return void 0;
  }
  const [productList, pendingReviews] = await Promise.all([
    sdk.client.fetch("/admin/products?limit=100&fields=id,title,metadata").catch(() => ({ products: [] })),
    sdk.client.fetch("/admin/product-reviews?status=pending&limit=1").catch(() => ({ count: 0 }))
  ]);
  const products2 = (productList == null ? void 0 : productList.products) || [];
  return {
    pending_reviews: (pendingReviews == null ? void 0 : pendingReviews.count) || 0,
    missing_tech_specs: products2.filter((product) => !hasTechSpecs(product.metadata)).length,
    products_checked: products2.length
  };
}
const useOperationsAnalytics = (query, options) => {
  return reactQuery.useQuery({
    queryKey: ["operations-analytics", query == null ? void 0 : query.from, query == null ? void 0 : query.to],
    queryFn: async () => {
      const data = await retrieveOperationsAnalytics(query);
      return data;
    },
    ...options
  });
};
const OperationsCard = ({ label, value, helper }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: label }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: value }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xsmall", className: "text-ui-fg-muted", children: helper })
  ] });
};
const formatMoney = (amount, currencyCode) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: currencyCode || "CAD"
}).format(amount || 0);
const openSalesPdf = ({ date, orders, operations, products, customers }) => {
  if (!date || !date.from || !date.to) {
    return;
  }
  const orderCount = (orders == null ? void 0 : orders.total_orders) || 0;
  const sales = (orders == null ? void 0 : orders.total_sales) || 0;
  const currencyCode = (orders == null ? void 0 : orders.currency_code) || "CAD";
  const lowStock = ((products == null ? void 0 : products.lowStockVariants) || []).filter((variant) => variant.inventoryQuantity > 0).length;
  const outOfStock = ((products == null ? void 0 : products.lowStockVariants) || []).filter((variant) => variant.inventoryQuantity === 0).length;
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    return;
  }
  printWindow.document.write(`
    <html>
      <head>
        <title>Tech Hub Sales Report</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 32px; }
          h1 { margin-bottom: 4px; }
          .muted { color: #6b7280; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 24px; }
          .card { border: 1px solid #d1d5db; padding: 16px; border-radius: 8px; }
          .label { color: #6b7280; font-size: 12px; margin-bottom: 8px; }
          .value { font-size: 24px; font-weight: 700; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h1>Tech Hub Sales Report</h1>
        <p class="muted">${dateFns.format(date.from, "yyyy-MM-dd")} to ${dateFns.format(date.to, "yyyy-MM-dd")}</p>
        <div class="grid">
          <div class="card"><div class="label">Total sales</div><div class="value">${formatMoney(sales, currencyCode)}</div></div>
          <div class="card"><div class="label">Total orders</div><div class="value">${orderCount}</div></div>
          <div class="card"><div class="label">Average order value</div><div class="value">${formatMoney(orderCount > 0 ? sales / orderCount : 0, currencyCode)}</div></div>
          <div class="card"><div class="label">Customers</div><div class="value">${(customers == null ? void 0 : customers.total_customers) || 0}</div></div>
          <div class="card"><div class="label">Pending reviews</div><div class="value">${(operations == null ? void 0 : operations.pending_reviews) || 0}</div></div>
          <div class="card"><div class="label">Missing tech specs</div><div class="value">${(operations == null ? void 0 : operations.missing_tech_specs) || 0}</div></div>
          <div class="card"><div class="label">Low stock variants</div><div class="value">${lowStock}</div></div>
          <div class="card"><div class="label">Out of stock variants</div><div class="value">${outOfStock}</div></div>
        </div>
        <script>window.print()</script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
const StackedBarChart = ({
  data,
  xAxisDataKey,
  yAxisTickFormatter,
  useStableColors = false,
  colorKeyField,
  dataKeys
}) => {
  const isDark = useDarkMode();
  const colors = React__namespace.default.useMemo(() => {
    if (!useStableColors || !data || !colorKeyField) {
      return [];
    }
    return generateColorsForData(data, colorKeyField, 70, isDark ? 60 : 50);
  }, [data, useStableColors, colorKeyField, isDark]);
  return /* @__PURE__ */ jsxRuntime.jsx(recharts.ResponsiveContainer, { aspect: 16 / 9, children: /* @__PURE__ */ jsxRuntime.jsxs(recharts.BarChart, { data, margin: { left: 20 }, children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.CartesianGrid,
      {
        strokeDasharray: "3 3",
        stroke: isDark ? "#374151" : "#E5E7EB"
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.XAxis,
      {
        dataKey: String(xAxisDataKey),
        tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
        axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickMargin: 10
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.YAxis,
      {
        tickFormatter: yAxisTickFormatter,
        allowDecimals: false,
        tick: { fill: isDark ? "#D1D5DB" : "#6B7280" },
        axisLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" },
        tickLine: { stroke: isDark ? "#4B5563" : "#D1D5DB" }
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Tooltip,
      {
        cursor: {
          fill: isDark ? "rgba(55, 65, 81, 0.2)" : "rgba(243, 244, 246, 0.5)"
        },
        formatter: yAxisTickFormatter ? yAxisTickFormatter : void 0,
        contentStyle: {
          backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
          border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
          borderRadius: "0.5rem",
          color: isDark ? "#F9FAFB" : "#111827",
          boxShadow: isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
        },
        labelStyle: {
          color: isDark ? "#F9FAFB" : "#111827",
          fontWeight: "500",
          marginBottom: "4px"
        }
      }
    ),
    dataKeys == null ? void 0 : dataKeys.map((key, index) => /* @__PURE__ */ jsxRuntime.jsx(
      recharts.Bar,
      {
        dataKey: String(key),
        stackId: "a",
        fill: useStableColors && colors.length > 0 ? colors[index] : "#3B82F6"
      },
      String(key)
    ))
  ] }) });
};
const dummyData = [
  {
    a: "a1",
    b: "b",
    c: 0,
    d: 0,
    e: /* @__PURE__ */ new Date()
  },
  {
    a: "a2",
    b: "b",
    c: 0,
    d: 0,
    e: /* @__PURE__ */ new Date()
  },
  {
    a: "a3",
    b: "b",
    c: 0,
    d: 0,
    e: /* @__PURE__ */ new Date()
  },
  {
    a: "a4",
    b: "b",
    c: 0,
    d: 0,
    e: /* @__PURE__ */ new Date()
  },
  {
    a: "a5",
    b: "b",
    c: 0,
    d: 0,
    e: /* @__PURE__ */ new Date()
  },
  {
    a: "a6",
    b: "b",
    c: 0,
    d: 0,
    e: /* @__PURE__ */ new Date()
  }
];
const columnHelper$1 = ui.createDataTableColumnHelper();
const columns = [
  columnHelper$1.accessor("a", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  }),
  columnHelper$1.accessor("b", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  }),
  columnHelper$1.accessor("c", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  }),
  columnHelper$1.accessor("d", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  }),
  columnHelper$1.accessor("e", {
    header: () => null,
    cell: () => /* @__PURE__ */ jsxRuntime.jsx(Skeleton, { className: "w-full h-5" })
  })
];
const CustomersTableSkeleton = () => {
  const [search, setSearch] = React__namespace.useState("");
  const table = ui.useDataTable({
    columns,
    data: dummyData,
    getRowId: (customer) => customer.a,
    rowCount: dummyData.length,
    search: {
      state: search,
      onSearchChange: setSearch
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.DataTable, { instance: table, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Toolbar, { className: "px-0 pt-0", children: /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Search, { placeholder: "Search..." }) }),
    /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Table, {})
  ] });
};
const columnHelper = ui.createDataTableColumnHelper();
const PAGE_SIZE = 10;
const CustomersTable = ({
  customers,
  currencyCode
}) => {
  const [pagination, setPagination] = React__namespace.useState({
    pageSize: PAGE_SIZE,
    pageIndex: 0
  });
  const [search, setSearch] = React__namespace.useState("");
  const [sorting, setSorting] = React__namespace.useState(
    null
  );
  const shownCustomers = React__namespace.useMemo(() => {
    let filtered = customers.filter(
      (customer) => customer.name.toLowerCase().includes(search.toLowerCase()) || customer.email.toLowerCase().includes(search.toLowerCase())
    );
    if (sorting && sorting.id) {
      filtered = filtered.slice().sort((a, b) => {
        const aVal = a[sorting.id];
        const bVal = b[sorting.id];
        if (!aVal && !bVal) return 0;
        if (!aVal) return sorting.desc ? 1 : -1;
        if (!bVal) return sorting.desc ? -1 : 1;
        if (aVal < bVal) return sorting.desc ? 1 : -1;
        if (aVal > bVal) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return filtered.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
  }, [customers, search, sorting, pagination]);
  const columns2 = React__namespace.useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        enableSorting: true,
        sortLabel: "Name",
        sortAscLabel: "A-Z",
        sortDescLabel: "Z-A"
      }),
      columnHelper.accessor("email", {
        header: "Email",
        enableSorting: true,
        sortLabel: "Email",
        sortAscLabel: "A-Z",
        sortDescLabel: "Z-A"
      }),
      columnHelper.accessor("order_count", {
        header: "Order Count",
        enableSorting: true,
        sortLabel: "Order Count",
        sortAscLabel: "Low to High",
        sortDescLabel: "High to Low"
      }),
      columnHelper.accessor("sales", {
        header: "Total Sales",
        enableSorting: true,
        sortLabel: "Total Sales",
        sortAscLabel: "Low to High",
        sortDescLabel: "High to Low",
        cell: ({ getValue }) => {
          const sales = getValue();
          return /* @__PURE__ */ jsxRuntime.jsx("p", { children: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode || "EUR"
          }).format(sales || 0) });
        }
      }),
      columnHelper.accessor("groups", {
        header: "Groups",
        cell: ({ getValue }) => {
          const groups = getValue();
          return /* @__PURE__ */ jsxRuntime.jsx("p", { children: groups.length ? groups.join(", ") : "No Group" });
        }
      }),
      columnHelper.accessor("last_order", {
        header: "Last Order",
        enableSorting: true,
        sortLabel: "Last Order",
        sortAscLabel: "Oldest to Newest",
        sortDescLabel: "Newest to Oldest",
        cell: ({ getValue }) => {
          const date = getValue();
          return /* @__PURE__ */ jsxRuntime.jsx("p", { children: date ? dateFns.format(new Date(date), "MMM dd, yyyy") : "No orders yet" });
        }
      })
    ],
    [currencyCode]
  );
  const table = ui.useDataTable({
    columns: columns2,
    data: shownCustomers,
    getRowId: (customer) => customer.customer_id,
    rowCount: customers.length,
    search: {
      state: search,
      onSearchChange: setSearch
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination
    },
    sorting: {
      state: sorting,
      onSortingChange: setSorting
    },
    onRowClick: (_, row) => {
      navigateAdmin(`/customers/${row.original.customer_id}`);
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.DataTable, { instance: table, children: [
    /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Toolbar, { className: "px-0 pt-0", children: /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Search, { placeholder: "Search..." }) }),
    /* @__PURE__ */ jsxRuntime.jsx(
      ui.DataTable.Table,
      {
        emptyState: {
          filtered: {
            heading: "No customers found"
          },
          empty: {
            heading: "No customers available"
          }
        }
      }
    ),
    customers.length > PAGE_SIZE && /* @__PURE__ */ jsxRuntime.jsx(ui.DataTable.Pagination, {})
  ] });
};
function dateToCalendarDate(date) {
  return new $35ea8db9cb2ccb90$export$99faa760c7908e4f(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}
function calendarDateToDate(calendarDate) {
  const year = "year" in calendarDate ? calendarDate.year : (/* @__PURE__ */ new Date()).getFullYear();
  const month = "month" in calendarDate ? calendarDate.month : (/* @__PURE__ */ new Date()).getMonth() + 1;
  const day = "day" in calendarDate ? calendarDate.day : (/* @__PURE__ */ new Date()).getDate();
  return new Date(year, month - 1, day);
}
function dateRangeToRangeValue(dateRange) {
  if (!(dateRange == null ? void 0 : dateRange.from)) return null;
  return {
    start: dateToCalendarDate(dateRange.from),
    end: dateRange.to ? dateToCalendarDate(dateRange.to) : dateToCalendarDate(dateRange.from)
  };
}
function rangeValueToDateRange(rangeValue) {
  if (!rangeValue) return void 0;
  return {
    from: calendarDateToDate(rangeValue.start),
    to: rangeValue.end ? calendarDateToDate(rangeValue.end) : void 0
  };
}
function presetToDateRange(preset) {
  const today = /* @__PURE__ */ new Date();
  if (preset === "this-month") return { from: dateFns.startOfMonth(today), to: today };
  if (preset === "last-month")
    return {
      from: dateFns.startOfMonth(dateFns.subMonths(today, 1)),
      to: dateFns.endOfMonth(dateFns.subMonths(today, 1))
    };
  return {
    from: dateFns.startOfMonth(dateFns.subMonths(today, 3)),
    to: dateFns.endOfMonth(dateFns.subMonths(today, 1))
  };
}
const DATE_RANGE_REGEX = /^(\d{4}-\d{2}-\d{2})-(\d{4}-\d{2}-\d{2})$/;
const AnalyticsPage = () => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const [searchParams, setSearchParamsState] = React__namespace.useState(getCurrentSearchParams);
  const setSearchParams = React__namespace.useCallback((params) => {
    const nextParams = params instanceof URLSearchParams ? params : new URLSearchParams(params);
    pushCurrentSearchParams(nextParams);
    setSearchParamsState(new URLSearchParams(nextParams.toString()));
  }, []);
  React__namespace.useEffect(() => {
    const handlePopState = () => setSearchParamsState(getCurrentSearchParams());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const rangeParam = searchParams.get("range") || "this-month";
  const date = React__namespace.useMemo(() => {
    if (rangeParam === "this-month" || rangeParam === "last-month" || rangeParam === "last-3-months") {
      return presetToDateRange(rangeParam);
    }
    const dates = rangeParam.match(DATE_RANGE_REGEX);
    if (dates) {
      const from = dateFns.parse(dates[1], "yyyy-MM-dd", /* @__PURE__ */ new Date());
      const to = dateFns.parse(dates[2], "yyyy-MM-dd", /* @__PURE__ */ new Date());
      return { from, to };
    }
    return void 0;
  }, [rangeParam]);
  const { data: products, isLoading: isLoadingProducts } = useProductAnalytics(date);
  const { data: customers, isLoading: isLoadingCustomers } = useCustomerAnalytics(date);
  const { data: orders, isLoading: isLoadingOrders } = useOrderAnalytics(
    ["this-month", "last-month", "last-3-months"].includes(rangeParam) ? rangeParam : "custom",
    date
  );
  const { data: operations, isLoading: isLoadingOperations } = useOperationsAnalytics(date);
  const someOrderCountsGreaterThanZero = (_a = orders == null ? void 0 : orders.order_count) == null ? void 0 : _a.some(
    (item) => item.count > 0
  );
  const someOrderSalesGreaterThanZero = (_b = orders == null ? void 0 : orders.order_sales) == null ? void 0 : _b.some(
    (item) => item.sales > 0
  );
  const someTopSellingProductsGreaterThanZero = (_c = products == null ? void 0 : products.variantQuantitySold) == null ? void 0 : _c.some((item) => item.quantity > 0);
  const someCustomerCountsGreaterThanZero = (_d = customers == null ? void 0 : customers.customer_count) == null ? void 0 : _d.some(
    (item) => (item.new_customers || 0) > 0 || (item.returning_customers || 0) > 0
  );
  const lowStockCount = ((_e = products == null ? void 0 : products.lowStockVariants) == null ? void 0 : _e.filter((variant) => variant.inventoryQuantity > 0).length) || 0;
  const outOfStockCount = ((_f = products == null ? void 0 : products.lowStockVariants) == null ? void 0 : _f.filter((variant) => variant.inventoryQuantity === 0).length) || 0;
  const averageOrderValue = (orders == null ? void 0 : orders.total_orders) ? ((orders == null ? void 0 : orders.total_sales) || 0) / orders.total_orders : 0;
  const updateDatePreset = React__namespace.useCallback(
    (preset) => {
      const params = new URLSearchParams(searchParams.toString());
      switch (preset) {
        case "this-month":
          params.set("range", "this-month");
          break;
        case "last-month":
          params.set("range", "last-month");
          break;
        case "last-3-months":
          params.set("range", "last-3-months");
          break;
        case "custom":
        default:
          if (rangeParam === "this-month" || rangeParam === "last-month" || rangeParam === "last-3-months") {
            const currentDate = presetToDateRange(rangeParam);
            params.set(
              "range",
              `${dateFns.format(currentDate.from || /* @__PURE__ */ new Date(), "yyyy-MM-dd")}-${dateFns.format(
                currentDate.to || /* @__PURE__ */ new Date(),
                "yyyy-MM-dd"
              )}`
            );
          }
          break;
      }
      setSearchParams(params);
    },
    [searchParams, rangeParam, setSearchParams]
  );
  const updateUrlParams = React__namespace.useCallback(
    (value) => {
      const params = new URLSearchParams(searchParams.toString());
      if ((value == null ? void 0 : value.from) && (value == null ? void 0 : value.to)) {
        params.set(
          "range",
          `${dateFns.format(value.from, "yyyy-MM-dd")}-${dateFns.format(
            value.to,
            "yyyy-MM-dd"
          )}`
        );
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );
  const handleDateRangeChange = React__namespace.useCallback(
    (value) => {
      const newDateRange = rangeValueToDateRange(value);
      updateUrlParams(newDateRange);
    },
    [updateUrlParams]
  );
  return /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "divide-y p-0", children: [
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-x-2 gap-y-4 items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntime.jsx(ui.Heading, { level: "h1", children: "Analytics" }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-[170px]", children: /* @__PURE__ */ jsxRuntime.jsxs(
          ui.Select,
          {
            disabled: isLoadingOrders || isLoadingProducts,
            defaultValue: "this-month",
            value: ["this-month", "last-month", "last-3-months"].includes(
              rangeParam
            ) ? rangeParam : "custom",
            onValueChange: updateDatePreset,
            children: [
              /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Trigger, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Value, {}) }),
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Select.Content, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: "this-month", children: "This Month" }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: "last-month", children: "Last Month" }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: "last-3-months", children: "Last 3 Months" }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Select.Item, { value: "custom", children: "Custom" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntime.jsxs(
          reactAriaComponents.DateRangePicker,
          {
            value: dateRangeToRangeValue(date),
            onChange: handleDateRangeChange,
            isDisabled: isLoadingOrders || isLoadingProducts,
            "aria-label": "Date range",
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs(reactAriaComponents.Group, { className: "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive justify-start focus-visible:shadow-borders-interactive-with-active disabled:bg-ui-bg-disabled disabled:text-ui-fg-disabled bg-ui-bg-field text-ui-fg-base txt-compact-small h-8 text-left font-normal data-[state=open]:!shadow-borders-interactive-with-active shadow-buttons-neutral hover:bg-ui-bg-field-hover outline-none transition-fg disabled:cursor-not-allowed min-w-[260px] bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-ui-bg-field-component dark:border-ui-border-base dark:hover:bg-ui-bg-field-hover px-4 border cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntime.jsx(icons.Calendar, { className: "h-4 w-4 text-ui-fg-muted group-disabled:text-ui-fg-disabled flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.DateInput, { slot: "start", className: "flex-1 min-w-0", children: (segment) => /* @__PURE__ */ jsxRuntime.jsx(
                  reactAriaComponents.DateSegment,
                  {
                    segment,
                    className: "outline-none rounded-sm focus:bg-ui-bg-interactive focus:text-ui-fg-on-color caret-transparent placeholder-shown:italic text-ui-fg-base data-[placeholder]:text-ui-fg-muted"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntime.jsx("span", { "aria-hidden": "true", className: "text-ui-fg-muted px-1", children: "—" }),
                /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.DateInput, { slot: "end", className: "flex-1 min-w-0", children: (segment) => /* @__PURE__ */ jsxRuntime.jsx(
                  reactAriaComponents.DateSegment,
                  {
                    segment,
                    className: "outline-none rounded-sm focus:bg-ui-bg-interactive focus:text-ui-fg-on-color caret-transparent placeholder-shown:italic text-ui-fg-base data-[placeholder]:text-ui-fg-muted"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.Button, { className: "text-ui-fg-muted hover:bg-ui-bg-subtle dark:hover:bg-ui-bg-subtle rounded p-1", children: /* @__PURE__ */ jsxRuntime.jsx(icons.ChevronDown, { className: "size-4" }) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.Popover, { className: "w-auto p-0 bg-transparent z-50", children: /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.Dialog, { className: "bg-ui-bg-base dark:bg-ui-bg-base border border-ui-border-base dark:border-ui-border-base rounded-lg shadow-lg p-6 max-w-fit", children: /* @__PURE__ */ jsxRuntime.jsxs(
                reactAriaComponents.RangeCalendar,
                {
                  className: "w-fit",
                  visibleDuration: { months: 2 },
                  children: [
                    /* @__PURE__ */ jsxRuntime.jsxs("header", { className: "flex items-center justify-between mb-4", children: [
                      /* @__PURE__ */ jsxRuntime.jsx(
                        reactAriaComponents.Button,
                        {
                          slot: "previous",
                          className: "p-2 hover:bg-ui-bg-subtle dark:hover:bg-ui-bg-subtle rounded text-ui-fg-base",
                          children: /* @__PURE__ */ jsxRuntime.jsx(icons.ChevronLeft, { className: "size-4" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.Heading, { className: "font-semibold text-lg text-ui-fg-base" }),
                      /* @__PURE__ */ jsxRuntime.jsx(
                        reactAriaComponents.Button,
                        {
                          slot: "next",
                          className: "p-2 hover:bg-ui-bg-subtle dark:hover:bg-ui-bg-subtle rounded text-ui-fg-base",
                          children: /* @__PURE__ */ jsxRuntime.jsx(icons.ChevronRight, { className: "size-4" })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-6", children: [
                      /* @__PURE__ */ jsxRuntime.jsx(reactAriaComponents.CalendarGrid, { className: "border-collapse gap-1", children: (date2) => /* @__PURE__ */ jsxRuntime.jsx(
                        reactAriaComponents.CalendarCell,
                        {
                          date: date2,
                          className: "w-9 h-9 text-sm cursor-pointer rounded flex items-center justify-center hover:bg-ui-bg-subtle dark:hover:bg-ui-bg-subtle selected:bg-ui-bg-interactive selected:text-ui-fg-on-color selection-start:bg-ui-bg-interactive selection-start:text-ui-fg-on-color selection-end:bg-ui-bg-interactive selection-end:text-ui-fg-on-color outside-month:text-ui-fg-disabled unavailable:text-ui-fg-disabled unavailable:cursor-default text-ui-fg-base data-[selected]:bg-ui-bg-interactive data-[selected]:text-ui-fg-on-color data-[selection-start]:bg-ui-bg-interactive data-[selection-start]:text-ui-fg-on-color data-[selection-end]:bg-ui-bg-interactive data-[selection-end]:text-ui-fg-on-color"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntime.jsx(
                        reactAriaComponents.CalendarGrid,
                        {
                          offset: { months: 1 },
                          className: "border-collapse gap-1",
                          children: (date2) => /* @__PURE__ */ jsxRuntime.jsx(
                            reactAriaComponents.CalendarCell,
                            {
                              date: date2,
                              className: "w-9 h-9 text-sm cursor-pointer rounded flex items-center justify-center hover:bg-ui-bg-subtle dark:hover:bg-ui-bg-subtle selected:bg-ui-bg-interactive selected:text-ui-fg-on-color selection-start:bg-ui-bg-interactive selection-start:text-ui-fg-on-color selection-end:bg-ui-bg-interactive selection-end:text-ui-fg-on-color outside-month:text-ui-fg-disabled unavailable:text-ui-fg-disabled unavailable:cursor-default text-ui-fg-base data-[selected]:bg-ui-bg-interactive data-[selected]:text-ui-fg-on-color data-[selection-start]:bg-ui-bg-interactive data-[selection-start]:text-ui-fg-on-color data-[selection-end]:bg-ui-bg-interactive data-[selection-end]:text-ui-fg-on-color"
                            }
                          )
                        }
                      )
                    ] })
                  ]
                }
              ) }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(
        ui.Button,
        {
          size: "small",
          variant: "secondary",
          className: "shadow-elevation-card-rest gap-x-2",
          title: "Open a print-ready sales report for this date range",
          disabled: isLoadingOrders || isLoadingProducts || isLoadingCustomers || isLoadingOperations,
          onClick: () => openSalesPdf({ date, orders, operations, products, customers }),
          children: [
            /* @__PURE__ */ jsxRuntime.jsx(icons.DocumentText, {}),
            "Export sales report",
            /* @__PURE__ */ jsxRuntime.jsx(icons.ArrowDownTray, {})
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid gap-4 px-6 py-4 md:grid-cols-2 xl:grid-cols-4", children: [
      isLoadingOperations ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Pending reviews", value: (operations == null ? void 0 : operations.pending_reviews) || 0, helper: "Reviews waiting for approval" }),
      isLoadingOperations ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Missing tech specs", value: (operations == null ? void 0 : operations.missing_tech_specs) || 0, helper: `${(operations == null ? void 0 : operations.products_checked) || 0} products checked` }),
      isLoadingProducts ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Low stock", value: lowStockCount, helper: "Variants below stock threshold" }),
      isLoadingProducts ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Out of stock", value: outOfStockCount, helper: "Variants with zero inventory" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "grid gap-4 px-6 py-4 md:grid-cols-2 xl:grid-cols-4", children: [
      isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Average order value", value: formatMoney(averageOrderValue, (orders == null ? void 0 : orders.currency_code) || "CAD"), helper: "Sales divided by orders" }),
      isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "New customers", value: (customers == null ? void 0 : customers.new_customers) || 0, helper: "New customers in period" }),
      isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Returning customers", value: (customers == null ? void 0 : customers.returning_customers) || 0, helper: "Repeat buyers in period" }),
      /* @__PURE__ */ jsxRuntime.jsx(OperationsCard, { label: "Next workflow", value: "Abandoned carts", helper: "Ready for recovery metrics" })
    ] }),
    /* @__PURE__ */ jsxRuntime.jsx("div", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntime.jsxs(
      ui.Tabs,
      {
        value: searchParams.get("tab") || "orders",
        onValueChange: (value) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("tab", value);
          setSearchParams(params);
        },
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs(ui.Tabs.List, { children: [
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Tabs.Trigger,
              {
                value: "orders",
                disabled: isLoadingOrders || isLoadingProducts,
                children: "Orders"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Tabs.Trigger,
              {
                value: "products",
                disabled: isLoadingOrders || isLoadingProducts,
                children: "Products"
              }
            ),
            /* @__PURE__ */ jsxRuntime.jsx(
              ui.Tabs.Trigger,
              {
                value: "customers",
                disabled: isLoadingOrders || isLoadingProducts,
                children: "Customers"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Tabs.Content, { value: "orders", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex max-md:flex-col gap-4 mb-4", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4 flex-1", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(icons.ShoppingCart, { className: "absolute right-6 top-4 text-ui-fg-muted" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: "Total Orders" }),
                    isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: (orders == null ? void 0 : orders.total_orders) || 0 }),
                      /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: "xsmall", className: "text-ui-fg-muted", children: [
                        ((orders == null ? void 0 : orders.prev_orders_percent) || 0) > 0 && "+",
                        (orders == null ? void 0 : orders.prev_orders_percent) || 0,
                        "% from previous period"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "min-h-[9.375rem]", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Orders Over Time" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Total number of orders in the selected period" }),
                    isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(LineChartSkeleton, {}) : (orders == null ? void 0 : orders.order_count) && ((_e = orders == null ? void 0 : orders.order_count) == null ? void 0 : _e.length) > 0 && someOrderCountsGreaterThanZero ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                      LineChart,
                      {
                        data: orders == null ? void 0 : orders.order_count,
                        xAxisDataKey: "name",
                        yAxisDataKey: "count"
                      }
                    ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                      ui.Text,
                      {
                        size: "small",
                        className: "text-ui-fg-muted text-center",
                        children: "No data available for the selected period."
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4 flex-1", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChartNoAxesCombined, { className: "absolute right-6 text-ui-fg-muted top-4 size-[15px]" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: "Total Sales" }),
                    isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: (orders == null ? void 0 : orders.currency_code) || "EUR"
                      }).format((orders == null ? void 0 : orders.total_sales) || 0) }),
                      /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: "xsmall", className: "text-ui-fg-muted", children: [
                        ((orders == null ? void 0 : orders.prev_sales_percent) || 0) > 0 && "+",
                        (orders == null ? void 0 : orders.prev_sales_percent) || 0,
                        "% from previous period"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "min-h-[9.375rem]", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Sales Over Time" }),
                    /* @__PURE__ */ jsxRuntime.jsxs(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: [
                      "Total sales in the selected period (",
                      orders == null ? void 0 : orders.currency_code,
                      ")"
                    ] }),
                    isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(LineChartSkeleton, {}) : (orders == null ? void 0 : orders.order_sales) && ((_f = orders == null ? void 0 : orders.order_sales) == null ? void 0 : _f.length) > 0 && someOrderSalesGreaterThanZero ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                      LineChart,
                      {
                        data: orders.order_sales,
                        xAxisDataKey: "name",
                        yAxisDataKey: "sales",
                        lineColor: "#82ca9d",
                        yAxisTickFormatter: (value) => new Intl.NumberFormat("en-US", {
                          currency: orders.currency_code,
                          maximumFractionDigits: 0
                        }).format(
                          typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0
                        )
                      }
                    ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                      ui.Text,
                      {
                        size: "small",
                        className: "text-ui-fg-muted text-center",
                        children: "No data available for the selected period."
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex max-md:flex-col gap-4", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "min-h-[9.375rem]", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Top Regions by Sales" }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Sales breakdown by region in the selected period" }),
                  isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(BarChartSkeleton, {}) : (orders == null ? void 0 : orders.regions) && ((_g = orders == null ? void 0 : orders.regions) == null ? void 0 : _g.length) > 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                    BarChart,
                    {
                      data: orders.regions,
                      xAxisDataKey: "name",
                      yAxisDataKey: "sales",
                      lineColor: "#82ca9d",
                      useStableColors: true,
                      colorKeyField: "name",
                      yAxisTickFormatter: (value) => new Intl.NumberFormat("en-US", {
                        currency: orders.currency_code,
                        maximumFractionDigits: 0
                      }).format(
                        typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0
                      )
                    }
                  ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Text,
                    {
                      size: "small",
                      className: "text-ui-fg-muted text-center",
                      children: "No data available for the selected period."
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "min-h-[9.375rem]", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Order Status Breakdown" }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Distribution of orders by status in the selected period" }),
                  isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(PieChartSkeleton, {}) : (orders == null ? void 0 : orders.statuses) && ((_h = orders == null ? void 0 : orders.statuses) == null ? void 0 : _h.length) > 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(PieChart, { data: orders == null ? void 0 : orders.statuses, dataKey: "count" }) }) : /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Text,
                    {
                      size: "small",
                      className: "text-ui-fg-muted text-center",
                      children: "No data available for the selected period."
                    }
                  )
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Tabs.Content, { value: "products", children: [
              /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "mb-4 min-h-[9.375rem]", children: [
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Top-Selling Products" }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Products by quantity sold in selected period" }),
                isLoadingProducts ? /* @__PURE__ */ jsxRuntime.jsx(BarChartSkeleton, {}) : (products == null ? void 0 : products.variantQuantitySold) && someTopSellingProductsGreaterThanZero ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                  BarChart,
                  {
                    data: products.variantQuantitySold,
                    xAxisDataKey: "title",
                    yAxisDataKey: "quantity",
                    lineColor: "#82ca9d",
                    useStableColors: true,
                    colorKeyField: "title"
                  }
                ) }) : /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "text-ui-fg-muted text-center", children: "No data available for the selected period." })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex gap-4 max-xl:flex-col", children: [
                /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Out-of-Stock Variants" }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Products with zero inventory" }),
                  isLoadingProducts ? /* @__PURE__ */ jsxRuntime.jsx(ProductsTableSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(
                    ProductsTable,
                    {
                      products: ((_i = products == null ? void 0 : products.lowStockVariants) == null ? void 0 : _i.filter(
                        (product) => product.inventoryQuantity === 0
                      )) || []
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Low Stock Variants" }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Products with inventory below threshold" }),
                  isLoadingProducts ? /* @__PURE__ */ jsxRuntime.jsx(ProductsTableSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(
                    ProductsTable,
                    {
                      products: ((_j = products == null ? void 0 : products.lowStockVariants) == null ? void 0 : _j.filter(
                        (product) => product.inventoryQuantity > 0
                      )) || []
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntime.jsxs(ui.Tabs.Content, { value: "customers", children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex max-md:flex-col gap-4 mb-4", children: [
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4 flex-1", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(icons.User, { className: "absolute right-6 top-4 text-ui-fg-muted" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: "Total Customers" }),
                    isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: (customers == null ? void 0 : customers.total_customers) || 0 }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(icons.User, { className: "absolute right-6 top-4 text-ui-fg-muted" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: "New Customers" }),
                    isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: (customers == null ? void 0 : customers.new_customers) || 0 }) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4 flex-1", children: [
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(icons.User, { className: "absolute right-6 text-ui-fg-muted top-4 size-[15px]" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: "Returning Customers" }),
                    isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: (customers == null ? void 0 : customers.returning_customers) || 0 }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "relative", children: [
                    /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChartNoAxesCombined, { className: "absolute right-6 top-4 text-ui-fg-muted" }),
                    /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", children: "Average Sales per Customer" }),
                    isLoadingCustomers || isLoadingOrders ? /* @__PURE__ */ jsxRuntime.jsx(SmallCardSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, { children: /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: new Intl.NumberFormat("en-US", {
                      currency: (customers == null ? void 0 : customers.currency_code) || "EUR",
                      style: "currency"
                    }).format(
                      (customers == null ? void 0 : customers.total_customers) && customers.total_customers > 0 ? ((orders == null ? void 0 : orders.total_sales) || 0) / customers.total_customers : 0
                    ) }) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex max-md:flex-col gap-4 mb-4", children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "min-h-[9.375rem]", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "New vs. Returning Customers" }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Distribution of new and returning customers in the selected period" }),
                  isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(BarChartSkeleton, {}) : (customers == null ? void 0 : customers.customer_count) && customers.customer_count.length > 0 && someCustomerCountsGreaterThanZero ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                    StackedBarChart,
                    {
                      data: customers.customer_count,
                      xAxisDataKey: "name",
                      lineColor: "#82ca9d",
                      useStableColors: true,
                      colorKeyField: "returning_customers",
                      dataKeys: ["new_customers", "returning_customers"]
                    }
                  ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Text,
                    {
                      size: "small",
                      className: "text-ui-fg-muted text-center",
                      children: "No data available for the selected period."
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { className: "min-h-[9.375rem]", children: [
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Top Customer Groups by Sales" }),
                  /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Sales breakdown by customer group in the selected period" }),
                  isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(BarChartSkeleton, {}) : (customers == null ? void 0 : customers.customer_group) && customers.customer_group.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "w-full", style: { aspectRatio: "16/9" }, children: /* @__PURE__ */ jsxRuntime.jsx(
                    BarChart,
                    {
                      data: customers.customer_group,
                      xAxisDataKey: "name",
                      lineColor: "#82ca9d",
                      useStableColors: true,
                      colorKeyField: "name",
                      yAxisDataKey: "total",
                      yAxisTickFormatter: (value) => new Intl.NumberFormat("en-US", {
                        currency: customers.currency_code || "EUR",
                        maximumFractionDigits: 0
                      }).format(
                        typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0
                      )
                    }
                  ) }) : /* @__PURE__ */ jsxRuntime.jsx(
                    ui.Text,
                    {
                      size: "small",
                      className: "text-ui-fg-muted text-center",
                      children: "No data available for the selected period."
                    }
                  )
                ] }) })
              ] }),
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex gap-4 max-xl:flex-col", children: /* @__PURE__ */ jsxRuntime.jsxs(ui.Container, { children: [
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "xlarge", weight: "plus", children: "Top Customers by Sales" }),
                /* @__PURE__ */ jsxRuntime.jsx(ui.Text, { size: "small", className: "mb-8 text-ui-fg-muted", children: "Customers by sales in the selected period" }),
                isLoadingCustomers ? /* @__PURE__ */ jsxRuntime.jsx(CustomersTableSkeleton, {}) : /* @__PURE__ */ jsxRuntime.jsx(
                  CustomersTable,
                  {
                    customers: (customers == null ? void 0 : customers.customer_sales) || [],
                    currencyCode: (customers == null ? void 0 : customers.currency_code) || "EUR"
                  }
                )
              ] }) })
            ] })
          ] })
        ]
      }
    ) })
  ] });
};
const config = adminSdk.defineRouteConfig({
  label: "Analytics",
  icon: icons.ChartBar
});
const widgetModule = { widgets: [] };
const routeModule = {
  routes: [
    {
      Component: AnalyticsPage,
      path: "/analytics"
    }
  ]
};
const menuItemModule = {
  menuItems: [
    {
      label: config.label,
      icon: config.icon,
      path: "/analytics",
      nested: void 0,
      rank: void 0,
      translationNs: void 0
    }
  ]
};
const formModule = { customFields: {} };
const displayModule = {
  displays: {}
};
const i18nModule = { resources: {} };
const plugin = {
  widgetModule,
  routeModule,
  menuItemModule,
  formModule,
  displayModule,
  i18nModule
};
module.exports = plugin;
