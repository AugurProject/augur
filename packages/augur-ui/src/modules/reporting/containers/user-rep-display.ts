import { connect } from 'react-redux';
import {
  selectReportingBalances,
  selectDefaultReportingBalances,
} from 'modules/account/selectors/select-reporting-balances';
import { UserRepDisplay } from 'modules/reporting/common';
import { MODAL_ADD_FUNDS, REP } from 'modules/common/constants';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = state => {
  const isLoggedIn = AppStatus.get().isLogged;
  const repBalances = isLoggedIn
    ? selectReportingBalances(state)
    : selectDefaultReportingBalances();
  return {
    ...repBalances,
  };
};

const mapDispatchToProps = dispatch => ({
  openGetRepModal: () =>
    AppStatus.actions.setModal({ type: MODAL_ADD_FUNDS, fundType: REP }),
});

const ReportingReportingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRepDisplay);

export default ReportingReportingContainer;
