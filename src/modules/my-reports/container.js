import { connect } from 'react-redux';

import MyReports from 'modules/my-reports/components/my-reports';

import getMyReports from 'modules/my-reports/selectors/my-reports';

const mapStateToProps = state => ({
  branch: state.branch,
  reports: getMyReports()
});

const MyReportsContainer = connect(mapStateToProps)(MyReports);

export default MyReportsContainer;
