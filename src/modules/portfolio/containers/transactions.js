import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import { selectTransactions } from 'modules/transactions/selectors/transactions'
import TransactionsList from 'modules/portfolio/components/transactions/transactions'

const mapStateToProps = state => ({
  transactions: selectTransactions(state),
  transactionsLoading: state.transactionsLoading,
})

const mapDispatchToProps = dispatch => ({
  loadAccountHistoryTransactions: (beginDate, endDate) => dispatch(loadAccountHistory(beginDate, endDate)),
})

const Transactions = withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionsList))

export default Transactions
