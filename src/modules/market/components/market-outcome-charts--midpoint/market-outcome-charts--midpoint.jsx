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
      midpointLabelWidth: 0,
      midpointChart: null,
    }

    this.drawMidpoint = this.drawMidpoint.bind(this)
    this.getMidpointLabelWidth = this.getMidpointLabelWidth.bind(this)
  }

  componentDidMount() {
    this.drawMidpoint(this.props.orderBookKeys, this.props.sharedChartMargins, this.state.midpointLabelWidth)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(this.props.sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(this.state.midpointLabelWidth, nextState.midpointLabelWidth)
    ) {
      this.drawMidpoint(nextProps.orderBookKeys, nextProps.sharedChartMargins, nextState.midpointLabelWidth)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.midpointChart, this.state.midpointChart)) this.getMidpointLabelWidth()


  }

  getMidpointLabelWidth() { // necessary due to the use of reactFauxDom
    const midpointLabelWidth = document.getElementById('midpoint_label')

    this.setState({ midpointLabelWidth: midpointLabelWidth != null ? midpointLabelWidth.getBBox().width : 0 })
  }

  drawMidpoint(orderBookKeys, chartMargins, midpointLabelWidth) {
    if (this.midpointChart) {
      // Chart Element
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv)
        .append('svg')
        .attr('id', 'market_midpoint')

      const margin = {
        ...chartMargins,
        right: 10,
      }

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
        .attr('x2', width - midpointLabelWidth - margin.right)
        .attr('y1', () => yScale(0.5))
        .attr('y2', () => yScale(0.5))

      //  Midpoint Label
      chart.append('text')
        .attr('id', 'midpoint_label')
        .attr('x', width)
        .attr('y', yScale(0.5))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'central')
        .text(`${orderBookKeys.mid} ETH`)

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
