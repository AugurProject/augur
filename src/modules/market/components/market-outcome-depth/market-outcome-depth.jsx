import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highchart from 'highcharts/js/highstock'
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
    this.determineHoveredPrice = this.determineHoveredPrice.bind(this)
    this.updateCrosshair = this.updateCrosshair.bind(this)
  }

  componentDidMount() {
    noData(Highchart)

    this.outcomeDepth = Highchart.chart('market_outcome_depth', {
      chart: {
        backgroundColor: '#2d2846'
      },
      credits: {
        enabled: false
      },
      tooltip: {
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
        tickLength: 0
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
        }
      },
      series: [
        {
          showInLegend: false,
          name: '',
          lineWidth: 1
        },
        {
          showInLegend: false,
          name: '',
          lineWidth: 1
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
    this.depthGraph.addEventListener('mousemove', this.determineHoveredPrice)

    this.updateGraph()
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.marketDepth, nextProps.marketDepth)) this.updateGraph()

    if (!isEqual(this.props.hoveredPrice, nextProps.hoveredPrice)) this.updateCrosshair(nextProps.hoveredPrice)
  }

  componentWillUnmount() {
    this.outcomeDepth.destroy()
    window.removeEventListener('resize', this.debouncedUpdateGraph)
    this.depthGraph.removeEventListener('mousemove', this.determineHoveredPrice)
  }

  determineHoveredPrice(event) {
    const yValue = this.outcomeDepth.yAxis[0].toValue(event.chartY)

    if (yValue > this.props.marketMax || yValue < this.props.marketMin) return this.props.updateHoveredPrice(null)

    this.props.updateHoveredPrice(yValue)
  }

  updateGraph() {
    this.outcomeDepth.series[0].setData(this.props.marketDepth.asks, false)
    this.outcomeDepth.series[1].setData(this.props.marketDepth.bids, false)

    this.outcomeDepth.redraw()
  }

  updateCrosshair(hoveredPrice) {
    console.log('updateCrosshair w/in depth -- ', hoveredPrice)

    // clear the old crosshair
    this.outcomeDepth.yAxis[0].removePlotLine('depth_price_crosshair')

    // conditionally render to crosshair
    if (hoveredPrice !== null) {
      this.outcomeDepth.yAxis[0].addPlotLine({
        value: hoveredPrice,
        width: 1,
        id: 'depth_price_crosshair'
      })
    }
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeDepth}>
        <div
          ref={(depthGraph) => { this.depthGraph = depthGraph }}
          id="market_outcome_depth"
          className={Styles.MarketOutcomeDepth__graph}
        />
      </section>
    )
  }
}
