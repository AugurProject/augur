import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders.styles'

export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    orderBook: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.any,
    hoveredPrice: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredOrderIndex: null,
      hoveredSide: null
    }
  }

  componentDidMount() {
    this.asks.scrollTo(0, (this.asks.scrollHeight || 0))
  }

  render() {
    const p = this.props
    const s = this.state

    const marketMidPoint = () => {
      let midPoint

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
          {(p.orderBook.asks || []).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === p.orderBook.asks.length - 1,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === ASKS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === ASKS && i > s.hoveredOrderIndex
                  }
                )
              }
              onMouseEnter={() => {
                p.updateHoveredPrice(order.price)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: ASKS
                })
              }}
              onMouseLeave={() => {
                p.updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null
                })
              }}
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
          {(p.orderBook.bids || []).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === 0,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === BIDS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === BIDS && i < s.hoveredOrderIndex
                  }
                )
              }
              onMouseEnter={() => {
                p.updateHoveredPrice(order.price)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: BIDS
                })
              }}
              onMouseLeave={() => {
                p.updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null
                })
              }}
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
