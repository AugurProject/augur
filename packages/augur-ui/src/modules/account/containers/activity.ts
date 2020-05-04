import { connect } from "react-redux";
import { formatDai } from "utils/format-number";
import Activity from "modules/account/components/activity";
import { updatePlatformTimeframeData } from "modules/account/actions/update-platform-timeframe-data";
import { AppState } from "appStore";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state: AppState) => {
  const { universe: { timeframeData }, blockchain: { currentAugurTimestamp }} = AppStatus.get();
  const value = timeframeData?.openInterest || 0;
  const openInterest = formatDai(value, { decimals: 2, removeComma: true });
  return {
    openInterest,
    currentAugurTimestamp,
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
