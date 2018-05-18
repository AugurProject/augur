import { augur } from 'services/augurjs'
import { each } from 'async'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateMarketRepBalance, updateMarketEthBalance, updateMarketFrozenSharesValue } from 'modules/markets/actions/update-markets-data'
import { updateParticipationTokenBalance } from 'modules/my-participation-tokens/actions/update-participation-tokens'
import { updateInitialReporterRepBalance } from 'modules/my-initial-reporters/actions/update-initial-reporters'
import { updateDisputeCrowdsourcersBalance } from 'modules/my-dispute-crowdsourcer-tokens/actions/update-dispute-crowdsourcer-tokens'
import { updateOrderClearEscrowed } from 'modules/escape-hatch/actions/update-all-orders'
import { doUpdateShareFrozenValue } from 'modules/escape-hatch/actions/load-emergency-withdrawal-assets'

export default function (ownedMarkets, marketsWithShares, callback = logError) {
  return (dispatch, getState) => {

    const {
      participationTokens, initialReporters, disputeCrowdsourcerTokens, allOrders = {}, loginAccount,
    } = getState()

    each(ownedMarkets, (market) => {
      augur.api.Market.withdrawInEmergency({
        meta: loginAccount.meta,
        tx: { to: market.id },
        onSent: noop,
        onSuccess: (res) => {
          dispatch(updateMarketRepBalance(market.id, 0))
          dispatch(updateMarketEthBalance(market.id, 0))
        },
        onFailed: callback,
      })
    })

    each(marketsWithShares, (market) => {
      augur.api.TradingEscapeHatch.claimSharesInUpdate({
        meta: loginAccount.meta,
        _market: market.id,
        onSent: noop,
        onSuccess: (res) => {
          dispatch(updateMarketFrozenSharesValue(market.id, 0))
        },
        onFailed: callback,
      })
    })

    Object.keys(disputeCrowdsourcerTokens).forEach((disputeCrowdsourcerID) => {
      const disputeCrowdsourcer = disputeCrowdsourcerTokens[disputeCrowdsourcerID]
      if (!disputeCrowdsourcer.redeemed) {
        augur.api.DisputeCrowdsourcer.withdrawInEmergency({
          meta: loginAccount.meta,
          tx: { to: disputeCrowdsourcerID },
          onSent: noop,
          onSuccess: (res) => {
            dispatch(updateDisputeCrowdsourcersBalance(disputeCrowdsourcerID, 0))
          },
          onFailed: callback,
        })
      }
    })

    Object.keys(initialReporters).forEach((initialReporterID) => {
      const initialReporter = initialReporters[initialReporterID]
      if (!initialReporter.redeemed) {
        augur.api.InitialReporter.withdrawInEmergency({
          meta: loginAccount.meta,
          tx: { to: initialReporterID },
          onSent: noop,
          onSuccess: (res) => {
            dispatch(updateInitialReporterRepBalance(initialReporterID, 0))
          },
          onFailed: callback,
        })
      }
    })

    Object.keys(participationTokens).forEach((participationTokenID) => {
      const participationToken = participationTokens[participationTokenID]
      if (participationToken.balance > 0) {
        augur.api.FeeWindow.withdrawInEmergency({
          meta: loginAccount.meta,
          tx: { to: participationTokenID },
          onSent: noop,
          onSuccess: (res) => {
            dispatch(updateParticipationTokenBalance(participationTokenID, 0))
          },
          onFailed: callback,
        })
      }
    })

    Object.keys(allOrders).forEach((orderId) => {
      const order = allOrders[orderId]
      const orderHasSharesEscrowed = order.sharesEscrowed > 0
      augur.api.CancelOrder.cancelOrder({
        meta: loginAccount.meta,
        _orderId: orderId,
        onSent: noop,
        onSuccess: (res) => {
          dispatch(updateOrderClearEscrowed(orderId))
          if (orderHasSharesEscrowed) {
            dispatch(doUpdateShareFrozenValue(order.marketId, loginAccount, dispatch, () => {
              augur.api.TradingEscapeHatch.claimSharesInUpdate({
                meta: loginAccount.meta,
                _market: order.marketId,
                onSent: noop,
                onSuccess: (res) => {
                  dispatch(updateMarketFrozenSharesValue(order.marketId, 0))
                },
                onFailed: callback,
              })
            }))
          }
        },
        onFailed: callback,
      })
    })
  }
}
