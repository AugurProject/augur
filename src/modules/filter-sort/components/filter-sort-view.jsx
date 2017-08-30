import React, { Component } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'

import FilterMarketState from 'modules/filter-sort/components/filter-market-state'
import SortMarketParam from 'modules/filter-sort/components/sort-market-param'
import FilterSearch from 'modules/filter-sort/components/filter-search'

import filterByMarketFavorites from 'modules/filter-sort/helpers/filter-by-market-favorites'
import filterByTags from 'modules/filter-sort/helpers/filter-by-tags'

export default class FilterSortView extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateFilteredItems: PropTypes.func.isRequired,
    currentReportingPeriod: PropTypes.number,
    //  Optional Filters + Sorts
    filterByTags: PropTypes.bool,
    filterByMarketFavorites: PropTypes.bool,
    filterByMarketState: PropTypes.bool,
    sortByMarketParam: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    searchKeys: PropTypes.array,
    filterBySearch: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      // Filters
      searchItems: null,
      marketStateItems: null,
      marketTagItems: null,
      marketFavoriteItems: null,
      // Sorts
      marketParamItems: null,
      // Aggregated
      combinedFiltered: null
    }
  }

  componentWillMount() {
    this.props.updateFilteredItems(this.props.items.map((_, i) => i)) // Initialize List

    this.updateCombinedFilters({
      filters: {
        searchItems: this.state.searchItems,
        marketStateItems: this.state.marketStateItems,
        marketTagItems: this.state.marketTagItems,
        marketFavoriteItems: this.state.marketFavoriteItems
      },
      items: this.props.items
    })

    if (this.props.filterByTags) this.setState({ marketTagItems: filterByTags(this.props.location, this.props.items) })
    if (this.props.filterByMarketFavorites) this.setState({ marketFavoriteItems: filterByMarketFavorites(this.props.items) })
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.filterByTags &&
      (
        !isEqual(this.props.items, nextProps.items) ||
        !isEqual(this.props.location.search, nextProps.location.search)
      )
    ) {
      this.setState({ marketTagItems: filterByTags(nextProps.location, nextProps.items) })
    }

    if (
      nextProps.filterByMarketFavorites &&
      (
        !isEqual(this.props.items, nextProps.items) ||
        !isEqual(this.props.location.search, nextProps.location.search)
      )
    ) {
      this.setState({ marketFavoriteItems: filterByMarketFavorites(nextProps.items) })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.state.searchItems, nextState.searchItems) ||
      !isEqual(this.state.marketStateItems, nextState.marketStateItems) ||
      !isEqual(this.state.marketTagItems, nextState.marketTagItems) ||
      !isEqual(this.state.marketFavoriteItems, nextState.marketFavoriteItems) ||
      !isEqual(this.props.items, nextProps.items)
    ) {
      this.updateCombinedFilters({
        filters: {
          searchItems: nextState.searchItems,
          marketStateItems: nextState.marketStateItems,
          marketTagItems: nextState.marketTagItems,
          marketFavoriteItems: nextState.marketFavoriteItems
        },
        items: nextProps.items
      })
    }

    if (
      !isEqual(this.state.marketParamItems, nextState.marketParamItems) ||
      !isEqual(this.state.combinedFiltered, nextState.combinedFiltered)
    ) {
      this.updateSortedFiltered({
        sorts: {
          marketParamItems: nextState.marketParamItems
        },
        combinedFiltered: nextState.combinedFiltered
      })
    }
  }

  updateCombinedFilters(options) {
    const combinedFiltered = Object.keys(options.filters).reduce((p, filterType) => {
      if (p.length === 0 || (options.filters[filterType] !== null && options.filters[filterType].length === 0)) return []
      if (options.filters[filterType] === null) return p

      return options.filters[filterType].filter(item => p.includes(item))
    }, options.items.map((_, i) => i))

    this.setState({ combinedFiltered })
  }

  updateSortedFiltered(options) { // If we want to accomodate more than one sorting mechanism across a filtered list, we'll need to re-architect things a bit
    this.props.updateFilteredItems(options.sorts.marketParamItems !== null ? options.sorts.marketParamItems : options.combinedFiltered)
  }

  render() {
    const p = this.props

    return (
      <article className="view-header filter-sort">
        {((!!p.filterByMarketState && !!p.currentReportingPeriod) || !!p.sortByMarketParam) &&
          <div className="view-header-group">
            {!!p.filterByMarketState && !!p.currentReportingPeriod &&
              <FilterMarketState
                location={p.location}
                history={p.history}
                items={p.items}
                currentReportingPeriod={p.currentReportingPeriod}
                updateFilter={marketStateItems => this.setState({ marketStateItems })}
              />
            }
            {!!p.sortByMarketParam &&
              <SortMarketParam
                location={p.location}
                history={p.history}
                items={p.items}
                combinedFiltered={this.state.combinedFiltered}
                updateSort={marketParamItems => this.setState({ marketParamItems })}
              />
            }
          </div>
        }
        <div className="view-header-group">
          {!!p.filterBySearch &&
            <FilterSearch
              location={p.location}
              history={p.history}
              items={p.items}
              keys={p.searchKeys}
              searchPlaceholder={p.searchPlaceholder}
              updateFilter={searchItems => this.setState({ searchItems })}
            />
          }
        </div>
      </article>
    )
  }
}
