import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketHeader from "modules/market/components/market-header/market-header";
import { ZERO, EXPIRY_SOURCE_GENERIC } from "modules/common/constants";
import { selectMarket } from "modules/markets/selectors/market";
import { toggleFavorite } from "modules/markets/actions/update-favorites";

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);

  return {
    description: market.description || "",
    details: market.details || market.detailsText || "",
    marketType: market.marketType,
    maxPrice: market.maxPriceBigNumber || ZERO,
    minPrice: market.minPriceBigNumber || ZERO,
    scalarDenomination: market.scalarDenomination,
    resolutionSource: market.resolutionSource ? market.resolutionSource : (market.expirySourceType === EXPIRY_SOURCE_GENERIC && "General knowledge" || market.expirySource),
    currentTime: (state.blockchain || {}).currentAugurTimestamp,
    isLogged: state.authStatus.isLogged,
    isForking: state.universe.isForking,
    market,
    isFavorite: !!state.favorites[ownProps.marketId],
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
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
