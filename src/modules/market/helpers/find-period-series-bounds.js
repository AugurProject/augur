import { isEmpty } from 'lodash'

export default function findPeriodSeriesBounds(periodTimeSeries = [], marketMin = 0, marketMax = 1) {
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
      min: Math.min(item.low, p.min).toString(),
      max: Math.max(item.high, p.max).toString(),
    }
  }, DEFAULT_BOUNDS)
}
