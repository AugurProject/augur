import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-order-book/market-outcome-order-book.styles'

export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    selectedOutcome: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      // ???
    }
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeOrderBook}>
        <span>order book</span>
      </section>
    )
  }
}
