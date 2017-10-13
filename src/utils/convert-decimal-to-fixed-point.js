import BigNumber from 'bignumber.js'

/**
 * @param {string|number} decimalValue
 * @param {number} conversionFactor
 * @return {string}
 */
export default function (decimalValue, conversionFactor) {
  return new BigNumber(decimalValue, 10).times(new BigNumber(conversionFactor, 10)).toFixed()
}
