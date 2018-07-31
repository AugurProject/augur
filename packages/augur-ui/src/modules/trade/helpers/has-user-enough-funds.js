import memoize from 'memoizee'
import { createBigNumber } from 'utils/create-big-number'
import { ZERO } from 'modules/trade/constants/numbers'

/**
 * Returns true if user has enough funds for trades, false otherwise
 *
 * @param {Array} trades
 * @param {Object} loginAccount
 * @return {boolean}
 */
export default memoize((trades, loginAccount) => {
  if (!loginAccount || loginAccount.address == null || loginAccount.ether == null) {
    return false
  }

  const totalCost = trades.reduce((totalCost, trade) => (
    trade.side === 'buy' ?
      totalCost.plus(createBigNumber(trade.totalCost.value, 10)) :
      totalCost.plus(createBigNumber(trade.totalFee.value, 10))
  ), ZERO)
  return totalCost.lte(createBigNumber(loginAccount.ether, 10))
}, { max: 10 })
