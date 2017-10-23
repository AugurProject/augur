import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highchart from 'highcharts/highstock'
import noData from 'highcharts/modules/no-data-to-display'
import { isEqual } from 'lodash'

import debounce from 'utils/debounce'

import Styles from 'modules/market/components/market-outcome-depth/market-outcome-depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    outcomeDepth: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.updateGraph = this.updateGraph.bind(this)
    this.debouncedUpdateGraph = debounce(this.updateGraph.bind(this))
  }

  componentDidMount() {
    noData(Highchart)

    this.outcomeDepth = Highchart.stockChart('market_outcome_depth', {
      chart: {
        backgroundColor: '#2d2846',
        height: 400
      },
      title: {
//          TODO title; probably as mid point
      },
      lang: {
        thousandsSep: ',',
        noData: 'No orders to display'
      },
      xAxis: {
        title: {
          text: ''
        },
        max: 1,
        tickWidth: 0,
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        minorTickLength: 0,
        tickLength: 0,
        crosshair: {
//          width: 3,
          dashStyle: 'dash',
          width: 1,
          color: 'white',
          zIndex: 22
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        min: 0, // can't do anything with less than 0 shares
        showLastLabel: true,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        labels: {
          align: 'bottom',
          verticalAlign: 'bottom'
        },
        crosshair: {
//          width: 3,
          dashStyle: 'dash',
          width: 1,
          color: 'white',
          zIndex: 22
        }
      },
      series: [
        {
          showInLegend: false,
          name: '',
          type: 'area',
          color: '#7257a3',
          lineWidth: 3,
          threshold: null,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 1,
              x2: 0,
              y2: 0
            },
            stops: [
              [0, '#2d2846'],
              [1, '#3c2d63']
            ]
          },
        },
        {
          showInLegend: false,
          name: '', // TODO correct thing to display?  Needs to be same as series[0]
          type: 'area',
          color: '#7257a3',
          lineWidth: 3,
          threshold: null,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 1,
              x2: 0,
              y2: 0
            },
            stops: [
              [0, '#2d2846'],
              [1, '#3c2d63']
            ]
          },
        }
      ],
      tooltip: {
//          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} Shares Available <br />@ {point.x} ETH</b><br/>',
        valueSuffix: '',
        formatter: function () {
          return this.point.y + " Shares Available @" + this.point.x + "ETH";
        },
        valueDecimals: 2,
        positioner: function () {
          return { x: 180, y: 130 };
        },
        shadow: false,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.4)'
      },
      credits: {
        enabled: false
      }
    })

    window.addEventListener('resize', this.debouncedUpdateGraph)

    this.updateGraph()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.outcomeDepth, this.props.outcomeDepth)) this.updateGraph()
  }

  componentWillUnmount() {
    this.outcomeDepth.destroy()
    window.removeEventListener('resize', this.debouncedUpdateGraph)
  }

  updateGraph() {
    this.outcomeDepth.series[0].setData(this.props.outcomeDepth.asks, false)
    this.outcomeDepth.series[1].setData(this.props.outcomeDepth.bids, false)

    this.outcomeDepth.redraw()
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeDepth}>
        <div
          id="market_outcome_depth"
          className={Styles.MarketOutcomeDepth__graph}
        />
      </section>
    )
  }
}
