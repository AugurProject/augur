import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PeriodSelector from 'modules/market/components/market-outcome-charts--candlestick-period-selector/market-outcome-charts--candlestick-period-selector'

import Styles from 'modules/market/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick.styles'
import StylesHeader from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

export default class MarketOutcomeCandlestickHeader extends Component {
  static propTypes = {
    updateChartHeaderHeight: PropTypes.func.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    volume: PropTypes.number,
    open: PropTypes.number,
    high: PropTypes.number,
    low: PropTypes.number,
    close: PropTypes.number,
  }

  componentDidMount() {
    if (this.candleHeader) this.props.updateChartHeaderHeight(this.candleHeader.clientHeight)
  }

  render() {
    const p = this.props

    return (
      <section
        ref={(candleHeader) => { this.candleHeader = candleHeader }}
      >
        <div className={StylesHeader.MarketOutcomeChartsHeader__Header} >
          <h2>Placeholder Outcome</h2>
          <span>price (eth)</span>
        </div>
        <div
          className={Styles['MarketOutcomeChartsHeader__chart-interaction']}
        >
          <div className={StylesHeader.MarketOutcomeChartsHeader__stats}>
            <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
                volume
              </span>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
                {p.volume ? p.volume.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
              </span>
            </span>
            <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
                open
              </span>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
                {p.open ? p.open.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
              </span>
            </span>
            <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
                high
              </span>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
                {p.high ? p.high.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
              </span>
            </span>
            <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
                low
              </span>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
                {p.low ? p.low.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
              </span>
            </span>
            <span className={StylesHeader.MarketOutcomeChartsHeader__stat}>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-title`]}>
                close
              </span>
              <span className={StylesHeader[`MarketOutcomeChartsHeader__stat-value`]}>
                {p.close ? p.close.toFixed(p.fixedPrecision).toString() : <span>&mdash;</span>}
              </span>
            </span>
          </div>
          <div
            className={Styles.MarketOutcomeChartsHeader__selector}
          >
            <PeriodSelector
              priceTimeSeries={p.priceTimeSeries}
              updateSelectedPeriod={p.updateSelectedPeriod}
            />
          </div>
        </div>
      </section>
    )
  }
}

MarketOutcomeCandlestickHeader.propTypes = {

}
