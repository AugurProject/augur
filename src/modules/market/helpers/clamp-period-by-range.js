import { compose, inRange, floor, map, sortedUniq } from 'lodash/fp'
import { limitPeriodByRange } from 'src/modules/market/helpers/limit-period-by-range'

const getMiddleElementOfArray = (arr = []) => {
  const l = arr.length
  const i = floor(l / 2)

  return arr[i]
}


const getMiddleDuration = compose(
  getMiddleElementOfArray,
  sortedUniq,
  map('duration'),
)

/**
 * @typedef {Object} Duration
 * @property {string} label
 * @property {number} duration
 * @property {boolean} [isDefault]
 */

/**
 * We need to ensure the currently selected period is valid. If not, we need to select the closest valid one.
 * @param {Duration[]} fullPeriodList - The possible periods we can select from.
 * @param {number} [selectedRange] - The duration of the selectedRange. If omitted, return min period value.
 * @param {number} [selectedPeriod] - The duration of the selectedPeriod. If omitted, return nearest.
 *
 * @return {number} - The duration of the clamped period.
 */
export const clampPeriodByRange = (fullPeriodList, selectedRange, selectedPeriod) => {
  if (!selectedRange) return null

  if (inRange(0, selectedRange)(selectedPeriod)) return selectedPeriod

  const limitedPeriods = limitPeriodByRange(fullPeriodList, selectedRange)
  return getMiddleDuration(limitedPeriods)
}
