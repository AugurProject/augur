import { augur } from 'services/augurjs'
import { BUY } from 'modules/transactions/constants/types'
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress'
import logError from 'utils/log-error'
import BigNumber from 'bignumber.js'
import { updateModal } from 'modules/modal/actions/update-modal'
import { MODAL_ACCOUNT_APPROVAL } from 'modules/modal/constants/modal-types'

export const placeTrade = (marketId, outcomeId, tradeInProgress, doNotCreateOrders, callback = logError, onComplete = logError) => (dispatch, getState) => {
  if (!marketId) return null
  const { loginAccount, marketsData } = getState()
  const market = marketsData[marketId]
  if (!tradeInProgress || !market || outcomeId == null) {
    console.error(`trade-in-progress not found for market ${marketId} outcome ${outcomeId}`)
    return dispatch(clearTradeInProgress(marketId))
  }
  const placeTradeParams = {
    meta: loginAccount.meta,
    amount: tradeInProgress.numShares,
    limitPrice: tradeInProgress.limitPrice,
    estimatedCost: tradeInProgress.totalCost,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
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
    },
  }
  if (new BigNumber(loginAccount.allowance).lte(new BigNumber(tradeInProgress.totalCost))) {
    dispatch(updateModal({
      type: MODAL_ACCOUNT_APPROVAL,
      approveCallback: (err, res) => {
        if (err) return callback(err)
        augur.trading.placeTrade(placeTradeParams)
        dispatch(clearTradeInProgress(marketId))
      },
    }))
  } else {
    augur.trading.placeTrade(placeTradeParams)
    dispatch(clearTradeInProgress(marketId))
  }
}
