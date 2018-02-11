import speedomatic from 'speedomatic'
import { each } from 'async'
import { augur } from 'services/augurjs'
import { UNIVERSE_ID } from 'modules/app/constants/network'
import { updateMarketRepBalance } from 'modules/markets/actions/update-markets-data'
import logError from 'utils/log-error'

export default function (marketIDs, callback = logError) {
  return (dispatch, getState) => {
    const { marketsData, universe } = getState()
    const universeID = universe.id || UNIVERSE_ID

    // Update all owned market REP balances
    augur.api.Universe.getReputationToken({ tx: { to: universeID } }, (err, reputationTokenAddress) => {
      if (err) return callback(err)
      each(marketIDs, (marketID) => {
        doUpdateMarketRepBalance(marketsData[marketID], reputationTokenAddress, dispatch, callback)
      })
    })

    // TODO Update all markets with their frozen shares value
    // Object.keys(accountPositions).forEach(function(marketID) {
    //   doUpdateShareFrozenValue(marketsData[marketID], dispatch, callback);
    // });
  }
}

function doUpdateMarketRepBalance(market, reputationTokenAddress, dispatch, callback) {
  augur.api.ReputationToken.getBalance({
    tx: { to: reputationTokenAddress },
    _address: market.id
  }, (err, attoRepBalance) => {
    if (err) return callback(err)
    const repBalance = speedomatic.unfix(attoRepBalance, 'number')
    if (!market.repBalance || market.repBalance !== repBalance) {
      dispatch(updateMarketRepBalance(market.id, repBalance))
    }
  })
}

/*
function doUpdateShareFrozenValue(market, dispatch, callback) {
  augur.api.TradingEscapeHatch.getFrozenShareValueInMarket({
    send: false,
    tx: { to: reputationTokenAddress },
    _market: market.id
  }, (err, attoEth) => {
    if (err) return callback(err)
    const frozenSharesValue = speedomatic.unfix(attoEth, 'number')
    if (!market.frozenSharesValue || market.frozenSharesValue !== frozenSharesValue) {
      dispatch(updateMarketFrozenSharesValue(market.id, frozenSharesValue));
    }
  })
}
*/
