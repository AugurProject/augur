import React from 'react'

import Styles from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick.styles'

const MarketOutcomeCandlestickHeader = p => (
  <div className={Styles[`MarketOutcomeCandlestick__period-stats`]}>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        volume
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.volume ? p.volume.toFixed(2).toString() : ''}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        open
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.open ? p.open.toFixed(2).toString() : ''}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        high
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.high ? p.high.toFixed(2).toString() : ''}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        low
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.low ? p.low.toFixed(2).toString() : ''}
      </span>
    </span>
    <span className={Styles[`MarketOutcomeCandlestick__period-stat`]}>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-title`]}>
        close
      </span>
      <span className={Styles[`MarketOutcomeCandlestick__period-stat-value`]}>
        {p.close ? p.close.toFixed(2).toString() : ''}
      </span>
    </span>
  </div>
)

export default MarketOutcomeCandlestickHeader
