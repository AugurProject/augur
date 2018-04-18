import { isEmpty } from 'lodash'

import { createBigNumber } from 'utils/create-big-number'

export default function findPeriodSeriesBounds(periodTimeSeries = [], marketMin = createBigNumber(0), marketMax = createBigNumber(1)) {
  console.log('marketMin/Max -- ', marketMin.toNumber(), marketMax.toNumber())

  const DEFAULT_BOUNDS = {
    min: marketMin,
    max: marketMax,
  }

  if (isEmpty(periodTimeSeries)) return DEFAULT_BOUNDS

  return (periodTimeSeries).reduce((p, item, i) => {
    if (i === 0) {
      return {
        min: item.low,
        max: item.high,
      }
    }

    return {
      min: item.low.lt(p.min) ? item.low : p.min,
      max: item.high.gt(p.max) ? item.high : p.max,
    }
  }, DEFAULT_BOUNDS)
}
