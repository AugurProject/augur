import { UPDATE_ACCOUNT_TRADES_DATA } from 'modules/my-positions/actions/update-account-trades-data'
import { CLEAR_ACCOUNT_TRADES } from 'modules/my-positions/actions/clear-account-trades'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (accountTrades = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT_TRADES_DATA: {
      const updatedMarketOutcomes = Object.keys(action.data || {}).reduce((p, outcome) => {
        const filteredTrades = action.data[outcome].filter((actionTrade) => {
          const hasIdenticalTrade = ((!!accountTrades[action.market] && accountTrades[action.market][outcome]) || []).find(trade => trade.transactionHash === actionTrade.transactionHash)
          if (hasIdenticalTrade) return false
          return true
        })

        return {
          ...p,
          [outcome]: [
            ...((!!accountTrades[action.market] && accountTrades[action.market][outcome]) || []),
            ...filteredTrades,
          ],
        }
      }, (accountTrades[action.market] || {}))

      return {
        ...accountTrades,
        [action.market]: {
          ...updatedMarketOutcomes,
        },
      }
    }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
    case CLEAR_ACCOUNT_TRADES:
      return DEFAULT_STATE
    default:
      return accountTrades
  }
}
