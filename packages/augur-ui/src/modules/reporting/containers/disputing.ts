import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Disputing from "modules/reporting/disputing";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";
import { MODAL_DR_QUICK_GUIDE } from 'modules/common/constants';
import { AppStatusActions } from "modules/app/store/app-status";

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  loadDisputeWindow: () => dispatch(loadDisputeWindow()),
  openDisputingModal: () => AppStatusActions.actions.setModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'disputing' }),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP,
  };
};

const DisputeContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Disputing)
);

export default DisputeContainer;
