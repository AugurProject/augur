import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { selectCurrentTimestamp } from "src/select-state";
import { loadAccountHistory } from "modules/auth/actions/load-account-history";
import { loadAccountCompleteSets } from "modules/positions/actions/load-account-complete-sets";
import { selectTransactions } from "modules/transactions/selectors/transactions";
import TransactionsList from "modules/portfolio/components/transactions/transactions";
import { updateTransactionPeriod } from "modules/transactions/actions/update-transaction-period";

const mapStateToProps = state => ({
  currentTimestamp: selectCurrentTimestamp(state),
  transactions: selectTransactions(state),
  transactionsLoading: state.appStatus.transactionsLoading,
  transactionPeriod: state.transactionPeriod
});

const mapDispatchToProps = dispatch => ({
  loadAccountHistoryTransactions: (beginTime, endTime) =>
    dispatch(loadAccountHistory(beginTime, endTime)),
  updateTransactionPeriod: transactionPeriod =>
    dispatch(updateTransactionPeriod(transactionPeriod)),
  loadAccountCompleteSets: () => dispatch(loadAccountCompleteSets())
});

const Transactions = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransactionsList)
);

export default Transactions;
