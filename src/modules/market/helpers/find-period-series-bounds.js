import { isEmpty } from 'lodash'

import { createBigNumber } from 'utils/create-big-number'

export default function findPeriodSeriesBounds(periodTimeSeries = []) {
  const DEFAULT_BOUNDS = {
    min: createBigNumber(0),
    max: createBigNumber(0),
  }

  if (isEmpty(periodTimeSeries)) return DEFAULT_BOUNDS

  return (periodTimeSeries).reduce((p, item, i) => {
    const currentItem = item

    if (i === 0) {
      return {
        min: currentItem.low,
        max: currentItem.high,
      }
    }

    return {
      min: currentItem.low.lt(p.min) ? currentItem.low : p.min,
      max: currentItem.high.gt(p.max) ? currentItem.high : p.max,
    }
  }, DEFAULT_BOUNDS)
}
