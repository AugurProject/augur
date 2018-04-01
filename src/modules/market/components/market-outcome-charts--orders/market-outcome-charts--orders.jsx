import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'
import { BUY, SELL } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders.styles'

export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    orderBook: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    selectedOutcome: PropTypes.any,
    hoveredPrice: PropTypes.any,
    marketMidpoint: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredOrderIndex: null,
      hoveredSide: null,
    }
  }

  componentDidMount() {
    this.asks.scrollTo(0, (this.asks.scrollHeight || 0))
  }

  render() {
    const {
      fixedPrecision,
      marketMidpoint,
      orderBook,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.MarketOutcomeOrderBook}>
        <div
          ref={(asks) => { this.asks = asks }}
          className={Styles.MarketOutcomeOrderBook__Side}
        >
          {(orderBook.asks || []).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === orderBook.asks.length - 1,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === ASKS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === ASKS && i > s.hoveredOrderIndex,
                  },
                )
              }
              onMouseEnter={() => {
                updateHoveredPrice(order.price.value)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: ASKS,
                })
              }}
              onMouseLeave={() => {
                updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null,
                })
              }}
            >
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: BUY,
                })}
              >
                <span>{order.shares.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  selectedNav: BUY,
                })}
              >
                <span>{order.price.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: BUY,
                })}
              >
                <span>{order.cumulativeShares.toFixed(fixedPrecision).toString()}</span>
              </button>
            </div>
          ))}
        </div>
        <span className={Styles.MarketOutcomeOrderBook__Midmarket}>
          {marketMidpoint === null ?
            'No Orders' :
            `${marketMidpoint.toFixed(fixedPrecision).toString()} ETH`
          }
        </span>
        <div className={Styles.MarketOutcomeOrderBook__Side} >
          {(orderBook.bids || []).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === 0,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === BIDS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === BIDS && i < s.hoveredOrderIndex,
                  },
                )
              }
              onMouseEnter={() => {
                updateHoveredPrice(order.price.value)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: BIDS,
                })
              }}
              onMouseLeave={() => {
                updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null,
                })
              }}
            >
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: SELL,
                })}
              >
                <span>{order.shares.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  selectedNav: SELL,
                })}
              >
                <span>{order.price.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: SELL,
                })}
              >
                <span>{order.cumulativeShares.toFixed(fixedPrecision).toString()}</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
