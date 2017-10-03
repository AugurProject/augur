import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MyReports from 'modules/my-reports/components/my-reports';
import getMyReports from 'modules/my-reports/selectors/my-reports';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';
import { triggerTransactionsExport } from 'modules/transactions/actions/trigger-transactions-export';

const mapStateToProps = state => ({
  branch: state.branch,
  reports: getMyReports(),
  transactionsLoading: state.transactionsLoading,
  hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber // FIXME
});

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true)),
  triggerTransactionsExport: () => dispatch(triggerTransactionsExport()),
});

const MyReportsContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(MyReports));

export default MyReportsContainer;
