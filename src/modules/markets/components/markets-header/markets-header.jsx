import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import FilterSort from 'modules/filter-sort/containers/filter-sort-controller'
import FilterSearch from 'modules/filter-sort/containers/filter-search'
// import FilterMarketState from 'modules/filter-sort/containers/filter-market-state'
// import SortMarketParam from 'modules/filter-sort/containers/sort-market-param'

import parseQuery from 'modules/routes/helpers/parse-query'
import parsePath from 'modules/routes/helpers/parse-path'

import { MARKETS } from 'modules/routes/constants/views'
import { CATEGORY_PARAM_NAME } from 'modules/filter-sort/constants/param-names'

import Styles from 'modules/markets/components/markets-header/markets-header.styles'

// NOTE -- commented out state due to temp lack of utilization + linting
export default class MarketsHeader extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    // updateFilteredItems: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      headerTitle: null,
      // capitalizeTitle: false,
      // filterByMarketFavorites: false
    }

    this.setHeaderTitle = this.setHeaderTitle.bind(this)
    // this.setPathDependentFilters = this.setPathDependentFilters.bind(this)
  }

  componentWillMount() {
    const { location } = this.props
    this.setHeaderTitle(location)
    // this.setPathDependentFilters(this.props.location)
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props
    if (location !== nextProps.location) {
      this.setHeaderTitle(nextProps.location)
      // this.setPathDependentFilters(nextProps.location)
    }
  }

  setHeaderTitle(location) {
    const searchParams = parseQuery(location.search)

    if (searchParams[CATEGORY_PARAM_NAME]) {
      this.setState({
        headerTitle: searchParams[CATEGORY_PARAM_NAME],
        // capitalizeTitle: false
      })
    } else {
      const path = parsePath(location.pathname)

      if (path[0] === MARKETS) {
        this.setState({
          headerTitle: path[0],
          // capitalizeTitle: true
        })
      }
    }
  }

  render() {
    // const p = this.props
    const s = this.state

    return (
      <article className={Styles.MarketsHeader}>
        <div className={Styles.MarketsHeader__search} >
          <FilterSearch
            searchPlaceholder="Search"
          />
        </div>
        <div className={Styles.MarketsHeader__wrapper}>
          <h1 className={Styles.MarketsHeader__heading}>{s.headerTitle}</h1>
          <div className={Styles.MarketsHeader__filters} />
        </div>
      </article>
    )
  }
}
// <SortMarketParam />
//
// <FilterMarketState />
