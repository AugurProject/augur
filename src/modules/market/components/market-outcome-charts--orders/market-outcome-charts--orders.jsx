import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders.styles'

export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.any,
    orderBook: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.asks.scrollTo(0, (this.asks.scrollHeight || 0))
  }

  render() {
    const p = this.props

    const marketMidPoint = () => {
      let midPoint;

      if (p.orderBook.asks.length === 0 && p.orderBook.bids.length === 0) {
        return 'No Orders'
      } else if (p.orderBook.asks.length === 0 && p.orderBook.bids.length > 0) {
        midPoint = p.orderBook.bids[0]
      } else if (p.orderBook.asks.length > 0 && p.orderBook.bids.length === 0) {
        midPoint = p.orderBook.asks[p.orderBook.asks.length - 1]
      } else {
        midPoint = (p.orderBook.asks[p.orderBook.asks.length - 1].price + p.orderBook.bids[0].price) / 2
      }

      return `${midPoint.toFixed(p.fixedPrecision).toString()} ETH`
    }

    return (
      <section className={Styles.MarketOutcomeOrderBook}>
        <div
          ref={(asks) => { this.asks = asks }}
          className={Styles.MarketOutcomeOrderBook__Side}
        >
          {(p.orderBook.asks || []).map(order => (
            <div
              key={order.cumulativeShares}
              className={Styles.MarketOutcomeOrderBook__Row}
              onMouseEnter={() => p.updateHoveredPrice(order.price)}
              onMouseLeave={() => p.updateHoveredPrice(null)}
            >
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.price.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.shares.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.cumulativeShares.toFixed(p.fixedPrecision).toString()}</span>
              </div>
            </div>
          ))}
        </div>
        <span className={Styles.MarketOutcomeOrderBook__Midmarket}>{marketMidPoint()}</span>
        <div className={Styles.MarketOutcomeOrderBook__Side} >
          {(p.orderBook.bids || []).map(order => (
            <div
              key={order.cumulativeShares}
              className={Styles.MarketOutcomeOrderBook__Row}
              onMouseEnter={() => p.updateHoveredPrice(order.price)}
              onMouseLeave={() => p.updateHoveredPrice(null)}
            >
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.price.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.shares.toFixed(p.fixedPrecision).toString()}</span>
              </div>
              <div className={Styles.MarketOutcomeOrderBook__RowItem}>
                <span>{order.cumulativeShares.toFixed(p.fixedPrecision).toString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
