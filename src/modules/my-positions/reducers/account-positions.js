import { UPDATE_ACCOUNT_POSITIONS_DATA } from 'modules/my-positions/actions/update-account-trades-data'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (accountPositions = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT_POSITIONS_DATA:
      if (action.data) {
        if (action.marketId) {
          return {
            ...accountPositions,
            [action.marketId]: {
              ...action.data[action.marketId],
            },
          }
        }
        return {
          ...accountPositions,
          ...action.data,
        }
      }
      return accountPositions
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return accountPositions
  }
}
