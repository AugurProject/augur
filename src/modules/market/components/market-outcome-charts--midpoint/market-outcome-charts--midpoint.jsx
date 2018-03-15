import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import Styles from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles'

import { isEqual } from 'lodash'

export default class MarketOutcomeMidpoint extends Component {
  static propTypes = {
    orderBookKeys: PropTypes.object.isRequired,
    sharedChartMargins: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      midpointChart: null,
    }

    this.drawMidpoint = this.drawMidpoint.bind(this)
  }

  componentDidMount() {
    this.drawMidpoint(this.props.orderBookKeys, this.props.sharedChartMargins)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(this.props.sharedChartMargins, nextProps.sharedChartMargins)
    ) this.drawMidpoint(nextProps.orderBookKeys, nextProps.sharedChartMargins)
  }

  drawMidpoint(orderBookKeys, chartMargins) {
    if (this.midpointChart) {
      // Chart Element
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv)
        .append('svg')
        .attr('id', 'market_midpoint')

      // Dimensions
      const width = this.midpointChart.clientWidth
      const height = this.midpointChart.clientHeight

      chart.attr('width', width)
      chart.attr('height', height)

      const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([
          chartMargins.top,
          height - chartMargins.bottom,
        ])

      chart.append('line')
        .attr('id', 'midpoint_line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', () => yScale(0.5))
        .attr('y2', () => yScale(0.5))

      return this.setState({
        midpointChart: fauxDiv.toReact(),
      })
    }

    return this.setState({
      midpointChart: null,
    })
  }

  render() {
    return (
      <section>
        <div
          ref={(midpointChart) => { this.midpointChart = midpointChart }}
          className={Styles['MarketOutcomeCharts__midpoint-chart']}
        >
          {this.state.midpointChart}
        </div>
      </section>
    )
  }
}
