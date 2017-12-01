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
import { TOPIC_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    filteredMarkets: PropTypes.array.isRequired,
    canLoadMarkets: PropTypes.bool.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    hasLoadedTopic: PropTypes.object.isRequired,
    loadMarkets: PropTypes.func.isRequired,
    loadMarketsByTopic: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    updateMarketsFilteredSorted: PropTypes.func.isRequired,
    clearMarketsFilteredSorted: PropTypes.func.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfo: PropTypes.func.isRequired
  }

  componentWillMount() {
    loadMarkets({
      canLoadMarkets: this.props.canLoadMarkets,
      location: this.props.location,
      loadMarkets: this.props.loadMarkets,
      loadMarketsByTopic: this.props.loadMarketsByTopic,
      hasLoadedMarkets: this.props.hasLoadedMarkets,
      hasLoadedTopic: this.props.hasLoadedTopic
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.canLoadMarkets !== nextProps.canLoadMarkets && nextProps.canLoadMarkets) ||
      this.props.location !== nextProps.location ||
      this.props.hasLoadedTopic !== nextProps.hasLoadedTopic ||
      (this.props.hasLoadedMarkets !== nextProps.hasLoadedMarkets && !nextProps.hasLoadedMarkets)
    ) {
      loadMarkets({
        canLoadMarkets: nextProps.canLoadMarkets,
        location: nextProps.location,
        loadMarkets: nextProps.loadMarkets,
        loadMarketsByTopic: nextProps.loadMarketsByTopic,
        hasLoadedMarkets: this.props.hasLoadedMarkets,
        hasLoadedTopic: this.props.hasLoadedTopic
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
          scalarShareDenomination={p.scalarShareDenomination}
          toggleFavorite={p.toggleFavorite}
          loadMarketsInfo={p.loadMarketsInfo}
          linkType={TYPE_TRADE}
        />
      </section>
    )
  }
}

function loadMarkets(options) {
  if (options.canLoadMarkets) {
    const topic = parseQuery(options.location.search)[TOPIC_PARAM_NAME]

    if (topic && !options.hasLoadedTopic[topic]) {
      options.loadMarketsByTopic(topic)
    } else if (!topic) {
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
