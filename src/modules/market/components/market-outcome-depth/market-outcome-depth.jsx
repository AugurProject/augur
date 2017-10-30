import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highchart from 'highcharts/highstock'
import noData from 'highcharts/modules/no-data-to-display'
import { isEqual } from 'lodash'

import debounce from 'utils/debounce'

import Styles from 'modules/market/components/market-outcome-depth/market-outcome-depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    marketDepth: PropTypes.object.isRequired,
    marketMin: PropTypes.number.isRequired,
    marketMax: PropTypes.number.isRequired,
    hoveredPrice: PropTypes.any,
    updateHoveredPrice: PropTypes.func.isRequired
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
      credits: {
        enabled: false
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
        showLastLabel: true,
        gridLineWidth: 0,
        minorGridLineWidth: 0,
        labels: {
          align: 'bottom',
          verticalAlign: 'bottom'
        },
        crosshair: {
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
          step: true
        },
        {
          showInLegend: false,
          name: '',
          lineWidth: 1,
          step: true
        }
      ],
      plotOptions: {
        series: {
          point: {
            events: {
              mouseOver: (event) => {
                this.props.updateHoveredPrice(event.target.y)
              },
              mouseOut: event => this.props.updateHoveredPrice(null)
            }
          }
        }
      }
    })

    window.addEventListener('resize', this.debouncedUpdateGraph)

    this.updateGraph()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.marketDepth, this.props.marketDepth)) this.updateGraph()

    console.log('hoveredPrice -- ', this.props.hoveredPrice)
  }

  componentWillUnmount() {
    this.outcomeDepth.destroy()
    window.removeEventListener('resize', this.debouncedUpdateGraph)
  }

  updateGraph() {
    this.outcomeDepth.series[0].setData(this.props.marketDepth.asks, false)
    this.outcomeDepth.series[1].setData(this.props.marketDepth.bids, false)

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
