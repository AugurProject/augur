import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FilterSort from 'modules/filter-sort/containers/filter-sort-controller'
import FilterSearch from 'modules/filter-sort/containers/filter-search'
import FilterMarketState from 'modules/filter-sort/containers/filter-market-state'

import parseQuery from 'modules/routes/helpers/parse-query'
import parsePath from 'modules/routes/helpers/parse-path'

import { MARKETS, FAVORITES } from 'modules/routes/constants/views'
import { TOPIC_PARAM_NAME } from 'modules/filter-sort/constants/param-names'

import Styles from 'modules/markets/components/markets-header/markets-header.styles'

export default class MarketsHeader extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    updateFilteredItems: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      headerTitle: null,
      capitalizeTitle: false,
      filterByMarketFavorites: false
    }

    this.searchKeys = [
      'description',
      ['outcomes', 'name'],
      ['tags', 'name']
    ]

    this.setHeaderTitle = this.setHeaderTitle.bind(this)
    this.setPathDependentFilters = this.setPathDependentFilters.bind(this)
  }

  componentWillMount() {
    this.setHeaderTitle(this.props.location)
    this.setPathDependentFilters(this.props.location)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.setHeaderTitle(nextProps.location)
      this.setPathDependentFilters(nextProps.location)
    }
  }

  setHeaderTitle(location) {
    const searchParams = parseQuery(location.search)

    if (searchParams[TOPIC_PARAM_NAME]) {
      this.setState({
        headerTitle: searchParams[TOPIC_PARAM_NAME],
        capitalizeTitle: false
      })
    } else {
      const path = parsePath(location.pathname)

      if (path[0] === MARKETS) {
        this.setState({
          headerTitle: path[0],
          capitalizeTitle: true
        })
      }
    }
  }

  setPathDependentFilters(location) {
    const path = parsePath(location.pathname)[0]

    const filterByMarketFavorites = path === FAVORITES
    this.setState({ filterByMarketFavorites })
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <article className={Styles.MarketsHeader}>
        <FilterSort
          items={p.markets}
          updateFilteredItems={p.updateFilteredItems}
          searchKeys={this.searchKeys}
        />
        <div className={Styles.MarketsHeader__search}>
          <FilterSearch
            searchPlaceholder="Search"
          />
        </div>
        <div className={Styles.MarketsHeader__wrapper}>
          <h1 className={Styles.MarketsHeader__heading}>{s.headerTitle}</h1>
          <FilterMarketState />
        </div>
      </article>
    )
  }
}

// <FilterSort
//   items={p.markets}
//   updateFilteredItems={p.updateFilteredItems}
//   filterByMarketFavorites={s.filterByMarketFavorites}
//   searchPlaceholder="Search"
//   searchKeys={this.searchKeys}
//   filterBySearch
//   filterByTags
// />
