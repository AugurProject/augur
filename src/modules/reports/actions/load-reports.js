import loadReportsFromAugurNode from 'modules/reports/actions/load-reports-from-augur-node';
import logError from 'utils/log-error';

const loadReports = (callback = logError) => (dispatch, getState) => {
  const { loginAccount, branch } = getState();
  if (!loginAccount || !loginAccount.address || !branch.id) {
    return callback(null);
  }
  dispatch(loadReportsFromAugurNode());
};

export default loadReports;
