import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

// NOTE -- We ONLY load the market ids during this step.
export const loadUserMarkets = (callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()

  augur.markets.getMarketsCreatedByUser({ universe: universe.id, creator: loginAccount.address }, (err, marketsArray) => {
    if (err || !marketsArray) return callback(err)

    const marketsData = marketsArray.reduce((p, id) => ({
      ...p,
      [id]: { id, author: loginAccount.address },
    }), {})
    dispatch(updateMarketsData(marketsData))
    callback(null, marketsArray)
  })
}
