import { selectMarketTradingHistory } from 'src/select-state'
import { BUY_UP, BUY_EVEN, BUY_DOWN, SELL_UP, SELL_EVEN, SELL_DOWN, NONE } from 'modules/trade/constants/types'

export const selectMarketOutcomeTradingStatus = (marketId, outcomes) => {
  if (!marketId) return {}
  const marketHistory = selectMarketTradingHistory[marketId]

  return outcomes.reduce((p, o) => {
    p[o.id] = { status: BUY_UP }
    return p
  }, {})
}

