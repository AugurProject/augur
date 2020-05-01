import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { WindowProgress } from 'modules/common/progress';

const mapStateToProps = state => ({
  disputeWindow: state.universe.disputeWindow,
  currentTime: state.blockchain.currentAugurTimestamp
});

const mapDispatchToProps = dispatch => ({
});

const mergeProps = (sP, dP, oP) => {
  const { startTime, endTime } = sP.disputeWindow;
  return {
    ...oP,
    ...sP,
    ...dP,
    startTime,
    endTime,
    title:"Current Dispute Window",
    countdownLabel:"Time Remaining in Window",
  };
};

const DisputeWindowProgressContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(WindowProgress)
);

export default DisputeWindowProgressContainer;
