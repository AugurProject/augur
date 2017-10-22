import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeCandlestick from 'modules/market/containers/market-outcome-candlestick'
import MarketOutcomeDepth from 'modules/market/containers/market-outcome-depth'
import MarketOutcomeOrderBook from 'modules/market/containers/market-outcome-order-book'

export default class MarketOutcomeGraphs extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      hoverPrice: null
    }
  }

  render() {
    const p = this.props

    return (
      <section>
        <MarketOutcomeCandlestick
          selectedOutcome={p.selectedOutcome}
        />
        <MarketOutcomeDepth
          selectedOutcome={p.selectedOutcome}
        />
        <MarketOutcomeOrderBook
          selectedOutcome={p.selectedOutcome}
        />
      </section>
    )
  }
}
