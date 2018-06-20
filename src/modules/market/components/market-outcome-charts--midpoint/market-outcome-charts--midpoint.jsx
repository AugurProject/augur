import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles'

export default class MarketOutcomeMidpoint extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    chartWidths: PropTypes.object.isRequired,
    headerHeight: PropTypes.number.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    sharedChartMargins: PropTypes.object.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    hasPriceHistory: PropTypes.bool,
  }

  render() {
    const {
      orderBookKeys,
      fixedPrecision,
    } = this.props
    return (
      <section>
        <div
          ref={(drawContainer) => { this.drawContainer = drawContainer }}
          className={Styles.MarketOutcomeMidpoint}
        >
          <span>{`${orderBookKeys.mid.toFixed(fixedPrecision)} ETH`}</span>
        </div>
      </section>
    )
  }
}

