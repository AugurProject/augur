import { createBigNumber } from 'utils/create-big-number'
import { createSelector } from 'reselect'
import { each } from 'async'
import store from 'src/store'
import speedomatic from 'speedomatic'
import { selectAccountPositionsState, selectMarketsDataState, selectParticipationTokens, selectInitialReporters, selectDisputeCrowdsourcerTokens, selectAllOrders } from 'src/select-state'
import selectMyMarkets from 'modules/my-markets/selectors/my-markets'

export default function () {
  return getEscapeHatchData(store.getState())
}

export const CANCEL_ORDER_GAS_ESTIMATE = 250000

export const getEscapeHatchData = createSelector(
  selectMarketsDataState,
  selectMyMarkets,
  selectAccountPositionsState,
  selectParticipationTokens,
  selectInitialReporters,
  selectDisputeCrowdsourcerTokens,
  selectAllOrders,
  (marketsData, myMarkets, accountPositions, participationTokens, initialReporters, disputeCrowdsourcers, orders = {}) => {
    const data = {
      eth: createBigNumber(0),
      rep: createBigNumber(0),
      shares: createBigNumber(0),
      gas: createBigNumber(0),
      ownedMarketsWithFunds: [],
      marketsWithShares: [],
      fundsAvailableForWithdrawal: createBigNumber(0),
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

    Object.keys(participationTokens).forEach((participationTokenID) => {
      const partcipationToken = participationTokens[participationTokenID]
      if (partcipationToken.balance > 0) {
        data.rep = data.rep.plus(partcipationToken.balance)
        data.gas = data.gas.plus(partcipationToken.escapeHatchGasCost || 0)
      }
    })

    Object.keys(orders).forEach((orderId) => {
      const order = orders[orderId]
      data.eth = data.eth.plus(createBigNumber(speedomatic.fix(order.tokensEscrowed)))
      data.shares = data.shares.plus(createBigNumber(speedomatic.fix(order.sharesEscrowed)))
      data.gas = data.gas.plus(CANCEL_ORDER_GAS_ESTIMATE)
    })

    data.fundsAvailableForWithdrawal = data.rep.plus(data.eth).plus(data.shares)

    return data
  },
)
