import { connect } from 'react-redux';
import { selectTransactions } from 'modules/transactions/selectors/transactions';
import { selectTransactionsTotals } from 'modules/transactions/selectors/transactions-totals';
import TransactionsView from 'modules/transactions/components/transactions-view';

const mapStateToProps = state => ({
  branch: state.branch,
  loginAccount: state.loginAccount,
  currentBlockNumber: state.blockchain.currentBlockNumber,
  transactions: selectTransactions(state),
  transactionsTotals: selectTransactionsTotals(state)
});

const Transactions = connect(mapStateToProps)(TransactionsView);

export default Transactions;
