import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PeriodSelector from 'modules/market/components/market-outcome-charts--candlestick-period-selector/market-outcome-charts--candlestick-period-selector'

import Styles from 'modules/market/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick.styles'
import StylesHeader from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const MarketOutcomeCandlestickHeader = ({
  outcomeName,
  isMobile,
  volume,
  fixedPrecision,
  open,
  high,
  low,
  close,
  priceTimeSeries,
  selectedPeriod,
  selectedRange,
  updateSelectedPeriod,
  updateSelectedRange,
}) => (
  <section>
    {isMobile ||
    <div className={StylesHeader.MarketOutcomeChartsHeader__Header} >
      <h2>{outcomeName}</h2>
      <span>price (eth)</span>
    </div>
    }
    <div
      className={Styles['MarketOutcomeChartsHeader__chart-interaction']}
    >
      <div className={StylesHeader.MarketOutcomeChartsHeader__stats}>
        <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
            {isMobile ? 'v': 'volume'}
          </span>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
            {volume ? volume.toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
            {isMobile ? 'o' : 'open'}
          </span>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
            {open ? open.toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
            {isMobile ? 'h' : 'high'}
          </span>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
            {high ? high.toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
            {isMobile ? 'l' : 'low'}
          </span>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
            {low ? low.toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
        <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
            {isMobile ? 'c' : 'close'}
          </span>
          <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
            {close ? close.toFixed(fixedPrecision).toString() : <span>&mdash;</span>}
          </span>
        </span>
      </div>
      <div
        className={classNames(Styles.MarketOutcomeChartsHeader__selector, {
          [Styles['MarketOutcomeChartsHeader__selector--mobile']]: isMobile,
        })}
      >
        <PeriodSelector
          priceTimeSeries={priceTimeSeries}
          updateSelectedPeriod={updateSelectedPeriod}
          updateSelectedRange={updateSelectedRange}
          selectedPeriod={selectedPeriod}
          selectedRange={selectedRange}
        />
      </div>
    </div>
  </section>
)

MarketOutcomeCandlestickHeader.propTypes = {
  outcomeName: PropTypes.string,
  fixedPrecision: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  updateSelectedPeriod: PropTypes.func.isRequired,
  updateSelectedRange: PropTypes.func.isRequired,
  selectedPeriod: PropTypes.number.isRequired,
  selectedRange: PropTypes.number.isRequired,
  volume: PropTypes.number,
  open: PropTypes.number,
  high: PropTypes.number,
  low: PropTypes.number,
  close: PropTypes.number,
  priceTimeSeries: PropTypes.array,
}

export default MarketOutcomeCandlestickHeader
