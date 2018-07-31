import { compose, defaultTo, map, max, min, toString } from 'lodash/fp'

const getMinFn = marketMin => compose(
  toString,
  defaultTo(marketMin),
  min,
  map('low'),
)

const getMaxFn = marketMax => compose(
  toString,
  defaultTo(marketMax),
  max,
  map('high'),
)

export default function findPeriodSeriesBounds(periodTimeSeries = [], marketMin = 0, marketMax = 1) {
  return {
    min: getMinFn(marketMin)(periodTimeSeries),
    max: getMaxFn(marketMax)(periodTimeSeries),
  }
}
