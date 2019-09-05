import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Reporting from "modules/reporting/reporting";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_DR_QUICK_GUIDE, REPORTING_STATE } from "modules/common/constants";

const mapStateToProps = (state: AppState) => {
  const loginAccount = state.loginAccount;
	
  return {
    isLogged: state.authStatus.isLogged,
  	upcomingMarkets: Object.values(state.marketInfos || {}).filter(market => market.designatedReporter.toLowerCase() === loginAccount.address && market.reportingState === REPORTING_STATE.PRE_REPORTING),
  	openMarkets: Object.values(state.marketInfos || {}).filter(market => market.reportingState === REPORTING_STATE.OPEN_REPORTING),
    designatedReporterMarkets: Object.values(state.marketInfos || {}).filter(market => market.designatedReporter.toLowerCase() === loginAccount.address && market.reportingState === REPORTING_STATE.DESIGNATED_REPORTING)
  };
};

const mapDispatchToProps = dispatch => ({
  openReportingModal: () => dispatch(updateModal({ type: MODAL_DR_QUICK_GUIDE })),
});

const ReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Reporting)
);

export default ReportingContainer;
