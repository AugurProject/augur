import { isOnTradePage } from 'modules/trade/helpers/is-on-trade-page'
import { getTradePageMarketId } from 'modules/trade/helpers/get-trade-page-market-id'

export const isCurrentMarket = (marketId) => {
  if (!isOnTradePage()) return false
  if (marketId === getTradePageMarketId()) return true
  return false
}
