import { MARKET_INFO_LOADING, MARKET_FULLY_LOADING } from 'modules/market/constants/market-loading-states'

export const isLoading = (marketLoading) => {
  const value = Object.keys(marketLoading)
    .filter(key => marketLoading[key] === MARKET_INFO_LOADING || marketLoading[key] === MARKET_FULLY_LOADING)

  return value.length > 0

}
