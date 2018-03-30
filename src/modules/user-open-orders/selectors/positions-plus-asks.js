import { createBigNumber } from 'utils/create-big-number'
import { createBigCacheSelector } from 'utils/big-cache-selector'
import store from 'src/store'
import { selectLoginAccountAddress, selectAccountPositionsState, selectOrderBooksState } from 'src/select-state'
import { ZERO } from 'modules/trade/constants/numbers'
import { isOrderOfUser } from 'modules/bids-asks/helpers/is-order-of-user'

import getValue from 'utils/get-value'

export default function () {
  return selectPositionsPlusAsks(store.getState())
}

/**
 * @param {String} account
 * @param {Object} positions
 * @param {Object} orderBooks
 * @return {Object} Total number of shares in positions and open ask orders.
 */
export const selectPositionsPlusAsks = createBigCacheSelector(10)(
  selectLoginAccountAddress,
  selectAccountPositionsState,
  selectOrderBooksState,
  (address, positions, orderBooks) => {
    if (!positions) return null
    const adjustedMarkets = Object.keys(positions)
    const numAdjustedMarkets = adjustedMarkets.length
    const positionsPlusAsks = {}
    let marketId
    for (let i = 0; i < numAdjustedMarkets; ++i) {
      marketId = adjustedMarkets[i]

      // NOTE --  This conditional is here to accomodate the scenario where
      //          a user has positions within a market + no orders.
      //          The order book is not loaded due to lazy load
      const asks = getValue(orderBooks, `${marketId}.sell`)
      if (asks && Object.keys(asks).length) {
        positionsPlusAsks[marketId] = selectMarketPositionPlusAsks(address, positions[marketId], asks)
      } else {
        positionsPlusAsks[marketId] = positions[marketId]
      }
    }

    return positionsPlusAsks
  },
)

/**
 * @param {String} account
 * @param {Object} position
 * @param {Object} asks
 * @return {Object} Total number of shares in positions and open ask orders.
 */
export const selectMarketPositionPlusAsks = (account, position, asks) => {
  const positionPlusAsks = {}
  if (asks) {
    const adjustedOutcomes = Object.keys(position)
    const numAdjustedOutcomes = adjustedOutcomes.length
    for (let j = 0; j < numAdjustedOutcomes; ++j) {
      positionPlusAsks[adjustedOutcomes[j]] = createBigNumber(position[adjustedOutcomes[j]], 10).plus(getOpenAskShares(account, adjustedOutcomes[j], asks)).toFixed()
    }
  }
  return positionPlusAsks
}

/**
 * @param {String} outcomeId
 * @param {String} account
 * @param {Object} askOrders
 * @return {BigNumber} Total number of shares in open ask orders.
 */
export function getOpenAskShares(account, outcomeId, askOrders) {
  if (!account || !askOrders) return ZERO
  let order
  let askShares = ZERO
  const orderIds = Object.keys(askOrders)
  const numOrders = orderIds.length
  for (let i = 0; i < numOrders; ++i) {
    order = askOrders[orderIds[i]]
    if (isOrderOfUser(order, account) && order.outcome === outcomeId) {
      askShares = askShares.plus(createBigNumber(order.amount, 10))
    }
  }
  return askShares
}
