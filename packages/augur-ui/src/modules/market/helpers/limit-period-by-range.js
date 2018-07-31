/**
 * @typedef {Object} Duration
 * @property {string} label
 * @property {number} duration
 * @property {boolean} [isDefault]
 */

/**
 * We need to limit periods to a set whose duration is no longer than that of the passed range.
 * e.g. A period of day would be not be valid if a range of hour was selected.
 * @param {Duration[]} fullPeriodList - The possible periods we can select from.
 * @param {number} [selectedRange]    - The duration of the range we are filtering by.
 * @return {Duration[]}               - An array of periods that are still 'legal'.
 */
export const limitPeriodByRange = (fullPeriodList, selectedRange) => {
  if (!selectedRange) {
    return fullPeriodList.slice()
  }

  return fullPeriodList.filter(period => period.duration < selectedRange)
}
