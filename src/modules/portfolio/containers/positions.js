import { connect } from 'react-redux'
import memoize from 'memoizee'

import Positions from 'modules/portfolio/components/positions/positions'

import getLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions'
import getOpenOrders from 'modules/user-open-orders/selectors/open-orders'
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation'
import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export'
import { constants } from 'services/augurjs'

const mapStateToProps = (state) => {
  const positions = getLoginAccountPositions()
  const openOrders = getOpenOrders()
  const reportingStates = constants.REPORTING_STATE
  const openPositionMarkets = []
  const reportingMarkets = []
  const closedMarkets = []
  // NOTE: for data wiring, this should probably be just done as calls for getting openPosition Markets, getting Reporting Markets, and getting Closed Markets respectively from the node and just passed the expected keys below
  const markets = getPositionsMarkets(positions, openOrders)
  // sort out markets, this will be removed in v3.1 as getting each section of markets should be it's own call
  markets.forEach((market, index) => {
    if (market.reportingState === reportingStates.FINALIZED) {
      closedMarkets.push(market)
    } else if (market.reportingState !== reportingStates.PRE_REPORTING) {
      reportingMarkets.push(market)
    } else {
      openPositionMarkets.push(market)
    }
  })

  return {
    openPositionMarkets,
    reportingMarkets,
    closedMarkets,
    closePositionStatus: getClosePositionStatus(),
    scalarShareDenomination: getScalarShareDenomination(),
    orderCancellation: getOrderCancellation(),
    transactionsLoading: state.transactionsLoading,
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber,
    registerBlockNumber: state.loginAccount.registerBlockNumber
  }
}

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true)),
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
})

const getPositionsMarkets = memoize((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])), { max: 1 })

const PositionsContainer = connect(mapStateToProps, mapDispatchToProps)(Positions)

export default PositionsContainer
