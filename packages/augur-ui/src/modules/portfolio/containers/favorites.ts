import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Favorites from "modules/portfolio/components/favorites/favorites";
import { selectMarket } from "modules/markets/selectors/market";
import { MarketData } from "modules/types";
import { AppStatus } from "modules/app/store/app-status";

const mapStateToProps = (state) => {
  // basically just create the filtered markets based on what IDs we find in the favorites object
  const { favorites } = AppStatus.get();
  const filteredMarkets: Array<MarketData> = Object.keys(favorites).reduce(
    (filtered: any, marketId: string) => [
      ...filtered,
      { ...selectMarket(marketId), favoriteAddedData: favorites[marketId] }
    ],
    [],
  );

  return {
    markets: filteredMarkets,
  };
};


const FavoritesContainer = withRouter(
  connect(
    mapStateToProps,
  )(Favorites),
);

export default FavoritesContainer;
