import { connect } from 'react-redux';
import {
  selectReportingBalances,
  selectDefaultReportingBalances,
} from 'modules/account/selectors/select-reporting-balances';
import { UserRepDisplay } from 'modules/reporting/common';

const mapStateToProps = state => {
  const isLogged = state.authStatus.isLogged;
  const repBalances = isLogged
    ? selectReportingBalances(state)
    : selectDefaultReportingBalances();
  return {
    ...repBalances,
  };
};

const mapDispatchToProps = dispatch => ({
  openGetRepModal: () => {},
  // TODO: add in call to show get rep modal
  // dispatch(updateModal({ type: xxxxxxx })),
});

const ReportingReportingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRepDisplay);

export default ReportingReportingContainer;
