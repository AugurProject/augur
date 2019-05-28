import { connect } from "react-redux";
import Overview from "modules/account/components/overview";
import { updateTimeframeData } from "modules/account/actions/update-timeframe-data";
import { selectCurrentTimestampInSeconds } from "store/select-state";

const mapStateToProps = (state: any) => ({
  currentAugurTimestamp: selectCurrentTimestampInSeconds(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  updateTimeframeData: (options: any) => dispatch(updateTimeframeData(options))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
