import { UPDATE_TRANSACTION_PERIOD } from 'modules/portfolio/actions/update-transaction-period'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { DAY } from 'modules/portfolio/constants/transaction-periods'

const DEFAULT_STATE = DAY

export default function (transactionPeriod = DEFAULT_STATE, action) {
  switch (action.type) {
    case (UPDATE_TRANSACTION_PERIOD):
      return action.data
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return transactionPeriod
  }
}
