import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReportingReportMarkets from "modules/reporting/components/reporting-report-markets/reporting-report-markets";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_DR_QUICK_GUIDE } from "modules/common/constants";

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  openReportingModal: () => dispatch(updateModal({ type: MODAL_DR_QUICK_GUIDE })),
});

const ReportingReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReportingReportMarkets)
);

export default ReportingReportingContainer;
