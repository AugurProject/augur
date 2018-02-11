import { createSelector } from 'reselect'
import { each } from 'async'
import store from 'src/store'
import { selectAccountPositionsState, selectMarketsDataState } from 'src/select-state'
import selectMyMarkets from 'modules/my-markets/selectors/my-markets'

export default function () {
  return getEscapeHatchData(store.getState())
}

export const getEscapeHatchData = createSelector(
  selectMarketsDataState,
  selectMyMarkets,
  selectAccountPositionsState,
  (marketsData, myMarkets, accountPositions) => {
    const data = {
      eth: 0,
      rep: 0,
      ownedMarketsWithFunds: [],
      marketsWithShares: [],
      fundsAvailableForWithdrawl: false,
    }

    // Market escape hatch
    each(myMarkets, (market) => {
      if (market.repBalance > 0) {
        data.rep += market.repBalance
        data.ownedMarketsWithFunds.push(market)
      }
    })

    // Shares escape hatch
    Object.keys(accountPositions).forEach((marketID) => {
      const market = marketsData[marketID]
      if (market.frozenSharesValue > 0) {
        data.eth += market.frozenSharesValue
        data.marketsWithShares.push(market)
      }
    })

    // TODO Dispute Crowdsourcers

    // TODO Initial Reporters

    // TODO Participation Tokens

    data.fundsAvailableForWithdrawl = data.rep + data.eth > 0

    return data
  }
)
