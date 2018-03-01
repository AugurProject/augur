import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'

import sortByMarketParam from 'modules/filter-sort/helpers/sort-by-market-param'
import { isEqual } from 'lodash'

import { SORT_MARKET_PARAM, SORT_MARKET_ORDER_PARAM } from 'modules/filter-sort/constants/param-names'
import * as PARAMS from 'modules/filter-sort/constants/market-sort-params'

import Styles from 'modules/filter-sort/components/sort-market-param/sort-market-param.styles'

export default class SortMarketParam extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateIndices: PropTypes.func.isRequired,
    combinedFiltered: PropTypes.array,
  }

  constructor(props) {
    super(props)

    this.defaultMarketParam = 'volume'
    this.defaultSort = true // true = descending, false = ascending

    this.marketSortParams = [
      {
        label: 'Volume',
        value: PARAMS.MARKET_VOLUME,
      },
      {
        label: 'Newest',
        value: PARAMS.MARKET_CREATION_TIME,
      },
      {
        label: 'Expiration',
        value: PARAMS.MARKET_END_DATE,
      },
      {
        label: 'Settlement Fee',
        value: 'settlementFeePercent',
      },
    ]

    this.state = {
      selectedMarketParam: this.defaultMarketParam,
      selectedSort: this.defaultSort,
    }
  }

  componentWillMount() {
    const queryParams = parseQuery(this.props.location.search)

    const selectedMarketParam = queryParams[SORT_MARKET_PARAM]
    if (selectedMarketParam) this.setState({ selectedMarketParam })

    const selectedSort = queryParams[SORT_MARKET_ORDER_PARAM]
    if (selectedSort) this.setState({ selectedSort: selectedSort !== 'false' })

    if (!selectedMarketParam || !selectedSort) {
      this.props.updateIndices({
        indices: sortByMarketParam(this.state.selectedMarketParam, this.state.selectedSort, this.props.items, this.props.combinedFiltered),
        type: SORT_MARKET_PARAM,
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.selectedMarketParam !== nextState.selectedMarketParam ||
      this.state.selectedSort !== nextState.selectedSort
    ) {
      this.updateQuery(nextState.selectedMarketParam, nextState.selectedSort, nextProps.location)
    }

    if (
      !isEqual(this.props.combinedFiltered, nextProps.combinedFiltered) ||
      !isEqual(this.props.items, nextProps.items) ||
      this.state.selectedMarketParam !== nextState.selectedMarketParam ||
      this.state.selectedSort !== nextState.selectedSort
    ) {
      this.props.updateIndices({
        indices: sortByMarketParam(nextState.selectedMarketParam, nextState.selectedSort, nextProps.items, nextProps.combinedFiltered),
        type: SORT_MARKET_PARAM,
      })
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
      search: updatedSearch,
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
