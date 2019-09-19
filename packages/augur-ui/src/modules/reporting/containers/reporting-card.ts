import { connect } from 'react-redux';
import { ReportingCard } from 'modules/reporting/common';
import { updateModal } from "modules/modal/actions/update-modal";
import { MODAL_REPORTING } from "modules/common/constants";
import { AppState } from 'store';

const mapStateToProps = (state: AppState, ownProps) => {
  return {
    isLogged: state.authStatus.isLogged,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
    disputingWindowEndTime: state.universe.disputeWindow.endTime,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	showReportingModal: () =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market: ownProps.market
      }),
    ),
});

const ReportingCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingCard);

export default ReportingCardContainer;
