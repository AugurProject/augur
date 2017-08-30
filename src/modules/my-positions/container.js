import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import memoize from 'memoizee'

import MyPositions from 'modules/my-positions/components/my-positions'

import getLoginAccountPositions from 'modules/my-positions/selectors/login-account-positions'
import getOpenOrders from 'modules/user-open-orders/selectors/open-orders'
import getClosePositionStatus from 'modules/my-positions/selectors/close-position-status'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation'
import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export'

const mapStateToProps = (state) => {
  const positions = getLoginAccountPositions()
  const openOrders = getOpenOrders()

  return {
    markets: getPositionsMarkets(positions, openOrders),
    closePositionStatus: getClosePositionStatus(),
    scalarShareDenomination: getScalarShareDenomination(),
    orderCancellation: getOrderCancellation(),
    transactionsLoading: state.transactionsLoading,
    hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber // FIXME
  }
}

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true)),
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
})

const getPositionsMarkets = memoize((positions, openOrders) => Array.from(new Set([...positions.markets, ...openOrders])), { max: 1 })

const MyPositionsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MyPositions))

export default MyPositionsContainer
