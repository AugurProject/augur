import { connect } from "react-redux";
import AccountOverview from "modules/account/components/account-overview/account-overview";
import { updateTimeframeData } from "modules/account/actions/update-timeframe-data";
import { selectCurrentTimestampInSeconds } from "src/select-state";

const mapStateToProps = (state: any) => ({
  currentAugurTimestamp: selectCurrentTimestampInSeconds(state)
});

const mapDispatchToProps = dispatch => ({
  updateTimeframeData: options => dispatch(updateTimeframeData(options))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountOverview);
