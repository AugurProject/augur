export const ADD_MARKET_LOADING = 'MARKET_LOADING'
export const REMOVE_MARKET_LOADING = 'REMOVE_MARKET_LOADING'

export function addMarketLoading(marketId) {
  return {
    type: ADD_MARKET_LOADING,
    data: {
      marketId,
    },
  }
}

export function removeMarketLoading(marketId) {
  return {
    type: REMOVE_MARKET_LOADING,
    data: {
      marketId,
    },
  }
}
