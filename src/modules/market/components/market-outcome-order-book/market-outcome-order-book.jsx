import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-order-book/market-outcome-order-book.styles'

export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.any,
    orderBook: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    console.log('props -- ', this.props.orderBook)
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.MarketOutcomeOrderBook}>
        <div className={Styles.MarketOutcomeOrderBook__side} >
          {(p.orderBook.asks || []).map(order => (
            <div
              key={order.cumulativeShares}
              className={Styles.MarketOutcomeOrderBook__side}
            >
              <span>{order.price}</span>
              <span>{order.shares}</span>
              <span>{order.cumulativeShares}</span>
            </div>
          ))}
        </div>
        <span>Price</span>
        <div className={Styles.MarketOutcomeOrderBook__side} >
          {(p.orderBook.bids || []).map(order => (
            <div key={order.cumulativeShares} >
              <span>{order.price}</span>
              <span>{order.shares}</span>
              <span>{order.cumulativeShares}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }
}
