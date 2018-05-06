import React from 'react'
import PropTypes from 'prop-types'

import { isNumber } from 'lodash/fp'

import Styles from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

import { ASKS } from 'modules/order-book/constants/order-book-order-types'

const MarketOutcomeDepthHeader = ({
  fixedPrecision,
  headerHeight,
  hoveredDepth,
  isMobile,

}) => {
  if (isMobile) {
    return (
      <section style={{ minHeight: headerHeight }} />
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
            {isNumber(hoveredDepth[3]) === ASKS ? 'ask' : 'bid'} price
          </span>
          <span className={Styles['MarketOutcomeChartsHeader__stat-value']}>
            {isNumber(hoveredDepth[1]) ? hoveredDepth[1].toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={Styles.MarketOutcomeChartsHeader__stat}>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
            qty
          </span>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
            {isNumber(hoveredDepth[2]) ? hoveredDepth[2].toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={Styles.MarketOutcomeChartsHeader__stat}>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
            depth
          </span>
          <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
            {isNumber(hoveredDepth[0]) ? hoveredDepth[0].toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
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
  headerHeight: PropTypes.number.isRequired,
}
