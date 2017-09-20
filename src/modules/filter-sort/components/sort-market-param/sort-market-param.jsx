import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'

import { SORT_MARKET_PARAM, SORT_MARKET_ORDER_PARAM } from 'modules/filter-sort/constants/param-names'

import Styles from 'modules/filter-sort/components/sort-market-param/sort-market-param.styles'

export class SortMarketParam extends Component { // NOTE -- intentionally excluded `default` for enforced function name comparison
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.defaultMarketParam = 'volume'
    this.defaultSort = true // true = descending, false = ascending

    this.marketSortParams = [
      {
        label: 'Volume',
        value: 'volume'
      },
      {
        label: 'Newest',
        value: 'creationTime'
      },
      {
        label: 'Expiration',
        value: 'endDate'
      },
      {
        label: 'Taker Fee',
        value: 'takerFeePercent'
      },
      {
        label: 'Maker Fee',
        value: 'makerFeePercent'
      }
    ]

    this.state = {
      selectedMarketParam: this.defaultMarketParam,
      selectedSort: this.defaultSort
    }
  }

  componentWillMount() {
    const queryParams = parseQuery(this.props.location.search)

    const selectedMarketParam = queryParams[SORT_MARKET_PARAM]
    if (selectedMarketParam) this.setState({ selectedMarketParam })

    const selectedSort = queryParams[SORT_MARKET_ORDER_PARAM]
    if (selectedSort) this.setState({ selectedSort: selectedSort !== 'false' })
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.selectedMarketParam !== nextState.selectedMarketParam ||
      this.state.selectedSort !== nextState.selectedSort
    ) {
      this.updateQuery(nextState.selectedMarketParam, nextState.selectedSort, nextProps.location)
    }
  }

  updateQuery(selectedMarketParam, selectedSort, location) {
    let updatedSearch = parseQuery(location.search)

    if (selectedMarketParam === this.defaultMarketParam) {
      delete updatedSearch[SORT_MARKET_PARAM]
    } else {
      updatedSearch[SORT_MARKET_PARAM] = selectedMarketParam
    }

    if (selectedSort === this.defaultSort) {
      delete updatedSearch[SORT_MARKET_ORDER_PARAM]
    } else {
      updatedSearch[SORT_MARKET_ORDER_PARAM] = selectedSort
    }

    updatedSearch = makeQuery(updatedSearch)

    this.props.history.push({
      ...location,
      search: updatedSearch
    })
  }

  render() {
    const s = this.state

    return (
      <article className={Styles.SortMarketParam}>
        <button
          className={Styles.SortMarketParam__order}
          onClick={() => this.setState({ selectedSort: !s.selectedSort })}
        >
          {s.selectedSort ?
            <i className={classNames(Styles.fa, Styles['fa-sort-amount-desc'])} /> :
            <i className={classNames(Styles.fa, Styles['fa-sort-amount-asc'])} />
          }
        </button>
        <Dropdown
          className="companion-field"
          default={s.selectedMarketParam}
          options={this.marketSortParams}
          onChange={selectedMarketParam => this.setState({ selectedMarketParam })}
        />
      </article>
    )
  }
}
