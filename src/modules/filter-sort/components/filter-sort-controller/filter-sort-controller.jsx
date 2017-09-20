import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'
import isArray from 'utils/is-array'
import isObject from 'utils/is-object'

import { SORT_MARKET_PARAM } from 'modules/filter-sort/constants/param-names'

export default class FilterSortController extends Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateFilteredItems: PropTypes.func.isRequired
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
      // Children Components
      children: null
    }

    this.injectChildren = this.injectChildren.bind(this)
    this.updateIndices = this.updateIndices.bind(this)
  }

  componentWillMount() {
    this.props.updateFilteredItems(this.props.items.map((_, i) => i)) // Initialize indices

    this.injectChildren(this.props.children, this.state.combinedFiltered)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.items, nextProps.items) ||
      !isEqual(this.state.results, nextState.results)
    ) {
      this.updateCombinedFilters(nextProps.items, nextState.results)
    }

    if (!isEqual(this.state.combinedFiltered, nextState.combinedFiltered)) {
      this.injectChildren(nextProps.children, nextState.combinedFiltered)
    }
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
    this.props.updateFilteredItems(rawSorted !== null ?
      rawSorted.reduce((p, itemIndex) => {
        if (combined.indexOf(itemIndex) !== -1) return [...p, combined.indexOf(itemIndex)]
        return p
      }, []) :
      combined
    )
  }


  updateIndices(options) {
    this.setState({
      results: {
        ...this.state.results,
        [options.type]: options.indices
      }
    })
  }

  injectChildren(children, combinedFiltered) {
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
            combinedFiltered
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
      children: updatedChildren
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
