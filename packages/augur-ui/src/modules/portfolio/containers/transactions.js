import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { selectCurrentTimestamp } from "src/select-state";
import { loadAccountHistory } from "modules/auth/actions/load-account-history";
import { selectTransactions } from "modules/transactions/selectors/transactions";
import TransactionsList from "modules/portfolio/components/transactions/transactions";
import {
  updateFilterSortOptions,
  TRANSACTION_PERIOD
} from "modules/filter-sort/actions/update-filter-sort-options";

const mapStateToProps = state => ({
  currentTimestamp: selectCurrentTimestamp(state),
  transactions: selectTransactions(state),
  transactionsLoading: state.appStatus.transactionsLoading,
  transactionPeriod: state.filterSortOptions.transactionPeriod
});

const mapDispatchToProps = dispatch => ({
  loadAccountHistoryTransactions: (beginTime, endTime, type) =>
    dispatch(loadAccountHistory(beginTime, endTime, type)),
  updateTransactionPeriod: transactionPeriod =>
    dispatch(updateFilterSortOptions(TRANSACTION_PERIOD, transactionPeriod))
});

const Transactions = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransactionsList)
);

export default Transactions;
