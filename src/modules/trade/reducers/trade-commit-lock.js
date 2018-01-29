import { UPDATE_TRADE_COMMIT_LOCK } from 'modules/trade/actions/update-trade-commitment'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (tradeCommitLock = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRADE_COMMIT_LOCK:
      return { ...tradeCommitLock, isLocked: action.isLocked }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return tradeCommitLock
  }
}
