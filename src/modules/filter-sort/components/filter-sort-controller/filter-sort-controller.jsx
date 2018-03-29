import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

import filterByTags from 'modules/filter-sort/helpers/filter-by-tags'
import filterByCategory from 'modules/filter-sort/helpers/filter-by-category'
import parseStringToArray from 'modules/routes/helpers/parse-string-to-array'
import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'

import { SORT_MARKET_PARAM, TAGS_PARAM_NAME, CATEGORY_PARAM_NAME } from 'modules/filter-sort/constants/param-names'
import { QUERY_VALUE_DELIMITER } from 'modules/routes/constants/query-value-delimiter'

export default class FilterSortController extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateFilteredItems: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    // NOTE -- any filter or sort that is `null` will be ignored when combining arrays
    this.state = {
      // Filters are dynamically added
      // Aggregated Items
      combinedFiltered: null,
      // Children Components
      children: null,
    }

    this.injectChildren = this.injectChildren.bind(this)
    this.updateIndices = this.updateIndices.bind(this)
    this.callFilterByCategory = this.callFilterByCategory.bind(this)
    this.callFilterByTags = this.callFilterByTags.bind(this)
  }

  componentWillMount() {
    const {
      children,
      items,
      location,
      updateFilteredItems,
    } = this.props
    updateFilteredItems(items.map((_, i) => i)) // Initialize indices

    this.injectChildren(children, this.state.combinedFiltered)

    const search = parseQuery(location.search)
    this.callFilterByCategory(search, items)
    this.callFilterByTags(search, items)
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      items,
      location,
    } = this.props
    const oldResults = Object.keys(this.state).filter(key => key.indexOf('filter-sort-results--') !== -1).reduce((p, key) => ({ ...p, [key]: this.state[key] }), {})
    const newResults = Object.keys(nextState).filter(key => key.indexOf('filter-sort-results--') !== -1).reduce((p, key) => ({ ...p, [key]: nextState[key] }), {})

    if (
      !isEqual(items, nextProps.items) ||
      !isEqual(oldResults, newResults)
    ) {
      this.updateCombinedFilters(nextProps.items, newResults)
    }

    if (
      !isEqual(items, nextProps.items) ||
      !isEqual(this.state.combinedFiltered, nextState.combinedFiltered)
    ) {
      this.injectChildren(nextProps.children, nextState.combinedFiltered)
    }

    // Helper Function Filters ONLY via query string params (no components directly associated with filter/sort)
    const oldSearch = parseQuery(location.search)
    const newSearch = parseQuery(nextProps.location.search)

    // Catgories
    if (
      !isEqual(items, nextProps.items) ||
      !isEqual(oldSearch[CATEGORY_PARAM_NAME], newSearch[CATEGORY_PARAM_NAME])
    ) {
      this.callFilterByCategory(newSearch, nextProps.items)
    }

    // Tags
    if (
      !isEqual(items, nextProps.items) ||
      !isEqual(oldSearch[TAGS_PARAM_NAME], newSearch[TAGS_PARAM_NAME])
    ) {
      this.callFilterByTags(newSearch, nextProps.items)
    }
  }

  callFilterByCategory(query, items) {
    const category = query[CATEGORY_PARAM_NAME] != null ? decodeURIComponent(query[CATEGORY_PARAM_NAME]) : null

    this.updateIndices({
      type: CATEGORY_PARAM_NAME,
      indices: filterByCategory(category, items),
    })
  }

  callFilterByTags(query, items) {
    const tagsArray = parseStringToArray(decodeURIComponent(query[TAGS_PARAM_NAME] || ''), QUERY_VALUE_DELIMITER)

    this.updateIndices({
      type: TAGS_PARAM_NAME,
      indices: filterByTags(tagsArray, items),
    })
  }

  updateCombinedFilters(items, results) {
    const combinedFiltered = Object.keys(results).reduce((p, filterType) => {
      if (filterType === `filter-sort-results--${SORT_MARKET_PARAM}`) return p // Don't include sorted array
      if (p.length === 0 || (results[filterType] !== null && results[filterType].length === 0)) return []
      if (results[filterType] === null) return p

      return results[filterType].filter(item => p.includes(item))
    }, items.map((_, i) => i))

    this.updateSortedFiltered(
      results[`filter-sort-results--${SORT_MARKET_PARAM}`] || null,
      combinedFiltered,
    )

    this.setState({
      combinedFiltered,
    })
  }

  updateSortedFiltered(rawSorted, combined) {
    const { updateFilteredItems } = this.props// If we want to accomodate more than one sorting mechanism across a filtered list, we'll need to re-architect things a bit
    updateFilteredItems(rawSorted !== null ?
      (rawSorted || []).filter(itemIndex => combined.indexOf(itemIndex) !== -1) :
      combined)
  }


  updateIndices(options) {
    this.setState({
      [`filter-sort-results--${options.type}`]: options.indices, // NOTE -- done this way to prevent race conditions since multiple filters/sorts could call this method simultaneously
    })
  }

  injectChildren(children, combinedFiltered) {
    const { items } = this.props
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
            items,
          }
        }

        if (
          name &&
          name.indexOf('SortMarketParam') !== -1
        ) {
          subChildProps = {
            ...subChildProps,
            combinedFiltered,
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

    const updatedChildren = React.Children.map(children, traverseChildren)

    this.setState({
      children: updatedChildren,
    })
  }

  render() {
    return (
      <section>
        {this.state.children}
      </section>
    )
  }
}
