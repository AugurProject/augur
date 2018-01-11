import { ADD_MARKET_LOADING, REMOVE_MARKET_LOADING } from 'modules/market/actions/update-market-loading'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = []

export default function (marketLoading = DEFAULT_STATE, action) {
  switch (action.type) {
    case ADD_MARKET_LOADING:
      return [
        ...marketLoading,
        action.data.marketID
      ]
    case REMOVE_MARKET_LOADING:
      return marketLoading.filter(market => market !== action.data.marketID)
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return marketLoading
  }
}
