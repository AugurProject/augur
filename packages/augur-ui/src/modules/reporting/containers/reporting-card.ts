import { connect } from 'react-redux';
import { ReportingCard } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_REPORTING } from "modules/common/constants";

const mapStateToProps = (state, ownProps) => {
  return {
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.reportingWindowStats.endTime,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	showReportingModal: () =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        marketId: ownProps.marketId
      }),
    ),
});

const ReportingCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingCard);

export default ReportingCardContainer;
