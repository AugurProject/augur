import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { selectMarket } from "modules/markets/selectors/market";
import MarketCard from "modules/market-cards/market-card";
import { toggleFavorite } from "modules/markets/actions/update-favorites";

const mapStateToProps = (state, ownProps) => ({
  isLogged: state.authStatus.isLogged,
  isMobile: state.appStatus.isMobile,
  pendingLiquidityOrders: state.pendingLiquidityOrders,
  currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  reportingWindowStatsEndTime: state.reportingWindowStats.endTime,
  address: state.loginAccount.address,
  isFavorite: !!state.favorites[ownProps.market.marketId],
});

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId))
});

const MarketCardContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketCard)
);

export default MarketCardContainer;
