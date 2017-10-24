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

    this.outcomeDepth = Highchart.chart('market_outcome_depth', {
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
        max: 1,
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
          lineWidth: 1,
          threshold: null,
          step: true
        },
        {
          showInLegend: false,
          name: '',
          lineWidth: 1,
          step: true
        }
      ],
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
