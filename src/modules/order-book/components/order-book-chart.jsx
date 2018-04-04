import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

export default class OrderBookChart extends Component {
  static propTypes = {
    orderBookSeries: PropTypes.object,
  }

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

    this.orderBookChart = new Highcharts.Chart('order_book_chart', {
      title: {
        text: null,
      },
      chart: {
        height: 300, // mirror this height in css container height declaration
      },
      lang: {
        thousandsSep: ',',
        noData: 'No orders to display',
      },
      yAxis: {
        title: {
          text: 'Shares',
        },
      },
      xAxis: {
        title: {
          text: 'ETH Tokens',
        },
      },
      series: [
        {
          type: 'area',
          name: 'Bids',
          step: 'right',
          data: [],
        },
        {
          type: 'area',
          name: 'Asks',
          step: 'left',
          data: [],
        },
      ],
      tooltip: {
        headerFormat: null,
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} Shares @ {point.x} ETH Tokens</b><br/>',
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
    const { orderBookSeries } = this.props
    if (prevProps.orderBookSeries !== orderBookSeries) this.updateChart()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChart)
  }

  updateChart() {
    const bidSeries = getValue(this.props, `orderBookSeries.${BIDS}`) || []
    const askSeries = getValue(this.props, `orderBookSeries.${ASKS}`) || []

    this.orderBookChart.series[0].setData(bidSeries, false)
    this.orderBookChart.series[1].setData(askSeries, false)

    this.orderBookChart.redraw()
  }

  render() {
    return (
      <article
        className="order-book-chart"
      >
        <div
          id="order_book_chart"
        />
      </article>
    )
  }
}
