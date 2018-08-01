import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import MarketsHeader from 'modules/markets/components/markets-header/markets-header'
import MarketsList from 'modules/markets/components/markets-list'
import isEqual from 'lodash/isEqual'
import { TYPE_TRADE } from 'modules/market/constants/link-types'
import { filterArrayByArrayPredicate } from 'src/modules/filter-sort/helpers/filter-array-of-objects-by-array'
import { filterBySearch } from 'src/modules/filter-sort/helpers/filter-by-search'
import { FILTER_SEARCH_KEYS } from 'src/modules/markets/constants/filter-sort'
import { identity, filter, map } from 'lodash/fp'
import { compose } from 'redux'
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
    category: PropTypes.string,
    hasLoadedSearch: PropTypes.object.isRequired,
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
    loadMarketsByFilter: PropTypes.func.isRequired,
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
    const {
      canLoadMarkets,
      category,
      hasLoadedSearch,
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
      hasLoadedSearch,
    })
    this.updateFilteredMarkets()
  }

  componentDidUpdate(prevProps) {
    const {
      canLoadMarkets,
      category,
      hasLoadedSearch,
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

      !isEqual(hasLoadedSearch, prevProps.hasLoadedSearch) ||
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
        hasLoadedSearch,
        tags,
        keywords,
      })
    }
  }

  updateFilter(params) {
    const { filter, sort } = params
    this.setState({ filter, sort }, this.updateFilteredMarkets)
  }

  updateFilteredMarkets() {
    const { filter, sort } = this.state
    this.props.loadMarketsByFilter({ filter, sort }, (err, filterSortedMarkets) => {
      if (err) return console.log('Error loadMarketsFilter:', err)
      this.setState({ filterSortedMarkets })
    })
  }

  render() {
    const {
      category,
      keywords,
      tags,
      history,
      isLogged,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      location,
      markets,
      toggleFavorite,
    } = this.props
    const s = this.state
    const categoryFilter = category ? filter(m => (m.category || '').toLowerCase() === category.toLowerCase()) : identity
    // The filterBySearch function returns ids not objects.
    const keywordFilter = keywords ? filterBySearch(keywords, FILTER_SEARCH_KEYS) : map('id')
    const tagFilterPredicate = filterArrayByArrayPredicate('tags', tags)
    // filter by category
    const filteredMarkets = compose(
      keywordFilter,
      filter(tagFilterPredicate),
      categoryFilter,
    )(markets)
    const filteredMarketsFinal = []
    if (s.filterSortedMarkets.length) {
      s.filterSortedMarkets.reduce((finalArray, marketId) => {
        if (filteredMarkets.includes(marketId)) {
          finalArray.push(marketId)
        }
        return finalArray
      }, filteredMarketsFinal)
    }

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
          filteredMarkets={filteredMarketsFinal}
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

function loadMarketsFn({ canLoadMarkets, category, hasLoadedSearch, loadMarketsByCategory, loadMarketsBySearch, loadMarkets, tags, keywords }) {
  if (canLoadMarkets) {
    if (category && !hasLoadedSearch[category]) {
      loadMarketsByCategory(category)
    } else if (tags && tags.length > 0) {
      if (tags[0] && !hasLoadedSearch[tags[0]]) {
        loadMarketsBySearch(tags[0], tags[0])
      }
      if (tags[1] && !hasLoadedSearch[tags[1]]) {
        loadMarketsBySearch(tags[1], tags[1])
      }
    } else if (keywords && keywords.length > 3 && !hasLoadedSearch.keywords) {
      loadMarketsBySearch(keywords, 'keywords')
    }
  }
}
