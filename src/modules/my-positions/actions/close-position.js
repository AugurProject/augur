import { WrappedBigNumber } from 'utils/wrapped-big-number'
import { updateTradesInProgress } from 'modules/trade/actions/update-trades-in-progress'
import { placeTrade } from 'modules/trade/actions/place-trade'
import { addClosePositionTradeGroup } from 'modules/my-positions/actions/add-close-position-trade-group'
import { clearClosePositionOutcome } from 'modules/my-positions/actions/clear-close-position-outcome'
import selectAllMarkets from 'modules/markets/selectors/markets-all'

import loadBidsAsks from 'modules/bids-asks/actions/load-bids-asks'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { CLOSE_DIALOG_FAILED, CLOSE_DIALOG_NO_ORDERS } from 'modules/market/constants/close-dialog-status'
import { ZERO } from 'modules/trade/constants/numbers'

import getValue from 'utils/get-value'

export function closePosition(marketId, outcomeId) {
  return (dispatch, getState) => {
    // Lock trading + update close position status
    dispatch(addClosePositionTradeGroup(marketId, outcomeId, ''))

    // Load order book + execute trade if possible
    dispatch(loadBidsAsks(marketId, () => {
      const { orderBooks, loginAccount } = getState()
      const markets = selectAllMarkets()
      const market = markets.length ? markets.find(market => market.id === marketId) : null
      const positionOutcome = market ? (market.outcomes || []).find(outcome => parseInt(outcome.id, 10) === parseInt(outcomeId, 10)) : null
      const positionShares = WrappedBigNumber(getValue(positionOutcome, 'position.qtyShares.value') || '0')
      const orderBook = orderBooks[marketId]
      const userAddress = loginAccount && loginAccount.address
      const bestFill = getBestFill(orderBook, positionShares.toNumber() > 0 ? BUY : SELL, positionShares.absoluteValue(), marketId, outcomeId, userAddress)
      if (bestFill.amountOfShares.isEqualTo(ZERO)) {
        dispatch(clearClosePositionOutcome(marketId, outcomeId))
        dispatch(addClosePositionTradeGroup(marketId, outcomeId, CLOSE_DIALOG_NO_ORDERS))
      } else {
        dispatch(updateTradesInProgress(marketId, outcomeId, positionShares.toNumber() > 0 ? SELL : BUY, bestFill.amountOfShares.toNumber(), bestFill.price.toNumber(), null, () => {
          const { tradesInProgress } = getState()
          dispatch(placeTrade(marketId, outcomeId, tradesInProgress[marketId], true, (err, tradeGroupId) => {
            if (err) {
              console.error('placeTrade err -- ', err)
              dispatch(addClosePositionTradeGroup(marketId, outcomeId, CLOSE_DIALOG_FAILED))
            } else {
              dispatch(addClosePositionTradeGroup(marketId, outcomeId, tradeGroupId))
            }
          }))
        }))
      }
    }))
  }
}

export function getBestFill(orderBook, side, shares, marketId, outcomeId, userAddress) {
  let price = ZERO
  let amountOfShares = ZERO

  Object.keys(orderBook[side] || {}).reduce((p, orderId) => {
    const orderOutcome = getValue(orderBook, `${side}.${orderId}`)

    if (orderOutcome.outcome === outcomeId && orderOutcome.owner !== userAddress) {
      p.push(orderOutcome)
    }

    return p
  }, []).sort((a, b) => {
    const aBN = WrappedBigNumber(a.fullPrecisionPrice)
    const bBN = WrappedBigNumber(b.fullPrecisionPrice)
    if (side === BUY) {
      return bBN-aBN
    }

    return aBN-bBN
  }).find((order) => {
    amountOfShares = amountOfShares.plus(WrappedBigNumber(order.fullPrecisionAmount))
    price = WrappedBigNumber(order.fullPrecisionPrice)

    if (amountOfShares.toNumber() >= shares.toNumber()) {
      amountOfShares = shares
      return true
    }

    return false
  })

  return { amountOfShares, price }
}
