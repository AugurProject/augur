import { createBigNumber } from 'utils/create-big-number'
import { createSelector } from 'reselect'
import memoize from 'memoizee'
import store from 'src/store'
import { selectLoginAccountAddress, selectPriceHistoryState, selectMarketCreatorFeesState } from 'src/select-state'
import selectAllMarkets from 'modules/markets/selectors/markets-all'
import { ZERO } from 'modules/trade/constants/numbers'
import { formatNumber, formatEther } from 'utils/format-number'

export default function () {
  return selectLoginAccountMarkets(store.getState())
}

export const selectAuthorOwnedMarkets = createSelector(
  selectAllMarkets,
  selectLoginAccountAddress,
  (allMarkets, authorId) => {
    if (!allMarkets || !authorId) return null
    return allMarkets.filter(market => market.author === authorId)
  },
)

export const selectLoginAccountMarkets = createSelector(
  selectAuthorOwnedMarkets,
  selectPriceHistoryState,
  selectMarketCreatorFeesState,
  (authorOwnedMarkets, priceHistory, marketCreatorFees) => {
    if (!authorOwnedMarkets) return []
    const markets = []
    authorOwnedMarkets.forEach((market) => {
      const fees = formatEther(marketCreatorFees[market.id] || 0)
      const numberOfTrades = formatNumber(selectNumberOfTrades(priceHistory[market.id]))
      const averageTradeSize = formatNumber(selectAverageTradeSize(priceHistory[market.id]))
      const openVolume = formatNumber(selectOpenVolume(market))
      markets.push({
        ...market, // TODO -- cleanup this object
        id: market.id,
        description: market.description,
        endTime: market.endTime,
        volume: market.volume,
        repBalance: market.repBalance,
        fees,
        numberOfTrades,
        averageTradeSize,
        openVolume,
      })
    })
    return markets
  },
)

export const selectNumberOfTrades = memoize((trades) => {
  if (!trades) return 0
  return Object.keys(trades).reduce((p, outcome) => (p + trades[outcome].length), 0)
}, { max: 1 })

export const selectOpenVolume = (market) => {
  let openVolume = ZERO
  market.outcomes.forEach((outcome) => {
    Object.keys(outcome.orderBook).forEach((orderType) => {
      outcome.orderBook[orderType].forEach((type) => {
        openVolume = openVolume.plus(createBigNumber(type.shares.value, 10))
      })
    })
  })
  return openVolume
}

export const selectAverageTradeSize = memoize((marketPriceHistory) => {
  if (!marketPriceHistory) return 0
  const initialState = {
    shares: ZERO,
    trades: 0,
  }
  const priceHistoryTotals = Object.keys(marketPriceHistory).reduce((historyTotals, currentOutcome) => {
    const outcomeTotals = marketPriceHistory[currentOutcome].reduce((outcomeTotals, trade) => ({
      shares: createBigNumber(outcomeTotals.shares, 10).plus(createBigNumber(trade.amount, 10)),
      trades: outcomeTotals.trades + 1,
    }), initialState)
    return {
      shares: historyTotals.shares.plus(outcomeTotals.shares),
      trades: historyTotals.trades + outcomeTotals.trades,
    }
  }, initialState)
  return priceHistoryTotals.shares.dividedBy(createBigNumber(priceHistoryTotals.trades, 10))
}, { max: 1 })
