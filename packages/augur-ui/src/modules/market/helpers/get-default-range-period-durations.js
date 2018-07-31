import {
  compose,
  find,
  property,
} from 'lodash/fp'

const findFn = compose(
  property('duration'),
  find(['isDefault', true]),
)

/**
 * @typedef {Object} Duration
 * @property {string} label
 * @property {number} duration
 * @property {boolean} [isDefault]
 */

/**
 * @typedef {Object} DefaultRangeAndPeriod
 * @property {number} range
 * @property {number} period
 */

/**
 * @param {Duration[]} fullRangeList
 * @param {Duration[]} fullPeriodList
 *
 * @return {DefaultRangeAndPeriod}
 */
export const getDefaultRangePeriodDuration = (fullRangeList, fullPeriodList) => ({
  range: findFn(fullRangeList),
  period: findFn(fullPeriodList),
})

