import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import MarketsList from "modules/markets-list/components/markets-list";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";
import Styles from "modules/portfolio/components/favorites/favorites.styles";

const Favorites = p => (
  <section className={Styles.Favorites}>
    <Helmet>
      <title>Favorites</title>
    </Helmet>
    <MarketsHeaderLabel title="Favorites" noTopPadding />
    <MarketsList {...p} />
  </section>
);

Favorites.propTypes = {
  markets: PropTypes.array.isRequired,
  filteredMarkets: PropTypes.array.isRequired,
  isLogged: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  loadMarketsInfo: PropTypes.func.isRequired,
  loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired
};

export default Favorites;
