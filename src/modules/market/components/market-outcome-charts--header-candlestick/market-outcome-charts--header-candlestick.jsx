import React from 'react'
import PropTypes from 'prop-types'

import Styles from 'modules/market/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick.styles'

const MarketOutcomeCandlestickHeader = p => (
  <div className={Styles[`MarketOutcomeCandlestick__period-stats`]}>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        volume
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.volume ? p.volume.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        open
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.open ? p.open.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        high
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.high ? p.high.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        low
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.low ? p.low.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        close
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
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
