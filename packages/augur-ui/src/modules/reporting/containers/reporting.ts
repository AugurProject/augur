import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Reporting from "modules/reporting/reporting";
import { MODAL_DR_QUICK_GUIDE } from "modules/common/constants";
import { AppState } from "appStore";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => ({
});

const mapDispatchToProps = dispatch => ({
  openReportingModal: () => AppStatus.actions.setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'reporting' }),
});

const ReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Reporting)
);

export default ReportingContainer;
