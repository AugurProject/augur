import React from 'react'
import PropTypes from 'prop-types'

import MarketOutcomeChartsHeaderCandlestick from 'modules/market/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick'
import MarketOutcomeChartHeaderDepth from 'modules/market/components/market-outcome-charts--header-depth/market-outcome-charts--header-depth'
import MarketOutcomeChartHeaderOrders from 'modules/market/components/market-outcome-charts--header-orders/market-outcome-charts--header-orders'

import Styles from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const MarketOutcomeChartsHeader = p => (
  <section
    className={Styles.MarketOutcomeChartsHeader}
  >
    {p.excludeCandlestick ||
      <div
        className={Styles.MarketOutcomeChartsHeader__Candlestick}
      >
        <MarketOutcomeChartsHeaderCandlestick
          outcomeName={p.outcomeName}
          volume={p.hoveredPeriod.volume}
          open={p.hoveredPeriod.open}
          high={p.hoveredPeriod.high}
          low={p.hoveredPeriod.low}
          close={p.hoveredPeriod.close}
          priceTimeSeries={p.priceTimeSeries}
          fixedPrecision={p.fixedPrecision}
          updateSelectedPeriod={p.updateSelectedPeriod}
        />
      </div>
    }
    <div
      className={Styles.MarketOutcomeChartsHeader__Depth}
    >
      <MarketOutcomeChartHeaderDepth
        fixedPrecision={p.fixedPrecision}
        hoveredDepth={p.hoveredDepth}
      />
    </div>
    <div
      className={Styles.MarketOutcomeChartsHeader__Orders}
    >
      <MarketOutcomeChartHeaderOrders
        fixedPrecision={p.fixedPrecision}
        updatePrecision={p.updatePrecision}
      />
    </div>
  </section>
)

export default MarketOutcomeChartsHeader

MarketOutcomeChartsHeader.propTypes = {
  outcomeName: PropTypes.string,
  hoveredPeriod: PropTypes.object.isRequired,
  hoveredDepth: PropTypes.array.isRequired,
  fixedPrecision: PropTypes.number.isRequired,
  updatePrecision: PropTypes.func.isRequired,
  updateSelectedPeriod: PropTypes.func.isRequired,
  priceTimeSeries: PropTypes.array,
  excludeCandlestick: PropTypes.bool,
}
