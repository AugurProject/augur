import { connect } from 'react-redux';

import MyReports from 'modules/my-reports/components/my-reports';
import getMyReports from 'modules/my-reports/selectors/my-reports';
import { loadAccountHistory } from 'modules/auth/actions/load-account-history';

const mapStateToProps = state => ({
  branch: state.branch,
  reports: getMyReports(),
  transactionsLoading: state.transactionsLoading,
  hasAllTransactionsLoaded: state.transactionsOldestLoadedBlock === state.loginAccount.registerBlockNumber
});

const mapDispatchToProps = dispatch => ({
  loadMoreTransactions: () => dispatch(loadAccountHistory()),
  loadAllTransactions: () => dispatch(loadAccountHistory(true))
});

const MyReportsContainer = connect(mapStateToProps, mapDispatchToProps)(MyReports);

export default MyReportsContainer;
