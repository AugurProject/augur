import { createBigNumber } from 'utils/create-big-number'
import { createSelector } from 'reselect'
import store from 'src/store'
import { selectOutcomesDataState } from 'src/select-state'
import selectLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions'
import { ZERO } from 'modules/trade/constants/numbers'
import { SCALAR } from 'modules/markets/constants/market-types'

export default function () {
  return selectClosedMarketsWithWinningShares(store.getState())
}

export const selectClosedMarketsWithWinningShares = createSelector(
  selectOutcomesDataState,
  selectLoginAccountPositions,
  (outcomesData, loginAccountPositions) => {
    const { markets } = loginAccountPositions
    const numPositions = markets.length
    const closedMarketsWithWinningShares = []
    for (let i = 0; i < numPositions; ++i) {
      const market = markets[i]
      if (!market.isOpen) {
        const marketId = market.id
        const isSelectTotalShares = market.type === SCALAR ||
          (market.consensus && market.consensus.isIndeterminate)
        const winningShares = isSelectTotalShares ?
          selectTotalSharesInMarket(market, outcomesData[marketId]) :
          selectWinningSharesInMarket(market, outcomesData[marketId])
        if (winningShares && winningShares.gt(ZERO)) {
          closedMarketsWithWinningShares.push({
            id: marketId,
            description: market.description,
            shares: winningShares.toFixed(),
          })
        }
      }
    }
    return closedMarketsWithWinningShares
  },
)

export const selectTotalSharesInMarket = (market, marketOutcomesData) => {
  const outcomeIds = Object.keys(marketOutcomesData)
  const numOutcomes = outcomeIds.length
  let totalShares = ZERO
  for (let j = 0; j < numOutcomes; ++j) {
    const bnSharesPurchased = createBigNumber(marketOutcomesData[outcomeIds[j]].sharesPurchased, 10)
    if (bnSharesPurchased.gt(ZERO)) {
      totalShares = totalShares.plus(bnSharesPurchased)
    }
  }
  return totalShares
}

export const selectWinningSharesInMarket = (market, marketOutcomesData) => {
  if (market.consensus && market.consensus.outcomeId) {
    const outcomeData = marketOutcomesData[market.consensus.outcomeId]
    if (outcomeData && outcomeData.sharesPurchased) {
      const sharesPurchased = createBigNumber(outcomeData.sharesPurchased, 10)
      return sharesPurchased.gt(ZERO) ? sharesPurchased : null
    }
  }
  return null
}
