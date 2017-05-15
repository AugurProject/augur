import { connect } from 'react-redux';
import TransactionsView from 'modules/transactions/components/transactions-view';

import { selectTransactions } from 'modules/transactions/selectors/transactions';
import { selectLoginAccount } from 'modules/account/selectors/login-account';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';

const mapStateToProps = state => ({
  branch: state.branch,
  currentBlockNumber: state.blockchain.currentBlockNumber,
  loginAccount: selectLoginAccount(state),
  transactions: selectTransactions(state),
  transactionsLoading: state.transactionsLoading,
  hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber
});

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true))
});

const Transactions = connect(mapStateToProps, mapDispatchToProps)(TransactionsView);

export default Transactions;
