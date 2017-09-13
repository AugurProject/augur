import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'modules/common/components/dropdown'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'
import getValue from 'utils/get-value'
import isEqual from 'lodash/isEqual'

import { SORT_MARKET_PARAM, SORT_MARKET_ORDER_PARAM } from 'modules/routes/constants/param-names'

import Styles from 'modules/filter-sort/components/sort-market-param/sort-market-param.styles'
// import Styles_FA from 'assets/styles/_typ_font-awesome.css'

export default class SortMarketParam extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    combinedFiltered: PropTypes.array.isRequired,
    updateSort: PropTypes.func.isRequired
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
        label: 'Settlement Fee',
        value: 'settlementFeePercent'
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
    // call respective methods
    if (
      this.state.selectedMarketParam !== nextState.selectedMarketParam ||
      this.state.selectedSort !== nextState.selectedSort ||
      !isEqual(this.props.items, nextProps.items) ||
      !isEqual(this.props.combinedFiltered, nextProps.combinedFiltered)
    ) {
      this.sortByMarketParam(nextState.selectedMarketParam, nextState.selectedSort, nextProps.items, nextProps.combinedFiltered, nextProps.location)
    }

    if (
      this.state.selectedMarketParam !== nextState.selectedMarketParam ||
      this.state.selectedSort !== nextState.selectedSort
    ) {
      this.updateQuery(nextState.selectedMarketParam, nextState.selectedSort, nextProps.location)
    }
  }

  sortByMarketParam(selectedMarketParam, selectedSort, items, combinedFiltered, location) {
    const sortedItems = combinedFiltered.slice().sort((a, b) => {
      switch (selectedMarketParam) {
        case 'creationTime':
        case 'endDate': {
          if (selectedSort) {
            return getValue(items, `${b}.${selectedMarketParam}.timestamp`) - getValue(items, `${a}.${selectedMarketParam}.timestamp`)
          }

          return getValue(items, `${a}.${selectedMarketParam}.timestamp`) - getValue(items, `${b}.${selectedMarketParam}.timestamp`)
        }
        case 'volume':
        case 'settlementFeePercent':
        case 'makerFeePercent': {
          if (selectedSort) {
            return getValue(items, `${b}.${selectedMarketParam}.value`) - getValue(items, `${a}.${selectedMarketParam}.value`)
          }

          return getValue(items, `${a}.${selectedMarketParam}.value`) - getValue(items, `${b}.${selectedMarketParam}.value`)
        }
        default:
          return 0 // No sorting
      }
    })

    this.props.updateSort(sortedItems)
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
        <Dropdown
          className="companion-field"
          default={s.selectedMarketParam}
          options={this.marketSortParams}
          onChange={selectedMarketParam => this.setState({ selectedMarketParam })}
        />
        <button
          className={Styles.SortMarketParam__order}
          onClick={() => this.setState({ selectedSort: !s.selectedSort })}
        >
          {s.selectedSort ? <i className="fa fa-sort-amount-desc" /> : <i className="fa fa-sort-amount-asc" />}
        </button>
      </article>
    )
  }
}
