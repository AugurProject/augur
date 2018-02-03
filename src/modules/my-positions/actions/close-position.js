import BigNumber from 'bignumber.js'
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

export function closePosition(marketID, outcomeID) {
  return (dispatch, getState) => {
    // Lock trading + update close position status
    dispatch(addClosePositionTradeGroup(marketID, outcomeID, ''))

    // Load order book + execute trade if possible
    dispatch(loadBidsAsks(marketID, () => {
      const { orderBooks, loginAccount } = getState()
      const markets = selectAllMarkets()
      const market = markets.length ? markets.find(market => market.id === marketID) : null
      const positionOutcome = market ? market.outcomes.find(outcome => parseInt(outcome.id, 10) === parseInt(outcomeID, 10)) : null
      const positionShares = new BigNumber(getValue(positionOutcome, 'position.qtyShares.value') || '0')
      const orderBook = orderBooks[marketID]
      const userAddress = loginAccount && loginAccount.address
      const bestFill = getBestFill(orderBook, positionShares.toNumber() > 0 ? BUY : SELL, positionShares.absoluteValue(), marketID, outcomeID, userAddress)
      if (bestFill.amountOfShares.equals(ZERO)) {
        dispatch(clearClosePositionOutcome(marketID, outcomeID))
        dispatch(addClosePositionTradeGroup(marketID, outcomeID, CLOSE_DIALOG_NO_ORDERS))
      } else {
        dispatch(updateTradesInProgress(marketID, outcomeID, positionShares.toNumber() > 0 ? SELL : BUY, bestFill.amountOfShares.toNumber(), bestFill.price.toNumber(), null, () => {
          const { tradesInProgress } = getState()
          dispatch(placeTrade(marketID, outcomeID, tradesInProgress[marketID], true, (err, tradeGroupID) => {
            if (err) {
              console.error('placeTrade err -- ', err)
              dispatch(addClosePositionTradeGroup(marketID, outcomeID, CLOSE_DIALOG_FAILED))
            } else {
              dispatch(addClosePositionTradeGroup(marketID, outcomeID, tradeGroupID))
            }
          }))
        }))
      }
    }))
  }
}

export function getBestFill(orderBook, side, shares, marketID, outcomeID, userAddress) {
  let price = ZERO
  let amountOfShares = ZERO

  Object.keys(orderBook[side] || {}).reduce((p, orderID) => {
    const orderOutcome = getValue(orderBook, `${side}.${orderID}`)

    if (orderOutcome.outcome === outcomeID && orderOutcome.owner !== userAddress) {
      p.push(orderOutcome)
    }

    return p
  }, []).sort((a, b) => {
    const aBN = new BigNumber(a.fullPrecisionPrice)
    const bBN = new BigNumber(b.fullPrecisionPrice)
    if (side === BUY) {
      return bBN-aBN
    }

    return aBN-bBN
  }).find((order) => {
    amountOfShares = amountOfShares.plus(new BigNumber(order.fullPrecisionAmount))
    price = new BigNumber(order.fullPrecisionPrice)

    if (amountOfShares.toNumber() >= shares.toNumber()) {
      amountOfShares = shares
      return true
    }

    return false
  })

  return { amountOfShares, price }
}
