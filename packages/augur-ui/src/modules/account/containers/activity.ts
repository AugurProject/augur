import { connect } from 'react-redux';
import { formatDai } from 'utils/format-number';
import Activity from 'modules/account/components/activity';
import { updatePlatformTimeframeData } from 'modules/account/actions/update-platform-timeframe-data';
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk-lite';
import { AppState } from 'appStore';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState) => {
  const value = convertAttoValueToDisplayValue(createBigNumber(state?.universe?.totalOpenInterest || 0));
  const openInterest = formatDai(value, { removeComma: true });
  return {
    openInterest,
    currentAugurTimestamp: selectCurrentTimestampInSeconds(state),
  };
};

const mapDispatchToProps = dispatch => ({
  updatePlatformTimeframeData: startTime =>
    dispatch(updatePlatformTimeframeData({ startTime })),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
