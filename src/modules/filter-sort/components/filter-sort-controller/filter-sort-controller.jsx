import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

// import FilterMarketState from 'modules/filter-sort/components/filter-market-state/filter-market-state'
import SortMarketParam from 'modules/filter-sort/containers/sort-market-param'

import filterByMarketFavorites from 'modules/filter-sort/helpers/filter-by-market-favorites'
import filterByTags from 'modules/filter-sort/helpers/filter-by-tags'
import filterBySearch from 'modules/filter-sort/helpers/filter-by-search'
import filterByMarketState from 'modules/filter-sort/helpers/filter-by-market-state'
import sortByMarketParam from 'modules/filter-sort/helpers/sort-by-market-param'

import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'
import isArray from 'utils/is-array'
import isObject from 'utils/is-object'

import * as PARAMS from 'modules/filter-sort/constants/param-names'
import { SORT_MARKET_PARAM } from 'modules/filter-sort/constants/param-names'

export default class FilterSortController extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateFilteredItems: PropTypes.func.isRequired,
    currentReportingPeriod: PropTypes.number,
    //  Optional Configuration
    searchKeys: PropTypes.array,
    marketSort: PropTypes.bool
    // filterByTags: PropTypes.bool,
    // filterByMarketFavorites: PropTypes.bool,
    // filterByMarketState: PropTypes.bool,
    // sortByMarketParam: PropTypes.bool,
    // searchPlaceholder: PropTypes.string,
    // filterBySearch: PropTypes.bool
  }

  constructor(props) {
    super(props)

    // NOTE -- any filter or sort that is `null` will be ignored when combining arrays
    this.state = {
      // Filters
      results: {},
      // Aggregated Items
      combinedFiltered: null,
      // Sorted Items
      marketParamItems: null,
      // ReRender
      reRender: new Date().now
    }

    this.injectChild = this.injectChild.bind(this)
    this.updateIndices = this.updateIndices.bind(this)
  }

  componentWillMount() {
    this.props.updateFilteredItems(this.props.items.map((_, i) => i)) // Initialize indices

    // this.updateCombinedFilters({
    //   filters: {
    //     searchItems: this.state.searchItems,
    //     marketStateItems: this.state.marketStateItems,
    //     // marketTagItems: this.state.marketTagItems,
    //     // marketFavoriteItems: this.state.marketFavoriteItems
    //   },
    //   items: this.props.items
    // })
    //
    // if (this.props.filterByTags) this.setState({ marketTagItems: filterByTags(this.props.location, this.props.items) })
    // if (this.props.filterByMarketFavorites) this.setState({ marketFavoriteItems: filterByMarketFavorites(this.props.items) })
  }

  componentWillReceiveProps(nextProps) {
    // const itemsChanged = !isEqual(this.props.items, nextProps.items)
    //
    // if (
    //   itemsChanged ||
    //   !isEqual(this.props.location.search, nextProps.location.search)
    // ) {
    //   // Check respective filters/sorts for changes + update accordingly
    //   const oldSearch = parseQuery(this.props.location.search)
    //   const newSearch = parseQuery(nextProps.location.search)
    //
    //   if (
    //     itemsChanged ||
    //     !isEqual(oldSearch[PARAMS.FILTER_SEARCH_PARAM], newSearch[PARAMS.FILTER_SEARCH_PARAM])
    //   ) {
    //     this.setState({
    //       searchItems: filterBySearch(newSearch[PARAMS.FILTER_SEARCH_PARAM], nextProps.searchKeys, nextProps.items)
    //     })
    //   }
    //
    //   if (
    //     itemsChanged ||
    //     !isEqual(oldSearch[PARAMS.FILTER_MARKET_STATE_PARAM], newSearch[PARAMS.FILTER_MARKET_STATE_PARAM])
    //   ) {
    //     this.setState({
    //       marketStateItems: filterByMarketState(newSearch[PARAMS.FILTER_MARKET_STATE_PARAM], nextProps.currentReportingPeriod, nextProps.items)
    //     })
    //   }
    //
    //   if (
    //     itemsChanged ||
    //     !isEqual(oldSearch[PARAMS.FILTER_SEARCH_PARAM], newSearch[PARAMS.FILTER_SEARCH_PARAM]) ||
    //     !isEqual(oldSearch[PARAMS.SORT_MARKET_PARAM], newSearch[PARAMS.SORT_MARKET_PARAM]) ||
    //     !isEqual(oldSearch[PARAMS.SORT_MARKET_ORDER_PARAM], newSearch[PARAMS.SORT_MARKET_ORDER_PARAM])
    //   ) {
    //     this.setState({
    //       marketParamItems: sortByMarketParam(newSearch[PARAMS.SORT_MARKET_PARAM], newSearch[PARAMS.SORT_MARKET_ORDER_PARAM], nextProps.items, this.state.combinedFiltered)
    //     })
    //   }
    // }
    // if (
    //   nextProps.filterByTags &&
    //   (
    //     !isEqual(this.props.items, nextProps.items) ||
    //     !isEqual(this.props.location.search, nextProps.location.search)
    //   )
    // ) {
    //   this.setState({ marketTagItems: filterByTags(nextProps.location, nextProps.items) })
    // }
    //
    // if (
    //   nextProps.filterByMarketFavorites &&
    //   (
    //     !isEqual(this.props.items, nextProps.items) ||
    //     !isEqual(this.props.location.search, nextProps.location.search)
    //   )
    // ) {
    //   this.setState({ marketFavoriteItems: filterByMarketFavorites(nextProps.items) })
    // }
  }

  componentWillUpdate(nextProps, nextState) {
    // console.log('componentWillUpdate -- ', nextState)

    if (
      !isEqual(this.props.items, nextProps.items) ||
      !isEqual(this.state.results, nextState.results)
    ) {
      this.updateCombinedFilters(nextProps.items, nextState.results)
    }

    if (!isEqual(this.state.combinedFiltered, nextState.combinedFiltered)) {
      console.log('now -- ', nextState.reRender, new Date().now)
      this.setState({
        reRender: new Date().now
      })
    }

    // if (
    //   !isEqual(this.state.searchItems, nextState.searchItems) ||
    //   !isEqual(this.state.marketStateItems, nextState.marketStateItems) ||
    //   // !isEqual(this.state.marketTagItems, nextState.marketTagItems) ||
    //   // !isEqual(this.state.marketFavoriteItems, nextState.marketFavoriteItems) ||
    //   !isEqual(this.props.items, nextProps.items)
    // ) {
    //   this.updateCombinedFilters({
    //     filters: {
    //       searchItems: nextState.searchItems,
    //       marketStateItems: nextState.marketStateItems,
    //       // marketTagItems: nextState.marketTagItems,
    //       // marketFavoriteItems: nextState.marketFavoriteItems
    //     },
    //     items: nextProps.items
    //   })
    // }
    //
    // if (
    //   !isEqual(this.state.marketParamItems, nextState.marketParamItems) ||
    //   !isEqual(this.state.combinedFiltered, nextState.combinedFiltered)
    // ) {
    //   this.updateSortedFiltered({
    //     sorts: {
    //       marketParamItems: nextState.marketParamItems
    //     },
    //     combinedFiltered: nextState.combinedFiltered
    //   })
    // }

    // if (!isEqual(this.state.filtersSorts, nextState.filtersSorts))
  }

  updateCombinedFilters(items, results) {
    const combinedFiltered = Object.keys(results).reduce((p, filterType) => {
      if (filterType === SORT_MARKET_PARAM) return p // Don't include sorted array
      if (p.length === 0 || (results[filterType] !== null && results[filterType].length === 0)) return []
      if (results[filterType] === null) return p

      return results[filterType].filter(item => p.includes(item))
    }, items.map((_, i) => i))

    this.updateSortedFiltered(
      results[SORT_MARKET_PARAM] || null,
      combinedFiltered
    )

    this.setState({
      combinedFiltered
    })
  }

  updateSortedFiltered(rawSorted, combined) { // If we want to accomodate more than one sorting mechanism across a filtered list, we'll need to re-architect things a bit
    // console.log('options -- ', rawSorted, combined)

    this.props.updateFilteredItems(rawSorted !== null ?
      rawSorted.reduce((p, itemIndex) => {
        if (combined.indexOf(itemIndex) !== -1) return [...p, combined.indexOf(itemIndex)]
        return p
      }, []) :
      combined
    )

    // this.props.updateFilteredItems(options.sorts.marketParamItems !== null ? options.sorts.marketParamItems : options.combinedFiltered)
  }


  updateIndices(options) {
    this.setState({
      results: {
        ...this.state.results,
        [options.type]: options.indices
      }
    })
  }

  injectChild(children) {
    // NOTE --  keep an eye on this...might be a performance bottleneck if goes too deep
    //          Ideally the children of the controller are fairly shallow
    //          This method name also sounds terrible

    const traverseChildren = child => React.Children.map(child, (subChild) => {
      let subChildProps = {}

      const name = getValue(subChild, 'type.displayName')

      if (React.isValidElement(subChild)) {
        if (
          name &&
          (
            name.toLowerCase().indexOf('filter') !== -1 ||
            name.toLowerCase().indexOf('sort') !== -1
          )
        ) {
          subChildProps = {
            updateIndices: this.updateIndices,
            items: this.props.items
          }
        }

        if (
          name &&
          name.indexOf('SortMarketParam') !== -1
        ) {
          subChildProps = {
            ...subChildProps,
            combinedFiltered: this.state.combinedFiltered
          }
        }
      }
      if (subChild.props) {
        if (getValue(subChild, 'props.children')) {
          subChildProps.children = traverseChildren(subChild.props.children)
        }
        return React.cloneElement(subChild, subChildProps)
      }
      return subChild
    })

    return React.Children.map(children, traverseChildren)
  }

  render() {
    return (
      <section
        key={this.state.reRender}
      >
        {this.injectChild(this.props.children)}
      </section>
    )
  }
}

// <article className={Styles.FilterSort}>
//   {((!!p.filterByMarketState && !!p.currentReportingPeriod) || !!p.sortByMarketParam) &&
//     <div className={Styles.FilterSort__wrapper}>
//       {!!p.sortByMarketParam &&
//         <SortMarketParam
//           location={p.location}
//           history={p.history}
//           items={p.items}
//           combinedFiltered={this.state.combinedFiltered}
//           updateSort={marketParamItems => this.setState({ marketParamItems })}
//         />
//       }
//       {!!p.filterByMarketState && !!p.currentReportingPeriod &&
//         <FilterMarketState
//           location={p.location}
//           history={p.history}
//           items={p.items}
//           currentReportingPeriod={p.currentReportingPeriod}
//           updateFilter={marketStateItems => this.setState({ marketStateItems })}
//         />
//       }
//     </div>
//   }
//
//   {!!p.filterBySearch &&
//     <div className={Styles.FilterSort__wrapper}>
//       <FilterSearch
//         location={p.location}
//         history={p.history}
//         items={p.items}
//         keys={p.searchKeys}
//         searchPlaceholder={p.searchPlaceholder}
//         updateFilter={searchItems => this.setState({ searchItems })}
//       />
//     </div>
//   }
//
// </article>
