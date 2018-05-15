import { createBigNumber } from 'utils/create-big-number'
import { createSelector } from 'reselect'
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
      eth: createBigNumber(0),
      rep: createBigNumber(0),
      gas: createBigNumber(0),
      ownedMarketsWithFunds: [],
      marketsWithShares: [],
      fundsAvailableForWithdrawl: false,
    }

    // Market escape hatch
    each(myMarkets, (myMarket) => {
      const market = marketsData[myMarket.id]
      if (market.repBalance > 0 || market.ethBalance > 0) {
        data.rep = market.repBalance > 0 ? data.rep.plus(market.repBalance) : data.rep
        data.eth = market.ethBalance > 0 ? data.eth.plus(market.ethBalance) : data.eth
        data.gas = data.gas.plus(market.escapeHatchGasCost || 0)
        data.ownedMarketsWithFunds.push(market)
      }
    })

    // Shares escape hatch
    Object.keys(accountPositions).forEach((marketId) => {
      const market = marketsData[marketId]
      if (market.frozenSharesValue > 0) {
        data.eth = data.eth.plus(market.frozenSharesValue)
        data.gas = data.gas.plus(market.tradingEscapeHatchGasCost || 0)
        data.marketsWithShares.push(market)
      }
    })

    Object.keys(disputeCrowdsourcers).forEach((disputeCrowdsourcerID) => {
      const disputeCrowdsourcer = disputeCrowdsourcers[disputeCrowdsourcerID]
      if (disputeCrowdsourcer.balance > 0) {
        data.rep = data.rep.plus(disputeCrowdsourcer.balance)
        data.gas = data.gas.plus(disputeCrowdsourcer.escapeHatchGasCost || 0)
      }
    })

    Object.keys(initialReporters).forEach((initialReporterID) => {
      const initialReporter = initialReporters[initialReporterID]
      if (initialReporter.repBalance > 0) {
        data.rep = data.rep.plus(initialReporter.repBalance)
        data.gas = data.gas.plus(initialReporter.escapeHatchGasCost || 0)
      }
    })

    Object.keys(partcipationTokens).forEach((participationTokenID) => {
      const partcipationToken = partcipationTokens[participationTokenID]
      if (partcipationToken.balance > 0) {
        data.rep = data.rep.plus(partcipationToken.balance)
        data.gas = data.gas.plus(partcipationToken.escapeHatchGasCost || 0)
      }
    })

    data.fundsAvailableForWithdrawl = data.rep + data.eth > 0

    return data
  },
)
