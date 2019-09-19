import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Disputing from "modules/reporting/disputing";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";

const mapStateToProps = state => ({
  isConnected: state.connection.isConnected
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
