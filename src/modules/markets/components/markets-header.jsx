import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import FilterSort from 'modules/filter-sort/container'
import classNames from 'classnames'

import makePath from 'modules/app/helpers/make-path'

import parseQuery from 'modules/app/helpers/parse-query'
import parsePath from 'modules/app/helpers/parse-path'

import { CREATE_MARKET, MARKETS, FAVORITES } from 'modules/app/constants/views'
import { TOPIC_PARAM_NAME } from 'modules/app/constants/param-names'

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
      <article>
        <div className="view-header markets-header">
          <div className="view-header-group">
            <h2 className={classNames({ capitalized: s.capitalizeTitle })}>
              {s.headerTitle}
            </h2>
          </div>
          <div className="view-header-group">
            {p.isLogged &&
              <Link
                to={makePath(CREATE_MARKET)}
                className="button imperative navigational"
                disabled={!p.isLogged}
              >
                + Create New Market
              </Link>
            }
          </div>
        </div>
        <FilterSort
          items={p.markets}
          updateFilteredItems={p.updateFilteredItems}
          filterByMarketFavorites={s.filterByMarketFavorites}
          searchPlaceholder="Search Markets"
          searchKeys={this.searchKeys}
          filterBySearch
          filterByMarketState
          sortByMarketParam
          filterByTags
        />
      </article>
    )
  }
}
