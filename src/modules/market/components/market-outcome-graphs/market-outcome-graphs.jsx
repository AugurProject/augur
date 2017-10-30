import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-depth/market-outcome-depth'
import MarketOutcomeOrderBook from 'modules/market/components/market-outcome-order-book/market-outcome-order-book'

import Styles from 'modules/market/components/market-outcome-graphs/market-outcome-graphs.styles'

export default class MarketOutcomeGraphs extends Component {
  static propTypes = {
    marketPriceHistory: PropTypes.array.isRequired,
    marketMin: PropTypes.number.isRequired,
    marketMid: PropTypes.number.isRequired,
    marketMax: PropTypes.number.isRequired,
    orderBook: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredPrice: null
    }

    this.updateHoveredPrice = this.updateHoveredPrice.bind(this)
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({ hoveredPrice })
  }

  render() {
    const s = this.state
    const p = this.props

    // NOTE -- wire up marketMin + marketMax

    return (
      <section className={Styles.MarketOutcomeGraphs}>
        <span className={Styles.MarketOutcomeGraphs__center} />
        <MarketOutcomeCandlestick
          marketPriceHistory={p.marketPriceHistory}
          outcomeMin={p.marketMin}
          orderBookMid={p.marketMid}
          outcomeMax={p.marketMax}
          marketMax={1}
          marketMin={0}
          hoveredPrice={s.hoveredPrice}
          updateHoveredPrice={this.updateHoveredPrice}
        />
        <MarketOutcomeDepth
          marketDepth={p.marketDepth}
          hoveredPrice={s.hoveredPrice}
          updateHoveredPrice={this.updateHoveredPrice}
        />
        <MarketOutcomeOrderBook
          orderBook={p.orderBook}
          hoveredPrice={s.hoveredPrice}
          updateHoveredPrice={this.updateHoveredPrice}
        />
      </section>
    )
  }
}
