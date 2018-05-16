import { augur } from 'services/augurjs'
import { each } from 'async'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateMarketRepBalance, updateMarketEthBalance, updateMarketFrozenSharesValue } from 'modules/markets/actions/update-markets-data'
import { updateParticipationTokenBalance } from 'modules/my-participation-tokens/actions/update-participation-tokens'
import { updateInitialReporterRepBalance } from 'modules/my-initial-reporters/actions/update-initial-reporters'
import { updateDisputeCrowdsourcersBalance } from 'modules/my-dispute-crowdsourcer-tokens/actions/update-dispute-crowdsourcer-tokens'

export default function (ownedMarkets, marketsWithShares, callback = logError) {
  return (dispatch, getState) => {

    const {
      participationTokens, initialReporters, disputeCrowdsourcerTokens = {}, loginAccount,
    } = getState()

    each(ownedMarkets, (market) => {
      augur.api.Market.withdrawInEmergency({
        meta: loginAccount.meta,
        tx: { to: market.id },
        onSent: noop,
        onSuccess: (res) => {
          console.log('Market.withdrawInEmergency', res)
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
          console.log('TradingEscapeHatch.claimSharesInUpdate', res)
          dispatch(updateMarketFrozenSharesValue(market.id, 0))
        },
        onFailed: callback,
      })
    })

    Object.keys(disputeCrowdsourcerTokens).forEach((disputeCrowdsourcerID) => {
      const disputeCrowdsourcer = disputeCrowdsourcerTokens[disputeCrowdsourcerID]
      if (!disputeCrowdsourcer.redeemed) {
        augur.api.DisputeCrowdsourcer.withdrawInEmergency({
          tx: { to: disputeCrowdsourcerID },
          onSent: noop,
          onSuccess: (res) => {
            console.log('DisputeCrowdsourcer.withdrawInEmergency', res)
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
          tx: { to: initialReporterID },
          onSent: noop,
          onSuccess: (res) => {
            console.log('InitialReporter.withdrawInEmergency', res)
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
          tx: { to: participationTokenID },
          onSent: noop,
          onSuccess: (res) => {
            console.log('FeeWindow.withdrawInEmergency', res)
            dispatch(updateParticipationTokenBalance(participationTokenID, 0))
          },
          onFailed: callback,
        })
      }
    })
  }
}
