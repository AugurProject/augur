import speedomatic from 'speedomatic'
import { each } from 'async'
import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { updateMarketRepBalance, updateMarketFrozenSharesValue, updateMarketEscapeHatchGasCost, updateMarketTradingEscapeHatchGasCost } from 'modules/markets/actions/update-markets-data'
import noop from 'utils/noop'
import logError from 'utils/log-error'

export default function (marketIds, callback = logError) {
  return (dispatch, getState) => {
    const { accountPositions, marketsData, universe } = getState()
    const universeID = universe.id || UNIVERSE_ID

    // Update all owned market REP balances
    augur.api.Universe.getReputationToken({ tx: { to: universeID } }, (err, reputationTokenAddress) => {
      if (err) return callback(err)
      each(marketIds, (marketId) => {
        doUpdateMarketRepBalance(marketsData[marketId], reputationTokenAddress, dispatch, callback)
      })
    })

    // Update all markets with their frozen shares value
    Object.keys(accountPositions).forEach((marketId) => {
      doUpdateShareFrozenValue(marketsData[marketId], dispatch, callback)
    })
  }
}

function doUpdateMarketRepBalance(market, reputationTokenAddress, dispatch, callback) {
  augur.api.ReputationToken.getBalance({
    tx: { to: reputationTokenAddress },
    _address: market.id,
  }, (err, attoRepBalance) => {
    if (err) return callback(err)
    const repBalance = speedomatic.unfix(attoRepBalance, 'number')
    if (!market.repBalance || market.repBalance !== repBalance) {
      dispatch(updateMarketRepBalance(market.id, repBalance))
      if (repBalance > 0) {
        augur.api.Market.withdrawInEmergency({
          tx: { estimateGas: true, to: market.id },
          onSent: noop,
          onSuccess: (attoGasCost) => {
            const gasCost = speedomatic.encodeNumberAsJSNumber(attoGasCost)
            dispatch(updateMarketEscapeHatchGasCost(market.id, gasCost))
          },
          onFailed: callback,
        })
      }
    }
  })
}

function doUpdateShareFrozenValue(market, dispatch, callback) {
  augur.api.TradingEscapeHatch.getFrozenShareValueInMarket({
    tx: { send: false },
    _market: market.id,
  }, (err, attoEth) => {
    if (err) return callback(err)
    const frozenSharesValue = speedomatic.unfix(attoEth, 'number')
    if (!market.frozenSharesValue || market.frozenSharesValue !== frozenSharesValue) {
      dispatch(updateMarketFrozenSharesValue(market.id, frozenSharesValue))
      if (frozenSharesValue > 0) {
        augur.api.TradingEscapeHatch.claimSharesInUpdate({
          tx: { estimateGas: true },
          _market: market.id,
          onSent: noop,
          onSuccess: (attoGasCost) => {
            const gasCost = speedomatic.unfix(attoGasCost, 'number')
            dispatch(updateMarketTradingEscapeHatchGasCost(market.id, gasCost))
          },
          onFailed: callback,
        })
      }
    }
  })
}
