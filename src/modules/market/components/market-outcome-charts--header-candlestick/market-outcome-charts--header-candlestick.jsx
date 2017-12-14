import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const MarketOutcomeCandlestickHeader = p => (
  <div className={Styles[`MarketOutcomeChartsHeader__stats`]}>
    <span className={Styles[`MarketOutcomeChartsHeader__stat`]}>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        volume
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {p.volume ? p.volume.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeChartsHeader__stat`]}>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        open
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {p.open ? p.open.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeChartsHeader__stat`]}>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        high
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {p.high ? p.high.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeChartsHeader__stat`]}>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        low
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {p.low ? p.low.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeChartsHeader__stat`]}>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        close
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {p.close ? p.close.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
  </div>
)

export default MarketOutcomeCandlestickHeader

MarketOutcomeCandlestickHeader.propTypes = {
  fixedPrecision: PropTypes.number.isRequired,
  volume: PropTypes.number,
  open: PropTypes.number,
  high: PropTypes.number,
  low: PropTypes.number,
  close: PropTypes.number
}
