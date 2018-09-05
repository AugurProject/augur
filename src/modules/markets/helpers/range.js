import { compose, find, partial, property } from "lodash/fp";

// 'full' meaning no partial application
import { clampPeriodByRange as fullClampPeriodByRange } from "modules/markets/helpers/clamp-period-by-range";
import { getDefaultRangePeriodDuration } from "modules/markets/helpers/get-default-range-period-durations";
import { PERIODS, RANGES } from "modules/markets/constants/permissible-periods";
import { limitPeriodByRange as fullLimitPeriodByRange } from "modules/markets/helpers/limit-period-by-range";

export const clampPeriodByRange = partial(fullClampPeriodByRange, [PERIODS]);

// This will be an object and should only be computed once.
export const defaultRangePeriodDurations = getDefaultRangePeriodDuration(
  RANGES,
  PERIODS
);

export const limitPeriodByRange = partial(fullLimitPeriodByRange, [PERIODS]);

export const getTickIntervalForRange = range =>
  compose(
    property("tickInterval"),
    find({ duration: range })
  )(RANGES);
