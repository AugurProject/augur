import { UPDATE_MARKET_CREATOR_FEES } from 'modules/my-markets/actions/update-market-creator-fees'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (marketCreatorFees = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_MARKET_CREATOR_FEES:
      return {
        ...marketCreatorFees,
        ...action.data,
      }
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return marketCreatorFees
  }
}
