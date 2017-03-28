import { connect } from 'react-redux';
import TransactionsView from 'modules/transactions/components/transactions-view';

import transactions from 'modules/transactions/selectors/transactions';

const mapStateToProps = state => ({
  branch: state.branch,
  loginAccount: state.loginAccount,
  transactions: transactions(),
  currentBlockNumber: state.blockchain.currentBlockNumber
});

const Transactions = connect(mapStateToProps)(TransactionsView);

export default Transactions;
