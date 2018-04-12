import React from 'react'
import PropTypes from 'prop-types'
import { BigNumber } from 'utils/create-big-number'

import Styles from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

import { ASKS } from 'modules/order-book/constants/order-book-order-types'

const MarketOutcomeDepthHeader = (p) => {
  if (p.isMobile) {
    return (
      <section>
        <div className={Styles.MarketOutcomeChartsHeader__stats}>
          <span className={Styles.MarketOutcomeChartsHeader__stat}>
            <span className={Styles['MarketOutcomeChartsHeader__stat-title']} >&nbsp;</span>
          </span>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className={Styles.MarketOutcomeChartsHeader__Header} >
        <span>Market Depth</span>
      </div>
      <div className={Styles.MarketOutcomeChartsHeader__stats}>
        <span className={Styles.MarketOutcomeChartsHeader__stat}>
          <span className={Styles['MarketOutcomeChartsHeader__stat-title']}>
            {p.hoveredDepth[3] === ASKS ? 'ask' : 'bid'} price
          </span>
          <span className={Styles['MarketOutcomeChartsHeader__stat-value']}>
            {BigNumber.isBigNumber(p.hoveredDepth[1]) ? p.hoveredDepth[1].toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={Styles.MarketOutcomeChartsHeader__stat}>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
            qty
          </span>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
            {BigNumber.isBigNumber(p.hoveredDepth[2]) ? p.hoveredDepth[2].toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={Styles.MarketOutcomeChartsHeader__stat}>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
            depth
          </span>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
            {BigNumber.isBigNumber(p.hoveredDepth[0]) ? p.hoveredDepth[0].toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
      </div>
    </section>
  )
}

export default MarketOutcomeDepthHeader

MarketOutcomeDepthHeader.propTypes = {
  hoveredDepth: PropTypes.array.isRequired,
  fixedPrecision: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
}
