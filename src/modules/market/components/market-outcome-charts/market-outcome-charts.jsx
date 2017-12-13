import React, { Component } from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeChartsHeader from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header'
import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth'
import MarketOutcomeOrderBook from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders'

import Styles from 'modules/market/components/market-outcome-charts/market-outcome-charts.styles'

export default class MarketOutcomeCharts extends Component {
  static propTypes = {
    marketPriceHistory: PropTypes.array.isRequired,
    marketMin: PropTypes.number.isRequired,
    marketMax: PropTypes.number.isRequired,
    orderBookMin: PropTypes.number.isRequired,
    orderBookMid: PropTypes.number.isRequired,
    orderBookMax: PropTypes.number.isRequired,
    orderBook: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired,
    selectedOutcomes: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredPeriod: {},
      hoveredPrice: null,
      fixedPrecision: 4
    }

    this.updateHoveredPeriod = this.updateHoveredPeriod.bind(this)
    this.updateHoveredPrice = this.updateHoveredPrice.bind(this)
    this.updatePrecision = this.updatePrecision.bind(this)
  }

  updateHoveredPeriod(hoveredPeriod) {
    console.log('hovered -- ', hoveredPeriod)
    this.setState({
      hoveredPeriod
    })
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice
    })
  }

  updatePrecision(isIncreasing) {
    let fixedPrecision = this.state.fixedPrecision

    if (isIncreasing) {
      fixedPrecision += 1
    } else {
      fixedPrecision = fixedPrecision - 1 < 0 ? 0 : fixedPrecision -= 1
    }

    return this.setState({ fixedPrecision })
  }

  render() {
    const s = this.state
    const p = this.props

    // TODO -- wire up marketMin + marketMax

    return (
      <section className={Styles.MarketOutcomeCharts}>
        <MarketOutcomeChartsHeader
          updatePrecision={this.updatePrecision}
          hoveredPeriod={s.hoveredPeriod}
          fixedPrecision={s.fixedPrecision}
        />
        <div className={Styles.MarketOutcomeCharts__Charts}>
          <MarketOutcomeCandlestick
            marketPriceHistory={p.marketPriceHistory}
            outcomeMin={p.marketMin}
            orderBookMid={p.orderBookMid}
            outcomeMax={p.marketMax}
            marketMax={1}
            marketMin={0}
            hoveredPrice={s.hoveredPrice}
            updateHoveredPrice={this.updateHoveredPrice}
            updateHoveredPeriod={this.updateHoveredPeriod}
          />
          <MarketOutcomeDepth
            orderBookMin={p.orderBookMin}
            orderBookMid={p.orderBookMid}
            orderBookMax={p.orderBookMax}
            marketDepth={p.marketDepth}
            hoveredPrice={s.hoveredPrice}
            updateHoveredPrice={this.updateHoveredPrice}
          />
          <MarketOutcomeOrderBook
            orderBook={p.orderBook}
            hoveredPrice={s.hoveredPrice}
            updateHoveredPrice={this.updateHoveredPrice}
          />
        </div>
      </section>
    )
  }
}
