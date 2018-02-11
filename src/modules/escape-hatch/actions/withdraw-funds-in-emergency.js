import { augur } from 'services/augurjs'
import { each } from 'async'
import logError from 'utils/log-error'
import noop from 'utils/noop'
import { updateMarketRepBalance, updateMarketFrozenSharesValue } from 'modules/markets/actions/update-markets-data'

export default function (ownedMarkets, marketsWithShares, callback = logError) {
  return (dispatch, getState) => {

    const { loginAccount } = getState()

    each(ownedMarkets, (market) => {
      augur.api.Market.withdrawInEmergency({
        meta: loginAccount.meta,
        tx: { to: market.id },
        onSent: noop,
        onSuccess: (res) => {
          console.log('market.withdrawInEmergency', res)
          dispatch(updateMarketRepBalance(market.id, 0))
        },
        onFailed: callback
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
        onFailed: callback
      })
    })

    // TODO Dispute Crowdsourcers

    // TODO Initial Reporters

    // TODO Participation Tokens
  }
}
