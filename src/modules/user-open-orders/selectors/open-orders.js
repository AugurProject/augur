import { createSelector } from 'reselect'
import store from 'src/store'
import selectAllMarkets from 'modules/markets/selectors/markets-all'

export default function () {
  return selectOpenOrdersMarkets(store.getState())
}

export const selectOpenOrdersMarkets = createSelector(
  selectAllMarkets,
  (markets) => {
    const openOrdersMarkets = []
    if (markets) {
      const numMarkets = markets.length
      for (let i = 0; i < numMarkets; ++i) {
        if (hasOpenOrdersInMarket(markets[i])) {
          const market = sortOpenOrders(markets[i])
          openOrdersMarkets.push(market)
        }
      }
    }
    return openOrdersMarkets
  },
)

const hasOpenOrdersInMarket = (market) => {
  const numOutcomes = market.outcomes.length
  for (let j = 0; j < numOutcomes; ++j) {
    const outcome = market.outcomes[j]
    if (outcome.userOpenOrders.length) {
      return true
    }
  }
  return false
}


function getHighestPrice(outcome) {
  return outcome.userOpenOrders.reduce((p, order) => comparePrice(p, order), 0)
}

function comparePrice(p, order) {
  return p > order.avgPrice.value ? p : order.avgPrice.value
}

export function sortOpenOrders(market) {
  if (!market) return market
  const numOutcomes = market.outcomes.length
  if (numOutcomes === 1) return market
  const outcomes = market.outcomes.filter(outcome => outcome.userOpenOrders && outcome.userOpenOrders.length > 0)
  if (outcomes.length < 2) return market

  market.outcomes = market.outcomes.sort((o1, o2) => getHighestPrice(o2) - getHighestPrice(o1))
  return market
}

