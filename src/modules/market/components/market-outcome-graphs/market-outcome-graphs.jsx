import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-depth/market-outcome-depth'
import MarketOutcomeOrderBook from 'modules/market/components/market-outcome-order-book/market-outcome-order-book'

import Styles from 'modules/market/components/market-outcome-graphs/market-outcome-graphs.styles'

export default class MarketOutcomeGraphs extends Component {
  static propTypes = {
    marketPriceHistory: PropTypes.array.isRequired,
    orderBook: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired,
    marketMidpoint: PropTypes.number.isRequired
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
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketOutcomeGraphs}>
        <span className={Styles.MarketOutcomeGraphs__center} />
        <MarketOutcomeCandlestick
          marketPriceHistory={p.marketPriceHistory}
          marketMidpoint={p.marketMidpoint}
          hoverPrice={s.hoverPrice}
          updateHoverPrice={this.updateHoverPrice}
        />
        <MarketOutcomeDepth
          marketDepth={p.marketDepth}
          hoverPrice={s.hoverPrice}
          updateHoverPrice={this.updateHoverPrice}
        />
        <MarketOutcomeOrderBook
          orderBook={p.orderBook}
          hoverPrice={s.hoverPrice}
          updateHoverPrice={this.updateHoverPrice}
        />
      </section>
    )
  }
}
