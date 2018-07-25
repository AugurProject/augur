import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsHeader from 'modules/markets/components/markets-header/markets-header'
import MarketsList from 'modules/markets/components/markets-list'
import isEqual from 'lodash/isEqual'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    canLoadMarkets: PropTypes.bool.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    category: PropTypes.string,
    hasLoadedCategory: PropTypes.object.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsByCategory: PropTypes.func.isRequired,
    loadMarketsBySearch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    tags: PropTypes.array,
    keywords: PropTypes.string,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
  }

  componentDidMount() {
    const {
      canLoadMarkets,
      category,
      hasLoadedCategory,
      hasLoadedMarkets,
      loadMarkets,
      loadMarketsByCategory,
    } = this.props

    loadMarketsFn({
      canLoadMarkets,
      category,
      loadMarkets,
      loadMarketsByCategory,
      hasLoadedMarkets,
      hasLoadedCategory,
    })
  }

  componentDidUpdate(prevProps) {
    const {
      canLoadMarkets,
      category,
      hasLoadedCategory,
      hasLoadedMarkets,
      loadMarkets,
      loadMarketsByCategory,
      loadMarketsBySearch,
      tags,
      keywords,
    } = this.props
    if (
      (category !== prevProps.category) ||
      (keywords !== prevProps.keywords) ||
      (tags !== prevProps.tags) ||
      (canLoadMarkets !== prevProps.canLoadMarkets && canLoadMarkets) ||

      !isEqual(hasLoadedCategory, prevProps.hasLoadedCategory) ||
      (hasLoadedMarkets !== prevProps.hasLoadedMarkets && !hasLoadedMarkets)
    ) {
      loadMarketsFn({
        canLoadMarkets,
        category,
        location,
        loadMarkets,
        loadMarketsByCategory,
        loadMarketsBySearch,
        hasLoadedMarkets,
        hasLoadedCategory,
        tags,
        keywords,
      })
    }
  }

  render() {
    const {
      filteredMarkets,
      history,
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      location,
      markets,
      toggleFavorite,
    } = this.props
    return (
      <section id="markets_view">
        <Helmet>
          <title>Markets</title>
        </Helmet>
        <MarketsHeader
          isLogged={isLogged}
          location={location}
          markets={markets}
        />
        <MarketsList
          testid="markets"
          isLogged={isLogged}
          markets={markets}
          filteredMarkets={filteredMarkets}
          location={location}
          history={history}
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          linkType={TYPE_TRADE}
          isMobile={isMobile}
        />
      </section>
    )
  }
}

function loadMarketsFn({ canLoadMarkets, category, hasLoadedCategory, loadMarketsByCategory, loadMarketsBySearch, loadMarkets, tags, keywords }) {
  if (canLoadMarkets) {
    // Expected behavior is to load a specific category if one is present
    // else, if we aren't searching (which is a local market data search)
    // then load markets (loads all markets)
    if (category && !hasLoadedCategory[category]) {
      loadMarketsByCategory(category)
    } else if (tags && tags.length > 0 && !hasLoadedCategory.tags) {
      loadMarketsBySearch(tags.join(' ').trim(), 'tags')
    } else if (keywords && keywords.length > 3 && !hasLoadedCategory.keywords) {
      loadMarketsBySearch(keywords, 'keywords')
    } else if (!hasLoadedCategory.all) {
      loadMarkets('all')
    }
  }
}
