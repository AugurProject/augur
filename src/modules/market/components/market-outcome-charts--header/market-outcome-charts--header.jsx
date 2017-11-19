import React from 'react'

import MarketOutcomeChartsHeaderCandlestick from 'modules/market/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick'
import MarketOutcomeChartHeaderDepth from 'modules/market/components/market-outcome-charts--header-depth/market-outcome-charts--header-depth'
import MarketOutcomeChartHeaderOrders from 'modules/market/components/market-outcome-charts--header-orders/market-outcome-charts--header-orders'

import Styles from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const MarketOutcomeChartsHeader = p => (
  <section className={Styles.MarketOutcomeChartsHeader}>
    <MarketOutcomeChartsHeaderCandlestick />
    <MarketOutcomeChartHeaderDepth />
    <MarketOutcomeChartHeaderOrders />
  </section>
)

export default MarketOutcomeChartsHeader


// <h3><span>OUTCOME TODO</span> price(eth)</h3>
// <MarketOutcomeCandlestickHeader
//   volume={s.hoveredPeriod.volume}
//   open={s.hoveredPeriod.open}
//   high={s.hoveredPeriod.high}
//   low={s.hoveredPeriod.low}
//   close={s.hoveredPeriod.close}
// />


// <h3>Market Depth</h3>
// <MarketOutcomeDepthHeader
//   side={s.hoveredDepth[3]}
//   price={s.hoveredDepth[1]}
//   quantity={s.hoveredDepth[2]}
// />
