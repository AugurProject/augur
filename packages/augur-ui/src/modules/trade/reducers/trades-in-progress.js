import { UPDATE_TRADE_IN_PROGRESS, CLEAR_TRADE_IN_PROGRESS } from 'modules/trade/actions/update-trades-in-progress'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (tradesInProgress = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRADE_IN_PROGRESS:
      return {
        ...tradesInProgress,
        [action.data.marketId]: {
          ...tradesInProgress[action.data.marketId],
          [action.data.outcomeId]: {
            ...action.data.details,
          },
        },
      }
    case CLEAR_TRADE_IN_PROGRESS:
      return {
        ...tradesInProgress,
        [action.marketId]: {},
      }
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return tradesInProgress
  }
}
