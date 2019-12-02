import { connect } from 'react-redux';
import {
  selectReportingBalances,
  selectDefaultReportingBalances,
} from 'modules/account/selectors/select-reporting-balances';
import { UserRepDisplay } from 'modules/reporting/common';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_ADD_FUNDS, REP } from 'modules/common/constants';

const mapStateToProps = state => {
  const isLoggedIn = state.authStatus.isLogged;
  const repBalances = isLoggedIn
    ? selectReportingBalances(state)
    : selectDefaultReportingBalances();
  return {
    ...repBalances,
    isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => ({
  openGetRepModal: () =>
    dispatch(updateModal({ type: MODAL_ADD_FUNDS, fundType: REP })),
});

const ReportingReportingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRepDisplay);

export default ReportingReportingContainer;
