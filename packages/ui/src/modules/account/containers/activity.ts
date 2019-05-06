import { connect } from "react-redux";
import { formatAttoEth } from "utils/format-number";
import Activity from "modules/account/components/augur-status/activity";
import { updatePlatformTimeframeData } from "modules/account/actions/update-platform-timeframe-data";
import { selectCurrentTimestampInSeconds } from "src/select-state";

const mapStateToProps = (state: any) => {
  const value =
    (state.universe &&
      state.universe.timeframeData &&
      state.universe.timeframeData.openInterest) ||
    0;
  const openInterest = formatAttoEth(value, { decimals: 4 });
  return {
    openInterest,
    currentAugurTimestamp: selectCurrentTimestampInSeconds(state)
  };
};

const mapDispatchToProps = dispatch => ({
  updatePlatformTimeframeData: startTime =>
    dispatch(updatePlatformTimeframeData({ startTime }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activity);
