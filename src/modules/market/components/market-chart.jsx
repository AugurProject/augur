import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import debounce from 'utils/debounce'

export default class MarketChart extends Component {
  static propTypes = {
    series: PropTypes.array
  };

  constructor(props) {
    super(props)

    this.updateChart = debounce(this.updateChart.bind(this))
  }

  componentDidMount() {
    noData(Highcharts)

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    this.marketPriceChart = new Highcharts.Chart('market_price_history_chart', {
      title: {
        text: null
      },
      chart: {
        height: 300 // mirror this height in css container height declaration
      },
      lang: {
        noData: 'No price history'
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time'
        }
      },
      yAxis: {
        title: {
          text: 'ETH'
        }
      },
      legend: {
        enabled: true
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} ETH Tokens</b><br/>',
        valueDecimals: 2
      },
      credits: {
        enabled: false
      }
    })

    window.addEventListener('resize', this.updateChart)

    this.updateChart()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.series !== this.props.series) this.updateChart()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChart)
  }

  updateChart() {
    (this.props.series || []).forEach((series, i) => {
      if (this.marketPriceChart.series[i] == null) {
        this.marketPriceChart.addSeries({
          type: 'line',
          name: series.name,
          data: series.data
        }, false)
      } else {
        this.marketPriceChart.series[i].setData(series.data, false)
      }
    })

    this.marketPriceChart.redraw()
  }

  render() {
    return (
      <article className="market-price-history-chart market-content-scrollable">
        <div
          id="market_price_history_chart"
        />
      </article>
    )
  }
}
