import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const MarketOutcomeChartsHeaderOrders = p => (
  <section>
    <div className={Styles.MarketOutcomeChartsHeader__Header} >
      <span>Order Book</span>
      <div className={Styles['MarketOutcomeChartsHeader__precision-selector']}>
        <button>
          -
        </button>
        <button>
          +
        </button>
      </div>
    </div>
    <div className={Styles['MarketOutcomeChartsHeader__stats']}>
      <div className={Styles['MarketOutcomeChartsHeader__stat--right']}>
        <span className={Styles['MarketOutcomeChartsHeader__stat-title']}>
          ask qty
        </span>
      </div>
      <div className={Styles['MarketOutcomeChartsHeader__stat--right']}>
        <span className={Styles['MarketOutcomeChartsHeader__stat-title']}>
          price
        </span>
      </div>
      <div className={Styles['MarketOutcomeChartsHeader__stat--right']}>
        <span className={Styles['MarketOutcomeChartsHeader__stat-title']}>
          depth
        </span>
      </div>
    </div>
  </section>
)

export default MarketOutcomeChartsHeaderOrders

MarketOutcomeChartsHeaderOrders.propTypes = {
  fixedPrecision: PropTypes.number.isRequired
}
