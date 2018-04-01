import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'

import filterByMarketState from 'modules/filter-sort/helpers/filter-by-market-state'

import { isEqual } from 'lodash'

import { FILTER_MARKET_STATE_PARAM } from 'modules/filter-sort/constants/param-names'
import * as STATES from 'modules/filter-sort/constants/market-states'

export default class FilterMarketState extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    updateIndices: PropTypes.func.isRequired,
    currentReportingPeriod: PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.marketStateOptions = [
      {
        label: 'Open',
        value: STATES.MARKET_OPEN,
      },
      {
        label: 'Reporting',
        value: STATES.MARKET_REPORTING,
      },
      {
        label: 'Closed',
        value: STATES.MARKET_CLOSED,
      },
    ]

    this.defaultMarketState = this.marketStateOptions[0].value

    this.state = {
      selectedMarketState: this.defaultMarketState,
    }

    this.updateQuery = this.updateQuery.bind(this)
  }

  componentWillMount() {
    const {
      currentReportingPeriod,
      items,
      location,
      updateIndices,
    } = this.props
    const selectedMarketState = parseQuery(location.search)[FILTER_MARKET_STATE_PARAM]
    if (selectedMarketState) {
      this.setState({ selectedMarketState })
    } else {
      updateIndices({
        indices: filterByMarketState(this.state.selectedMarketState, currentReportingPeriod, items),
        type: FILTER_MARKET_STATE_PARAM,
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      items,
      updateIndices,
    } = this.props
    if (this.state.selectedMarketState !== nextState.selectedMarketState) {
      this.updateQuery(nextState.selectedMarketState, nextProps.location)
      updateIndices({
        indices: filterByMarketState(nextState.selectedMarketState, nextProps.currentReportingPeriod, nextProps.items),
        type: FILTER_MARKET_STATE_PARAM,
      })
    }

    if (!isEqual(items, nextProps.items)) {
      updateIndices({
        indices: filterByMarketState(nextState.selectedMarketState, nextProps.currentReportingPeriod, nextProps.items),
        type: FILTER_MARKET_STATE_PARAM,
      })
    }
  }

  updateQuery(selectedMarketState, location) {
    const { history } = this.props
    let updatedSearch = parseQuery(location.search)

    if (selectedMarketState === this.defaultMarketState) {
      delete updatedSearch[FILTER_MARKET_STATE_PARAM]
    } else {
      updatedSearch[FILTER_MARKET_STATE_PARAM] = selectedMarketState
    }

    updatedSearch = makeQuery(updatedSearch)

    history.push({
      ...location,
      search: updatedSearch,
    })
  }

  render() {
    return (
      <article className="filter-market-state">
        <Dropdown
          default={this.state.selectedMarketState}
          options={this.marketStateOptions}
          onChange={selectedMarketState => this.setState({ selectedMarketState })}
        />
      </article>
    )
  }
}
