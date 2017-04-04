import { connect } from 'react-redux';
import { selectTransactions } from 'modules/transactions/selectors/transactions';
import { selectTransactionsTotals } from 'modules/transactions/selectors/transactions-totals';
import { selectLoginAccount } from 'modules/account/selectors/login-account';
import TransactionsView from 'modules/transactions/components/transactions-view';

const mapStateToProps = state => ({
  branch: state.branch,
  loginAccount: selectLoginAccount(state),
  currentBlockNumber: state.blockchain.currentBlockNumber,
  transactions: selectTransactions(state),
  transactionsTotals: selectTransactionsTotals(state)
});

const Transactions = connect(mapStateToProps)(TransactionsView);

export default Transactions;
