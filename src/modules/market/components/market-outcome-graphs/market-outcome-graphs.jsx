import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeCandlestick from 'modules/market/containers/market-outcome-candlestick'
import MarketOutcomeDepth from 'modules/market/containers/market-outcome-depth'
import MarketOutcomeOrderBook from 'modules/market/containers/market-outcome-order-book'

import Styles from 'modules/market/components/market-outcome-graphs/market-outcome-graphs.styles'

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
      <section className={Styles.MarketOutcomeGraphs}>
        <span className={Styles.MarketOutcomeGraphs__center} />
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
