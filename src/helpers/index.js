import { useUnlockedAccount } from 'src/modules/auth/actions/use-unlocked-account'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import logError from 'utils/log-error'
import { selectMarkets } from 'src/modules/markets/selectors/markets-all'
import loadMarkets from 'modules/markets/actions/load-markets'
import store from 'src/store'

const findMarketByDesc = (marketDescription, callback = logError) => (dispatch) => {
  const marketsData = selectMarkets(store.getState())
  const market = marketsData.find(market => market.description === marketDescription)
  if (!market) {
    dispatch(loadMarkets((err, marketIds) => {
      if (err) return callback(err)
      dispatch(loadMarketsInfo(marketIds, (err, markets) => {
        if (err) return callback(err)
        Object.keys(markets).forEach((market) => {
          if (market.description === marketDescription) {
            return callback(market.id)
          }
        })
        return callback(null)
      }))
    }))
  } else {
    return callback(market.id)
  }
}

export const helpers = (store) => {
  const { dispatch, whenever } = store
  return {
    updateAccountAddress: account => new Promise((resolve) => {
      dispatch(useUnlockedAccount(account, () => {
        const unsubscribe = whenever('loginAccount.address', account, () => {
          unsubscribe()
          resolve()
        })
      }))
    }),
    findMarketId: marketDescription => new Promise(resolve => dispatch(findMarketByDesc(marketDescription, resolve))),
  }
}
