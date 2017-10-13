import { isMarketDataOpen } from 'utils/is-market-data-open'

import * as STATES from 'modules/filter-sort/constants/market-states'

export default function (selectedMarketState, currentReportingPeriod, items) {
  if (selectedMarketState == null) return null

  return items.reduce((p, market, i) => {
    switch (selectedMarketState) {
      case STATES.MARKET_OPEN:
        if (isMarketDataOpen(market)) return [...p, i]
        break
      case STATES.MARKET_REPORTING:
        if (market.reportingWindow === currentReportingPeriod) return [...p, i]
        break
      case STATES.MARKET_CLOSED:
        if (!isMarketDataOpen(market)) return [...p, i]
        break
      default:
        return p
    }

    return p
  }, [])
}
