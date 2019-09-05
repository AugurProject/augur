import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Reporting from "modules/reporting/reporting";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_DR_QUICK_GUIDE } from "modules/common/constants";
import { AppState } from "./store";

const mapStateToProps = (state: AppState) => ({});

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
