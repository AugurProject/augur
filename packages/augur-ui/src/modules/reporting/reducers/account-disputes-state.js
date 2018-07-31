import {
  REMOVE_ACCOUNT_DISPUTE,
  UPDATE_ACCOUNT_DISPUTE,
  CLEAR_ACCOUNT_DISPUTES,
} from 'modules/reporting/actions/update-account-disputes'
import { RESET_STATE } from 'modules/app/actions/reset-state'

export default function (accountDisputes = {}, action) {
  switch (action.type) {
    case REMOVE_ACCOUNT_DISPUTE: {
      return Object.keys(accountDisputes)
        .filter(d => d !== action.data.marketId)
        .reduce((p, d) => {
          p[d] = accountDisputes[d]
          return p
        }, {})
    }
    case UPDATE_ACCOUNT_DISPUTE: {
      accountDisputes[action.data.marketId] = { ...action.data }
      return accountDisputes
    }
    case RESET_STATE:
    case CLEAR_ACCOUNT_DISPUTES:
      return {}
    default:
      return accountDisputes
  }
}
