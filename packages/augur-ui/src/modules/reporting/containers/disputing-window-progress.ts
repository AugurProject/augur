import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { WindowProgress } from 'modules/common/progress';
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = state => ({
  disputeWindow: AppStatus.get().universe.disputeWindow,
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
    description:"A few lines of information explaing the purpose of the Dispute Window",
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
