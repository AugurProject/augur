import { connect } from "react-redux";

import ReportingHeader from "modules/reporting/components/reporting-header/reporting-header";

import { sendFinalizeMarket } from "modules/markets/actions/finalize-market";
import { updateModal } from "modules/modal/actions/update-modal";

const mapStateToProps = state => ({
  reportingWindowStats: state.reportingWindowStats,
  isMobile: state.appStatus.isMobile,
  repBalance: state.loginAccount.balances.rep,
  forkingMarket: state.universe.forkingMarket,
  currentTime: state.blockchain.currentAugurTimestamp,
  doesUserHaveRep: state.loginAccount.balances.rep > 0,
  forkReputationGoal: state.universe.forkReputationGoal,
  isForkingMarketFinalized: state.universe.isForkingMarketFinalized,
  isLogged: state.authStatus.isLogged,
  universe: (state.universe || {}).id
});

const mapDispatchToProps = dispatch => ({
  loadReportingWindowStake: () => {
    /* TODO */
  },
  loadReportingWindowBounds: () => {
    /* TODO */
  },
  updateModal: modal => dispatch(updateModal(modal)),
  finalizeMarket: marketId => dispatch(sendFinalizeMarket(marketId))
});

const mergeProps = (sP, dP, oP) => ({
  ...oP,
  ...sP,
  ...dP
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReportingHeader);
