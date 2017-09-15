import { isMarketDataOpen } from 'utils/is-market-data-open'

export default function (selectedMarketState = 'open', currentReportingPeriod, items) {
  return items.reduce((p, market, i) => {
    switch (selectedMarketState) {
      case 'open':
        if (isMarketDataOpen(market)) return [...p, i]
        break
      case 'reporting':
        if (market.tradingPeriod === currentReportingPeriod) return [...p, i]
        break
      case 'closed':
        if (!isMarketDataOpen(market)) return [...p, i]
        break
      default:
        return p
    }

    return p
  }, [])
}
