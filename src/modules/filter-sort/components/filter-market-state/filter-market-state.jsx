import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import parseQuery from 'modules/routes/helpers/parse-query'
import makeQuery from 'modules/routes/helpers/make-query'

import { FILTER_MARKET_STATE_PARAM } from 'modules/filter-sort/constants/param-names'

export default class FilterMarketState extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.marketStateOptions = [
      {
        label: 'Open',
        value: 'open'
      },
      {
        label: 'Reporting',
        value: 'reporting'
      },
      {
        label: 'Closed',
        value: 'closed'
      }
    ]

    this.defaultMarketState = this.marketStateOptions[0].value

    this.state = {
      selectedMarketState: this.defaultMarketState
    }

    this.updateQuery = this.updateQuery.bind(this)
  }

  componentWillMount() {
    const selectedMarketState = parseQuery(this.props.location.search)[FILTER_MARKET_STATE_PARAM]
    if (selectedMarketState) this.setState({ selectedMarketState })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedMarketState !== nextState.selectedMarketState) {
      this.updateQuery(nextState.selectedMarketState, nextProps.location)
    }
  }

  updateQuery(selectedMarketState, location) {
    let updatedSearch = parseQuery(location.search)

    if (selectedMarketState === this.defaultMarketState) {
      delete updatedSearch[FILTER_MARKET_STATE_PARAM]
    } else {
      updatedSearch[FILTER_MARKET_STATE_PARAM] = selectedMarketState
    }

    updatedSearch = makeQuery(updatedSearch)

    this.props.history.push({
      ...location,
      search: updatedSearch
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
