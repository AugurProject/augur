import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsHeader from 'modules/markets/components/markets-header/markets-header'
import MarketsList from 'modules/markets/components/markets-list'
import { TYPE_TRADE } from 'modules/market/constants/link-types'
import {
  MARKET_RECENTLY_TRADED,
} from 'modules/filter-sort/constants/market-sort-params'
import {
  MARKET_OPEN,
} from 'modules/filter-sort/constants/market-states'

export default class MarketsView extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    loginAccount: PropTypes.object.isRequired,
    markets: PropTypes.array.isRequired,
    canLoadMarkets: PropTypes.bool.isRequired,
    hasLoadedMarkets: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    loadMarketsInfoIfNotLoaded: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    loadMarketsByFilter: PropTypes.func.isRequired,
    search: PropTypes.string,
    category: PropTypes.string,
  }

  constructor(props) {
    super(props)

    this.state = {
      filter: MARKET_OPEN,
      sort: MARKET_RECENTLY_TRADED,
      filterSortedMarkets: [],
    }

    this.updateFilter = this.updateFilter.bind(this)
    this.updateFilteredMarkets = this.updateFilteredMarkets.bind(this)
  }

  componentDidMount() {
    this.updateFilteredMarkets()
  }

  componentDidUpdate(prevProps) {
    const {
      search,
      category,
    } = this.props
    if (search !== prevProps.search || category !== prevProps.category) {
      this.updateFilteredMarkets()
    }
  }

  updateFilter(params) {
    const { filter, sort } = params
    this.setState({ filter, sort }, this.updateFilteredMarkets)
  }

  updateFilteredMarkets() {
    const { search, category } = this.props
    const { filter, sort } = this.state
    this.props.loadMarketsByFilter({ category, search, filter, sort }, (err, filterSortedMarkets) => {
      if (err) return console.log('Error loadMarketsFilter:', err)
      this.setState({ filterSortedMarkets })
    })
  }

  render() {
    const {
      history,
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      location,
      markets,
      toggleFavorite,
    } = this.props
    const s = this.state

    return (
      <section id="markets_view">
        <Helmet>
          <title>Markets</title>
        </Helmet>
        <MarketsHeader
          isLogged={isLogged}
          location={location}
          markets={markets}
          filter={s.filter}
          sort={s.sort}
          updateFilter={this.updateFilter}
        />
        <MarketsList
          testid="markets"
          isLogged={isLogged}
          markets={markets}
          filteredMarkets={s.filterSortedMarkets}
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
