import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Disputing from "modules/reporting/disputing";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";

const mapStateToProps = state => ({
  account: state.loginAccount,
  isLogged: state.authStatus.isLogged,
  isConnected: state.connection.isConnected,
  disputeWindow: state.disputeWindowStats,
  currentTime: state.blockchain.currentAugurTimestamp
});

const mapDispatchToProps = dispatch => ({
  loadDisputeWindow: () => dispatch(loadDisputeWindow()),
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
