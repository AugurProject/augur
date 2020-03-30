import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Reporting from "modules/reporting/reporting";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_DR_QUICK_GUIDE } from "modules/common/constants";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => ({
  showLoggedOut: !state.authStatus.isLogged,
});

const mapDispatchToProps = dispatch => ({
  openReportingModal: () => dispatch(updateModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'reporting' })),
});

const ReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Reporting)
);

export default ReportingContainer;
