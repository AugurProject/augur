import { connect } from 'react-redux';
import { ReportingCard } from 'modules/reporting/common';
import { selectMarket } from "modules/markets/selectors/market";
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_REPORTING } from "modules/common/constants";

const mapStateToProps = (state, ownProps) => {
  return {
    market: selectMarket(ownProps.marketId),
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    reportingWindowStatsEndTime: state.reportingWindowStats.endTime,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	showReportingModal: (cb: NodeStyleCallback) =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        marketId: ownProps.marketId,
        cb,
      }),
    ),
});

const ReportingCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingCard);

export default ReportingCardContainer;
