import { connect } from 'react-redux';
import { selectTransactions } from 'modules/transactions/selectors/transactions';
import { selectLoginAccount } from 'modules/account/selectors/login-account';
import TransactionsView from 'modules/transactions/components/transactions-view';

const mapStateToProps = state => ({
  branch: state.branch,
  currentBlockNumber: state.blockchain.currentBlockNumber,
  loginAccount: selectLoginAccount(state),
  transactions: selectTransactions(state)
});

const Transactions = connect(mapStateToProps)(TransactionsView);

export default Transactions;
