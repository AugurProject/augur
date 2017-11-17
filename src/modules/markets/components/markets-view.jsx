import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsHeader from 'modules/markets/components/markets-header/markets-header'
import MarketsList from 'modules/markets/components/markets-list'

import getValue from 'utils/get-value'
import parseQuery from 'modules/routes/helpers/parse-query'
import isEqual from 'lodash/isEqual'

import parsePath from 'modules/routes/helpers/parse-path'
import makePath from 'modules/routes/helpers/make-path'

import { FAVORITES, MARKETS } from 'modules/routes/constants/views'
import { TOPIC_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { TYPE_TRADE } from 'modules/market/constants/link-types'

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
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

  constructor(props) {
    super(props)

    console.log('allMarkets -- ', props.markets)

    this.state = {
      filteredMarkets: []
    }
  }

  componentWillMount() {
    this.loadMarkets({
      canLoadMarkets: this.props.canLoadMarkets, // TODO -- change to just `isConnected`, which is clearer as to whether it can be called or not
      location: this.props.location,
      hasLoadedTopic: this.props.hasLoadedTopic,
      hasLoadedMarkets: this.props.hasLoadedMarkets,
      loadMarkets: this.props.loadMarkets,
      loadMarketsByTopic: this.props.loadMarketsByTopic
    })
  }

  componentWillReceiveProps(nextProps) {
    if (
      (this.props.canLoadMarkets !== nextProps.canLoadMarkets && nextProps.canLoadMarkets) ||
      this.props.location !== nextProps.location ||
      this.props.hasLoadedTopic !== nextProps.hasLoadedTopic ||
      (this.props.hasLoadedMarkets !== nextProps.hasLoadedMarkets && !nextProps.hasLoadedMarkets)
    ) {
      this.loadMarkets({
        canLoadMarkets: nextProps.canLoadMarkets,
        location: nextProps.location,
        hasLoadedTopic: nextProps.hasLoadedTopic,
        hasLoadedMarkets: nextProps.hasLoadedMarkets,
        loadMarkets: nextProps.loadMarkets,
        loadMarketsByTopic: nextProps.loadMarketsByTopic
      })
    }

    if (
      getValue(this.props, 'loginAccount.rep.value') !== getValue(nextProps, 'loginAccount.rep.value') ||
      getValue(this.props, 'universe.id') !== getValue(nextProps, 'universe.id')
    ) {
      this.setState({
        canDisplayUniverseInfo: !!(getValue(nextProps, 'loginAccount.rep.value') && getValue(nextProps, 'universe.id'))
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(this.state.markets, nextState.markets)) {
      this.props.updateMarketsFilteredSorted(nextState.markets)
      checkFavoriteMarketsCount(nextState.markets, nextProps.location, nextProps.history)
    }
  }

  componentWillUnmount() {
    this.props.clearMarketsFilteredSorted()
  }

  loadMarkets(options) {
    if (options.canLoadMarkets) {
      const topic = parseQuery(options.location.search)[TOPIC_PARAM_NAME]

      if (topic && !this.props.hasLoadedTopic[topic]) {
        options.loadMarketsByTopic(topic)
      } else if (!topic && !this.props.hasLoadedMarkets) {
        options.loadMarkets()
      }
    }
  }

  render() {
    const p = this.props
    const s = this.state

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

function checkFavoriteMarketsCount(filteredMarkets, location, history) {
  const path = parsePath(location.pathname)[0]

  if (path === FAVORITES && !filteredMarkets.length) {
    history.push(makePath(MARKETS))
  }
}
