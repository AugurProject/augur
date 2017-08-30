import async from 'async'
import { augur } from 'services/augurjs'
import { updateAssets } from 'modules/auth/actions/update-assets'
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { cancelOpenOrdersInClosedMarkets } from 'modules/user-open-orders/actions/cancel-open-orders-in-closed-markets'
import selectWinningPositions from 'modules/my-positions/selectors/winning-positions'

export const claimProceeds = () => (dispatch, getState) => {
  const { branch, loginAccount } = getState()
  if (loginAccount.address) {
    const winningPositions = selectWinningPositions()
    console.log('closed markets with winning shares:', winningPositions)
    if (winningPositions.length) {
      augur.trading.payout.claimMarketsProceeds(branch.id, winningPositions, (err, claimedMarkets) => {
        if (err) console.error('claimMarketsProceeds failed:', err)
        dispatch(updateAssets())
        async.each(claimedMarkets, (marketID, nextMarket) => (
          dispatch(loadMarketsInfo([marketID], () => (
            dispatch(loadAccountTrades({ market: marketID }, () => nextMarket()))
          )))
        ), err => err && console.error(err))
      })
    }
    dispatch(cancelOpenOrdersInClosedMarkets())
  }
}
