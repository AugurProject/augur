import { connect } from 'react-redux';
import { ReportingCard } from 'modules/reporting/common';
import { MODAL_REPORTING } from 'modules/common/constants';
import { AppState } from 'appStore';
import { AppStatusState, AppStatusActions } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe } = state;
  const { isLogged } = AppStatusState.get();
  return {
    isForking: universe.forkingInfo,
    isLogged: isLogged && !universe.forkingInfo,
    disputingWindowEndTime:
      (state.universe.disputeWindow && state.universe.disputeWindow.endTime) ||
      0,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  showReportingModal: () =>
    AppStatusActions.actions.setModal({
      type: MODAL_REPORTING,
      market: ownProps.market,
    }),
});

const ReportingCardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingCard);

export default ReportingCardContainer;
