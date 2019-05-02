import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketHeaderBar from "modules/market/components/market-header/market-header-bar";
import { toggleFavorite } from "modules/markets/actions/update-favorites";

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.authStatus.isLogged,
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  reportingWindowStatsEndTime: state.reportingWindowStats.endTime
});

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId))
});

const MarketHeaderContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketHeaderBar)
);

export default MarketHeaderContainer;
