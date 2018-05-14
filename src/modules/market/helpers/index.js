import { compose, find, partial, property } from 'lodash/fp'

// 'full' meaning no partial application
import { clampPeriodByRange as fullClampPeriodByRange } from 'src/modules/market/helpers/clamp-period-by-range'
import { getDefaultRangePeriodDuration } from 'src/modules/market/helpers/get-default-range-period-durations'
import { PERIODS, RANGES } from 'src/modules/market/constants/permissible-periods'
import { limitPeriodByRange as fullLimitPeriodByRange } from 'src/modules/market/helpers/limit-period-by-range'

export const clampPeriodByRange = partial(fullClampPeriodByRange, [
  PERIODS,
])

// This will be an object and should only be computed once.
export const defaultRangePeriodDurations = getDefaultRangePeriodDuration(RANGES, PERIODS)

export const limitPeriodByRange = partial(fullLimitPeriodByRange, [
  PERIODS,
])

export const getTickIntervalForRange = range => compose(
  property('tickInterval'),
  find({ duration: range }),
)(RANGES)
