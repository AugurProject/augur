import { useUnlockedAccount } from 'src/modules/auth/actions/use-unlocked-account'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import logError from 'utils/log-error'
import { selectMarkets } from 'src/modules/markets/selectors/markets-all'
import loadMarkets from 'modules/markets/actions/load-markets'
import store from 'src/store'
import { DISCLAIMER_SEEN } from 'src/modules/modal/constants/local-storage-keys'
import { logout } from 'modules/auth/actions/logout'
import { selectLoginAccountState } from 'src/select-state'
import { formatRep, formatEther } from 'utils/format-number'

const localStorageRef = typeof window !== 'undefined' && window.localStorage

const findMarketByDesc = (marketDescription, callback = logError) => (dispatch) => {
  const marketsData = selectMarkets(store.getState())
  const market = marketsData.find(market => market.description === marketDescription)
  if (!market) {
    dispatch(loadMarkets((err, marketIds) => {
      if (err) return callback(err)
      dispatch(loadMarketsInfo(marketIds, (err, markets) => {
        if (err) return callback(err)
        Object.values(markets).forEach((market) => {
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

const getLoggedInAccountData = (callback = logError) => dispatch => callback(selectLoginAccountState(store.getState()))

const formatRepValue = (value, callback = logError) => dispatch => callback(formatRep(value))

const formatEthValue = (value, callback = logError) => dispatch => callback(formatEther(value))

const logoutAccount = (callback = logError) => dispatch => callback(logout())

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
    hasDisclaimerModalBeenDismissed: () => localStorageRef.getItem(DISCLAIMER_SEEN),
    logout: () => new Promise(resolve => dispatch(logoutAccount(resolve)))
    getAccountData: () => new Promise(resolve => dispatch(getLoggedInAccountData(resolve))),
    formatRep: value => new Promise(resolve => dispatch(formatRepValue(value, resolve))),
    formatEth: value => new Promise(resolve => dispatch(formatEthValue(value, resolve))),
  }
}
