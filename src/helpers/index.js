import { useUnlockedAccount } from 'src/modules/auth/actions/use-unlocked-account'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import logError from 'utils/log-error'
import { selectMarkets } from 'src/modules/markets/selectors/markets-all'
import { selectMarket } from 'modules/market/selectors/market'
import loadMarkets from 'modules/markets/actions/load-markets'
import store from 'src/store'
import { DISCLAIMER_SEEN } from 'src/modules/modal/constants/local-storage-keys'

const localStorageRef = typeof window !== 'undefined' && window.localStorage

const findMarketByDesc = (marketDescription, callback = logError) => (dispatch) => {
  const marketsData = selectMarkets(store.getState())
  const market = marketsData.find(market => market.description === marketDescription)
  if (!market) {
    dispatch(loadMarkets((err, marketIds) => {
      if (err) return callback({ err })
      dispatch(loadMarketsInfo(marketIds, (err, markets) => {
        if (err) return callback({ err })
        Object.values(markets).forEach((market) => {
          if (market.description === marketDescription) {
            return callback({ err: null, marketId: market.id })
          }
        })
        return callback({ err: 'market not found' })
      }))
    }))
  } else {
    return callback({ err: null, marketId: market.id })
  }
}
const getMarketData = (marketId, callback = logError) => (dispatch) => {
  let market = selectMarket(store.getState())
  if (market && market.id) callback({ err: null, market })
  dispatch(loadMarketsInfo([marketId], (err, markets) => {
    if (err) return callback({ err })
    if (!markets || markets.length === 0) return callback({ err: 'no markets found' })
    market = selectMarket(store.getState())
    if (market && market.id) callback({ err: null, market })
    return callback({ err: 'no market found' })
  }))
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
    hasDisclaimerModalBeenDismissed: () => localStorageRef.getItem(DISCLAIMER_SEEN),
    findMarketId: marketDescription => new Promise((resolve, reject) => dispatch(findMarketByDesc(marketDescription, (result) => {
      if (result.err) return reject()
      resolve(result.marketId)
    }))),
    getMarketData: marketId => new Promise((resolve, reject) => dispatch(getMarketData(marketId, (result) => {
      if (result.err) return reject()
      resolve(result.market)
    }))),
  }
}
