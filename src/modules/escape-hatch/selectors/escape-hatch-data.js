import { WrappedBigNumber } from 'utils/wrapped-big-number'
import { createSelector } from 'reselect'
import speedomatic from 'speedomatic'
import { each } from 'async'
import store from 'src/store'
import { selectAccountPositionsState, selectMarketsDataState, selectParticipationTokens, selectInitialReporters, selectDisputeCrowdsourcerTokens } from 'src/select-state'
import selectMyMarkets from 'modules/my-markets/selectors/my-markets'

export default function () {
  return getEscapeHatchData(store.getState())
}

export const getEscapeHatchData = createSelector(
  selectMarketsDataState,
  selectMyMarkets,
  selectAccountPositionsState,
  selectParticipationTokens,
  selectInitialReporters,
  selectDisputeCrowdsourcerTokens,
  (marketsData, myMarkets, accountPositions, partcipationTokens, initialReporters, disputeCrowdsourcers = {}) => {
    const data = {
      eth: 0,
      rep: 0,
      gas: 0,
      ownedMarketsWithFunds: [],
      marketsWithShares: [],
      fundsAvailableForWithdrawl: false,
    }

    // Market escape hatch
    each(myMarkets, (myMarket) => {
      const market = marketsData[myMarket.id]
      if (market.repBalance > 0) {
        data.rep += market.repBalance
        data.gas += market.escapeHatchGasCost
        data.ownedMarketsWithFunds.push(market)
      }
    })

    // Shares escape hatch
    Object.keys(accountPositions).forEach((marketId) => {
      const market = marketsData[marketId]
      if (market.frozenSharesValue > 0) {
        data.eth += market.frozenSharesValue
        data.gas += market.tradingEscapeHatchGasCost
        data.marketsWithShares.push(market)
      }
    })

    Object.keys(disputeCrowdsourcers).forEach((disputeCrowdsourcerID) => {
      const disputeCrowdsourcer = disputeCrowdsourcers[disputeCrowdsourcerID]
      if (disputeCrowdsourcer.balance > 0) {
        data.rep = speedomatic.unfix(disputeCrowdsourcer.balance).add(WrappedBigNumber(data.rep))
        data.gas += disputeCrowdsourcer.escapeHatchGasCost
      }
    })

    Object.keys(initialReporters).forEach((initialReporterID) => {
      const initialReporter = initialReporters[initialReporterID]
      if (initialReporter.repBalance > 0) {
        data.rep = speedomatic.unfix(initialReporter.repBalance).add(WrappedBigNumber(data.rep))
        data.gas += initialReporter.escapeHatchGasCost
      }
    })

    Object.keys(partcipationTokens).forEach((participationTokenID) => {
      const partcipationToken = partcipationTokens[participationTokenID]
      if (partcipationToken.balance > 0) {
        data.rep += partcipationToken.balance
        data.gas += partcipationToken.escapeHatchGasCost
      }
    })

    data.fundsAvailableForWithdrawl = data.rep + data.eth > 0

    return data
  },
)
