import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { isEqual } from 'lodash'

import Styles from 'modules/market/components/market-outcome-depth/market-outcome-depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    marketDepth: PropTypes.object.isRequired,
    hoveredPrice: PropTypes.any,
    updateHoveredPrice: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null
    }

    this.drawChart = this.drawChart.bind(this)
  }

  componentDidMount() {
    this.drawChart()

    window.addEventListener('resize', this.drawChart)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.marketDepth, this.props.marketDepth)) this.updateGraph()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart)
  }

  drawChart() {
    if (this.depthChart) {
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv).append('svg')

      const marketDepth = this.props.marketDepth

      console.log('marketDepth -- ', marketDepth)

      const margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        stick: 5,
        tickOffset: 10
      }

      const width = this.depthChart.clientWidth
      const height = this.depthChart.clientHeight

      chart.attr('id', 'outcome_depth')

      chart.attr('width', width)
      chart.attr('height', height)

      const xDomain = Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[0]], [])], [])
      const yDomain = Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[1]], [])], [])

      console.log('xDomain -- ', xDomain)

      const xScale = d3.scaleTime()
        .domain(d3.extent(xDomain))
        .range([margin.left, width - margin.right - 1])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(yDomain))
        .range([height - margin.bottom, margin.top])

      const depthLine = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))

      Object.keys(marketDepth).forEach((side) => {
        chart.append('path')
          .data([marketDepth[side]])
          .attr('class', `depth-line outcome-line-${side}`)
          .attr('d', depthLine)
      })

      const area = d3.area()
        .x0(0)
        .x1(d => xScale(d[0]))
        .y(d => yScale(d[1]))

      Object.keys(marketDepth).forEach((side) => {
        chart.append('path')
          .data([marketDepth[side]])
          .attr('class', `depth-fill`)
          .attr('d', area)
      })

      this.setState({ chart: fauxDiv.toReact() })
    }
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeDepth}>
        <div
          ref={(depthChart) => { this.depthChart = depthChart }}
          className={Styles.MarketOutcomeDepth__chart}
        >
          {this.state.chart}
        </div>
      </section>
    )
  }
}
