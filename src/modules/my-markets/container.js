import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MyMarkets from 'modules/my-markets/components/my-markets'
import getMyMarkets from 'modules/my-markets/selectors/my-markets'
import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export'

const mapStateToProps = state => ({
  myMarkets: getMyMarkets(),
  transactionsLoading: state.transactionsLoading,
  hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber // FIXME
})

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true)),
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
})

const MyMarketsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MyMarkets))

export default MyMarketsContainer
