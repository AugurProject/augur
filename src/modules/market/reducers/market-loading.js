import { ADD_MARKET_LOADING, REMOVE_MARKET_LOADING } from 'modules/market/actions/update-market-loading'

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
    default:
      return marketLoading
  }
}
