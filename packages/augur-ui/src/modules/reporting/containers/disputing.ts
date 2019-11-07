import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Disputing from "modules/reporting/disputing";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_DR_QUICK_GUIDE } from 'modules/common/constants';

const mapStateToProps = state => ({
  isConnected: state.connection.isConnected
});

const mapDispatchToProps = dispatch => ({
  loadDisputeWindow: () => dispatch(loadDisputeWindow()),
  openDisputingModal: () => dispatch(updateModal({ type: MODAL_DR_QUICK_GUIDE, whichGuide: 'disputing' })),
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
