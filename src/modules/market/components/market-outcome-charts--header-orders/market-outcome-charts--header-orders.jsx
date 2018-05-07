import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Styles from 'modules/market/components/market-outcome-charts--header-orders/market-outcome-charts--header-orders.styles'
import StylesHeader from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const MarketOutcomeChartsHeaderOrders = p => (
  <section
    className={Styles.MarketOutcomeChartsHeader__orders}
    style={{ minHeight: p.isMobile && p.headerHeight }}
  >
    {p.isMobile ||
      <div className={StylesHeader.MarketOutcomeChartsHeader__Header} >
        <span>Order Book</span>
        { p.updatePrecision &&
          <div className={StylesHeader['MarketOutcomeChartsHeader__precision-selector']}>
            <button
              onClick={() => p.updatePrecision(false)}
            >
              -
            </button>
            <button
              onClick={() => p.updatePrecision(true)}
            >
              +
            </button>
          </div>
        }
      </div>
    }
    <div className={classNames(StylesHeader.MarketOutcomeChartsHeader__stats, Styles['MarketOutcomeChartsHeader__stats--orders'])}>
      <div className={StylesHeader['MarketOutcomeChartsHeader__stat--right']}>
        <span className={StylesHeader['MarketOutcomeChartsHeader__stat-title']}>
          ask qty
        </span>
      </div>
      <div className={StylesHeader['MarketOutcomeChartsHeader__stat--right']}>
        <span className={StylesHeader['MarketOutcomeChartsHeader__stat-title']}>
          price
        </span>
      </div>
      <div className={StylesHeader['MarketOutcomeChartsHeader__stat--right']}>
        <span className={StylesHeader['MarketOutcomeChartsHeader__stat-title']}>
          depth
        </span>
      </div>
    </div>
  </section>
)

export default MarketOutcomeChartsHeaderOrders

MarketOutcomeChartsHeaderOrders.propTypes = {
  fixedPrecision: PropTypes.number.isRequired,
  updatePrecision: PropTypes.func,
  isMobile: PropTypes.bool.isRequired,
  headerHeight: PropTypes.number.isRequired,
}
