import React, { Component } from 'react'

import MarketOutcomesList from 'modules/market/components/market-outcomes-list/market-outcomes-list'

import Styles from 'modules/market/components/market-data/market-data.styles'

export default class MarketData extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const s = this.state
    const p = this.props

    return (
      <section className={Styles.MarketData}>
        <div className={Styles.MarketData__details}>
          <MarketOutcomesList outcomes={p.outcomes} />
        </div>
        <div className={Styles.MarketData__trading}>
          trading
        </div>
      </section>
    )
  }
}
