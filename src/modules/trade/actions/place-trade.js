import { augur } from 'services/augurjs'
import { BUY } from 'modules/transactions/constants/types'
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress'
import logError from 'utils/log-error'

export const placeTrade = (marketId, outcomeId, tradeInProgress, doNotCreateOrders, callback = logError, onComplete = logError) => (dispatch, getState) => {
  if (!marketId) return null
  const { loginAccount, marketsData } = getState()
  const market = marketsData[marketId]
  if (!tradeInProgress || !market || outcomeId == null) {
    console.error(`trade-in-progress not found for market ${marketId} outcome ${outcomeId}`)
    return dispatch(clearTradeInProgress(marketId))
  }
  augur.trading.placeTrade({
    meta: loginAccount.meta,
    amount: tradeInProgress.numShares,
    limitPrice: tradeInProgress.limitPrice,
    estimatedCost: tradeInProgress.totalCost,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
    tickSize: market.tickSize,
    numTicks: market.numTicks,
    _direction: tradeInProgress.side === BUY ? 0 : 1,
    _market: marketId,
    _outcome: parseInt(outcomeId, 10),
    _tradeGroupId: tradeInProgress.tradeGroupId,
    doNotCreateOrders,
    onSent: () => callback(null, tradeInProgress.tradeGroupId),
    onFailed: callback,
    onSuccess: (tradeOnChainAmountRemaining) => {
      onComplete(tradeOnChainAmountRemaining)
    }
  })
  dispatch(clearTradeInProgress(marketId))
}
