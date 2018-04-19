import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsList from 'modules/markets/components/markets-list'
import Styles from 'modules/portfolio/components/favorites/favorites.styles'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

const Favorites = p => (
  <section className={Styles.Favorites}>
    <Helmet>
      <title>Favorites</title>
    </Helmet>
    <div
      className={Styles.Favorites__SortBar}
    >
      <div
        className={Styles['Favorites__SortBar-title']}
      >
        Favorites
      </div>

    </div>
    <MarketsList
      isLogged={p.isLogged}
      markets={p.markets}
      filteredMarkets={p.filteredMarkets}
      location={p.location}
      history={p.history}
      toggleFavorite={p.toggleFavorite}
      loadMarketsInfo={p.loadMarketsInfo}
      loadMarketsInfoIfNotLoaded={p.loadMarketsInfoIfNotLoaded}
      linkType={TYPE_TRADE}
      isMobile={p.isMobile}
    />
  </section>
)

Favorites.propTypes = {
  markets: PropTypes.array.isRequired,
  filteredMarkets: PropTypes.array.isRequired,
  isLogged: PropTypes.bool.isRequired,
  hasAllTransactionsLoaded: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  loadMarketsInfo: PropTypes.func.isRequired,
  loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}

export default Favorites
