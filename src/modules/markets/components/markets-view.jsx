import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsHeader from 'modules/markets/components/markets-header/markets-header'
import MarketsList from 'modules/markets/components/markets-list'

// import getValue from 'utils/get-value'
import parseQuery from 'modules/routes/helpers/parse-query'
// import isEqual from 'lodash/isEqual'

// import parsePath from 'modules/routes/helpers/parse-path'
// import makePath from 'modules/routes/helpers/make-path'

// import { FAVORITES, MARKETS } from 'modules/routes/constants/views'
import { CATEGORY_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    canLoadMarkets: PropTypes.bool.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    hasLoadedCategory: PropTypes.object.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsByCategory: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateMarketsFilteredSorted: PropTypes.func.isRequired,
    clearMarketsFilteredSorted: PropTypes.func.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
  }

  componentWillMount() {
    loadMarkets({
      canLoadMarkets: this.props.canLoadMarkets,
      location: this.props.location,
      loadMarkets: this.props.loadMarkets,
      loadMarketsByCategory: this.props.loadMarketsByCategory,
      hasLoadedMarkets: this.props.hasLoadedMarkets,
      hasLoadedCategory: this.props.hasLoadedCategory,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.canLoadMarkets !== nextProps.canLoadMarkets && nextProps.canLoadMarkets) ||
      this.props.location !== nextProps.location ||
      this.props.hasLoadedCategory !== nextProps.hasLoadedCategory ||
      (this.props.hasLoadedMarkets !== nextProps.hasLoadedMarkets && !nextProps.hasLoadedMarkets)
    ) {
      loadMarkets({
        canLoadMarkets: nextProps.canLoadMarkets,
        location: nextProps.location,
        loadMarkets: nextProps.loadMarkets,
        loadMarketsByCategory: nextProps.loadMarketsByCategory,
        hasLoadedMarkets: this.props.hasLoadedMarkets,
        hasLoadedCategory: this.props.hasLoadedCategory,
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // if (!isEqual(this.state.markets, nextState.markets)) {
    //   this.props.updateMarketsFilteredSorted(nextState.markets)
    //   checkFavoriteMarketsCount(nextState.markets, nextProps.location, nextProps.history)
    // }
  }

  componentWillUnmount() {
    this.props.clearMarketsFilteredSorted()
  }

  render() {
    const p = this.props

    return (
      <section id="markets_view">
        <Helmet>
          <title>Markets</title>
        </Helmet>
        <MarketsHeader
          isLogged={p.isLogged}
          location={p.location}
          markets={p.markets}
        />
        <MarketsList
          isLogged={p.isLogged}
          markets={p.markets}
          filteredMarkets={p.filteredMarkets}
          location={p.location}
          history={p.history}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_TRADE}
          isMobile={p.isMobile}
        />
      </section>
    )
  }
}

function loadMarkets(options) {
  if (options.canLoadMarkets) {
    const category = parseQuery(options.location.search)[CATEGORY_PARAM_NAME]

    if (category && !options.hasLoadedCategory[category]) {
      options.loadMarketsByCategory(category)
    } else if (!category) {
      options.loadMarkets()
    }
  }
}

// function checkFavoriteMarketsCount(filteredMarkets, location, history) {
//   const path = parsePath(location.pathname)[0]
//
//   if (path === FAVORITES && !filteredMarkets.length) {
//     history.push(makePath(MARKETS))
//   }
// }
