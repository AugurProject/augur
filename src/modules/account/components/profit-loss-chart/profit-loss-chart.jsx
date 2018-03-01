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
    isMobile: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props)

    this.updateChart = debounce(this.updateChart.bind(this))
  }

  componentDidMount() {
    noData(Highcharts)

    Highcharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    })

    const containerId = 'profit_loss_chart_container' + this.props.id
    const chartId = 'profit_loss_chart' + this.props.id
    // calculate horizontal margins, if mobile 0, else default
    const horizontalMargins = this.props.isMobile ? 0 : null
    // determine height based on mobile or not
    let height = this.props.isMobile ? 260 : 170
    // if the width of container is going to be <= height use 9/16 aspect ratio
    if (this.refs[containerId].clientWidth <= height) {
      height = ((9 / 16) * 100) + '%'
    }

    this.profitLossChart = new Highcharts.Chart(chartId, {
      title: {
        text: null,
      },
      chart: {
        backgroundColor: '#1e1a31',
        height,
        marginBottom: 1,
        marginLeft: horizontalMargins,
        marginRight: horizontalMargins,
      },
      lang: {
        noData: 'No price history',
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        visible: false,
      },
      yAxis: {
        visible: false,
      },
      plotOptions: {
        series: {
          color: 'white',
          fillColor: {
            linearGradient: [0, 0, 0, '100%'],
            stops: [
              [0, Highcharts.Color('#dbdae1').setOpacity(0.5).get('rgba')],
              [0.8, Highcharts.Color('#dbdae1').setOpacity(0.25).get('rgba')],
              [1, Highcharts.Color('#dbdae1').setOpacity(0).get('rgba')],
            ],
          },
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '<span style="color: #372e4b;">{series.name}</span>: <b>{point.y} ETH Tokens</b><br/>',
        valueDecimals: 2,
      },
      credits: {
        enabled: false,
      },
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
          data: series.data,
        }, false)
      } else {
        this.profitLossChart.series[i].setData(series.data, false)
      }
    })
    const containerId = 'profit_loss_chart_container' + this.props.id
    const horizontalMargins = this.props.isMobile ? 0 : null
    // determine height based on mobile
    const height = this.props.isMobile ? 260 : 170
    // set height
    this.profitLossChart.options.chart.height = height
    // check if width is less than height, default to a 9/16 aspect ratio
    if (this.refs[containerId] && this.refs[containerId].clientWidth <= height) {
      this.profitLossChart.options.chart.height = ((9 / 16) * 100) + '%'
    }
    // adjust margins
    this.profitLossChart.options.chart.marginLeft = horizontalMargins
    this.profitLossChart.options.chart.marginRight = horizontalMargins
    // redraw
    this.profitLossChart.redraw()
  }

  render() {
    const containerId = 'profit_loss_chart_container' + this.props.id
    const chartId = 'profit_loss_chart' + this.props.id

    return (
      <article
        className={Styles.ProfitLossChart}
        ref={containerId}
      >
        <div
          id={chartId}
        />
        <div
          className={Styles.ProfitLossChart__Title}
        >
          <span
            className={Styles['ProfitLossChart__Title-label']}
          >
            {this.props.title + ' '}
          </span>
          <span
            className={Styles['ProfitLossChart__Title-value']}
          >
            {this.props.totalValue}
          </span>
        </div>
      </article>
    )
  }
}
