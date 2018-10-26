import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Favorites from "modules/portfolio/components/favorites/favorites";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import {
  loadMarketsInfo,
  loadMarketsInfoIfNotLoaded
} from "modules/markets/actions/load-markets-info";
import selectAllMarkets from "modules/markets/selectors/markets-all";

const mapStateToProps = state => {
  // basically just create the filtered markets based on what IDs we find in the favorites object
  const markets = selectAllMarkets();
  const { favorites } = state;
  const filteredMarkets = Object.keys(favorites).reduce(
    (filtered, favoriteId) => {
      if (markets.find(market => market.id === favoriteId)) {
        filtered.push(favoriteId);
      }
      return filtered;
    },
    []
  );

  return {
    isLogged: state.authStatus.isLogged,
    isMobile: state.appStatus.isMobile,
    markets,
    filteredMarkets,
    transactionsLoading: state.appStatus.transactionsLoading
  };
};

const mapDispatchToProps = dispatch => ({
  loadMarketsInfo: marketIds => dispatch(loadMarketsInfo(marketIds)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds))
});

const FavoritesContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Favorites)
);

export default FavoritesContainer;
