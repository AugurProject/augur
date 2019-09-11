import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketsInDispute from "modules/reporting/components/markets-in-dispute";
import { loadDisputeWindow } from "modules/auth/actions/load-dispute-window";

const mapStateToProps = state => ({
  isConnected: state.connection.isConnected,
  address: state.loginAccount.mixedCaseAddress,
  markets: state.marketInfos,
});

const mapDispatchToProps = dispatch => ({
  // loadDisputeWindow: () => dispatch(loadDisputeWindow()),
});

const mergeProps = (sP, dP, oP) => {
  return {
    ...oP,
    ...sP,
    ...dP,
  };
};

const Reporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(MarketsInDispute)
);

export default Reporting;
