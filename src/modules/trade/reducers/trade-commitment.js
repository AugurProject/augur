import { UPDATE_TRADE_COMMITMENT } from 'modules/trade/actions/update-trade-commitment'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (tradeCommitment = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRADE_COMMITMENT: {
      if (action.tradeCommitment.tradeHash) {
        return action.tradeCommitment
      }
      return {
        ...tradeCommitment,
        ...action.tradeCommitment,
      }
    }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return tradeCommitment
  }
}
