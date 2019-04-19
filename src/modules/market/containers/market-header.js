import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketHeader from "modules/market/components/market-header/market-header";
import { ZERO } from "modules/common-elements/constants";
import { selectMarket } from "modules/markets/selectors/market";
import { toggleFavorite } from "modules/markets/actions/update-favorites";

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId);

  return {
    description: market.description || "",
    details: market.details || "",
    marketType: market.marketType,
    maxPrice: market.maxPrice || ZERO,
    minPrice: market.minPrice || ZERO,
    scalarDenomination: market.scalarDenomination,
    resolutionSource: market.resolutionSource,
    currentTime: (state.blockchain || {}).currentAugurTimestamp,
    isLogged: state.authStatus.isLogged,
    isForking: state.universe.isForking,
    isMobileSmall: state.appStatus.isMobileSmall,
    market,
    isFavorite: !!state.favorites[ownProps.marketId],
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp
  };
};

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId))
});

const MarketHeaderContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketHeader)
);

export default MarketHeaderContainer;
