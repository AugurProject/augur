import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-depth/market-outcome-depth'
import MarketOutcomeOrderBook from 'modules/market/components/market-outcome-order-book/market-outcome-order-book'

import Styles from 'modules/market/components/market-outcome-graphs/market-outcome-graphs.styles'

export default class MarketOutcomeGraphs extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.any.isRequired,
    marketPriceHistory: PropTypes.array.isRequired,
    orderBook: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      hoverPrice: null
    }

    this.updateHoverPrice = this.updateHoverPrice.bind(this)
  }

  updateHoverPrice(hoverPrice) {
    this.setState({ hoverPrice })
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.MarketOutcomeGraphs}>
        <span className={Styles.MarketOutcomeGraphs__center} />
      </section>
    )
  }
}

// <MarketOutcomeCandlestick
//   marketPriceHistory={p.marketPriceHistory}
//   updateHoverPrice={this.updateHoverPrice}
// />

// <MarketOutcomeDepth
//   orderBook={p.orderBook}
//   updateHoverPrice={this.updateHoverPrice}
// />
// <MarketOutcomeOrderBook
//   orderBook={p.orderBook}
//   updateHoverPrice={this.updateHoverPrice}
// />
