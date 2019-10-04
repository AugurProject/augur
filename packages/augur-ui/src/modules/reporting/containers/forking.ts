import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Forking from "modules/reporting/forking";

const mapStateToProps = state => ({
  isConnected: state.connection.isConnected
});

const mapDispatchToProps = dispatch => ({});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP,
  };
};

const ForkContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Forking)
);

export default ForkContainer;
