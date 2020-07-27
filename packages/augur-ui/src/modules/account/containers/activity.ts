import { connect } from "react-redux";
import { formatDaiAbbr } from "utils/format-number";
import Activity from "modules/account/components/activity";
import { updatePlatformTimeframeData } from "modules/account/actions/update-platform-timeframe-data";
import { selectCurrentTimestampInSeconds } from "appStore/select-state";
import { AppState } from "appStore";

const mapStateToProps = (state: AppState) => {
  const value =
    (state.universe &&
      state.universe.timeframeData &&
      state.universe.timeframeData.openInterest) ||
    0;
  const openInterest = formatDaiAbbr(value, { removeComma: true });
  return {
    openInterest,
    currentAugurTimestamp: selectCurrentTimestampInSeconds(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  updatePlatformTimeframeData: (startTime) =>
    dispatch(updatePlatformTimeframeData({ startTime })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Activity);
