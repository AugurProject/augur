import { isEmpty } from 'lodash'

export default function findPeriodSeriesBounds(priceTimeSeries = []) {
  const DEFAULT_BOUNDS = {
    min: null,
    max: null,
  }

  if (isEmpty(priceTimeSeries)) return DEFAULT_BOUNDS

  return (priceTimeSeries).reduce((p, item, i) => {
    const currentItem = item

    if (i === 0) {
      return {
        min: currentItem.low,
        max: currentItem.high,
      }
    }

    return {
      min: currentItem.low < p.min ? currentItem.low : p.min,
      max: currentItem.high > p.max ? currentItem.high : p.max,
    }
  }, DEFAULT_BOUNDS)
}
