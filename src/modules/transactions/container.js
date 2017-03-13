import { connect } from 'react-redux';
import TransactionsView from 'modules/transactions/components/transactions-view';

const mapStateToProps = state => ({ currentBlockNumber: state.blockchain.currentBlockNumber });

const Transactions = connect(mapStateToProps)(TransactionsView);

export default Transactions;
