import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Favorites from "modules/portfolio/components/favorites/favorites";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { selectMarket } from "modules/markets/selectors/market";
import { MarketData } from "modules/types";

const mapStateToProps = (state) => {
  // basically just create the filtered markets based on what IDs we find in the favorites object
  const { favorites } = state;
  const filteredMarkets: Array<MarketData> = Object.keys(favorites).reduce(
    (filtered: any, marketId: string) => [
      ...filtered,
      { ...selectMarket(marketId), favoriteAddedData: favorites[marketId] }
    ],
    [],
  );

  return {
    isLogged: state.authStatus.isLogged,
    markets: filteredMarkets,
    currentAugurTimestamp: state.blockchain.currentAugurTimestamp,
  };
};

const mapDispatchToProps = (dispatch) => ({
  toggleFavorite: (marketId) => dispatch(toggleFavorite(marketId)),
});

const FavoritesContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Favorites),
);

export default FavoritesContainer;
