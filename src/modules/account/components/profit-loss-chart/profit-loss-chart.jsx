import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import debounce from 'utils/debounce'

import Styles from 'modules/account/components/profit-loss-chart/profit-loss-chart.styles'

export default class ProfitLossChart extends Component {
  static propTypes = {
    series: PropTypes.array,
    label: PropTypes.string,
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    totalValue: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired
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
    const isMobile = this.props.isMobile
    // const containerId = 'profit-loss-chart-container' + this.props.id
    const chartId = 'profit-loss-chart' + this.props.id

    const height = isMobile ? (9 / (16 * 100)) + '%' : 170
    let width = 368
    if (isMobile) {
      width = window.visualViewport.width <= 420 ? 368 : window.visualViewport.width
    }

    this.profitLossChart = new Highcharts.Chart(chartId, {
      title: {
        text: null
      },
      chart: {
        height: isMobile ? null : height,
        width: isMobile ? null : width,
        backgroundColor: '#1e1a31',
        spacingLeft: isMobile ? 0 : 10,
        spacingRight: isMobile ? 0 : 10,
      },
      lang: {
        noData: 'No price history'
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        visible: false
      },
      yAxis: {
        visible: false
      },
      plotOptions: {
        series: {
          color: 'white',
          fillColor: {
            linearGradient: [0, 0, 0, '100%'],
            stops: [
              [0, Highcharts.Color('#dbdae1').setOpacity(0.5).get('rgba')],
              [0.8, Highcharts.Color('#dbdae1').setOpacity(0.25).get('rgba')],
              // [0.4, Highcharts.Color('#1e1a31').setOpacity(0.1).get('rgba')],
              [1, Highcharts.Color('#dbdae1').setOpacity(0).get('rgba')]
            ]
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<span style="color: #372e4b;">{series.name}</span>: <b>{point.y} ETH Tokens</b><br/>',
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
      console.log(series)
      if (this.profitLossChart.series[i] == null) {
        this.profitLossChart.addSeries({
          type: 'area',
          color: 'white',
          className: Styles.ProfitLossChart__Series,
          marker: {
            fillColor: 'white',
            lineColor: 'white',
          },
          name: series.name,
          data: series.data
        }, false)
      } else {
        this.profitLossChart.series[i].setData(series.data, false)
      }
    })
    let height = this.props.isMobile ? (9 / (16 * 100)) + '%' : 170
    let width = 368

    if (this.props.isMobile) {
      console.log('resize in mobile', window.visualViewport.width)
      width = window.visualViewport.width <= 420 ? 368 : window.visualViewport.width
      // width = 100 + '%'
      height = 10 + '%'
    }
    console.log('resize, PL:', width, height)
    this.profitLossChart.options.chart.height = height
    this.profitLossChart.options.chart.width = width
    this.profitLossChart.redraw()
  }

  render() {
    const containerId = 'profit-loss-chart-container' + this.props.id
    const chartId = 'profit-loss-chart' + this.props.id

    return (
      <article
        className={Styles.ProfitLossChart}
        ref={containerId}
      >
        <div
          id={chartId}
        />
        <span
          className={Styles.ProfitLossChart__Title}
        >
          {this.props.title} {this.props.totalValue}
        </span>
      </article>
    )
  }
}
