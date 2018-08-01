import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export const loadMarketsByCategory = (category, callback = logError) => (dispatch, getState) => {
  const { env, universe } = getState()

  const params = { category, universe: universe.id }

  if (env['bug-bounty']) {
    params.creator = env['bug-bounty-address']
  }

  console.log('get markets', params)
  augur.markets.getMarkets(params, (err, marketIds) => {
    if (err) {
      callback(err)
      return console.error('ERROR findMarketsWithCategory()', err)
    }
    callback(null, marketIds)
  })
}
