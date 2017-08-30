export const ADD_MARKET_LOADING = 'MARKET_LOADING'
export const REMOVE_MARKET_LOADING = 'REMOVE_MARKET_LOADING'

export function addMarketLoading(marketID) {
  return {
    type: ADD_MARKET_LOADING,
    data: {
      marketID
    }
  }
}

export function removeMarketLoading(marketID) {
  return {
    type: REMOVE_MARKET_LOADING,
    data: {
      marketID
    }
  }
}
