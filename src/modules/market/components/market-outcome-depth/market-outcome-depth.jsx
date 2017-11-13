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

      // const xDomain = priceHistory.reduce((p, dataPoint) => [...p, dataPoint.x], [])
      // const yDomain = priceHistory.reduce((p, dataPoint) => [...p, dataPoint.high, dataPoint.low], [])
      //
      // const xScale = d3.scaleTime()
      //   .domain(d3.extent(xDomain))
      //   .range([margin.left, width - margin.right - 1])
      //
      // const yScale = d3.scaleLinear()
      //   .domain(d3.extent(yDomain))
      //   .range([height - margin.bottom, margin.top])
      //
      // chart.selectAll('line')
      //   .data(new Array(4))
      //   .enter()
      //   .append('line')
      //   .attr('class', 'tick-line')
      //   .attr('x1', 0)
      //   .attr('x2', width)
      //   .attr('y1', (d, i) => ((height - margin.bottom) / 4) * i)
      //   .attr('y2', (d, i) => ((height - margin.bottom) / 4) * i)
      //
      // chart.selectAll('text')
      //   .data(new Array(4))
      //   .enter()
      //   .append('text')
      //   .attr('class', 'tick-value')
      //   .attr('x', 0)
      //   .attr('y', (d, i) => ((height - margin.bottom) / 4) * i)
      //   .attr('dy', margin.tickOffset)
      //   .attr('dx', 0)
      //   .text((d, i) => {
      //     if (i) {
      //       return parseFloat(yScale.invert(((height - margin.bottom) / 4) * i)).toFixed(2)
      //     }
      //   })
      //
      // chart.append('g')
      //   .attr('class', 'outcomes-axis')
      //   .attr('transform', `translate(0, ${height - margin.bottom})`)
      //   .call(d3.axisBottom(xScale))
      //
      // // chart.append('g')
      // //   .attr('class', 'outcomes-axis')
      // //   .attr('transform', `translate(${margin.left}, 0)`)
      // //   .call(d3.axisLeft(yScale))
      //
      // chart.selectAll('rect')
      //   .data(priceHistory)
      //   .enter().append('svg:rect')
      //   .attr('x', d => xScale(d.x))
      //   .attr('y', d => yScale(d3.max([d.open, d.close])))
      //   .attr('height', d => yScale(d3.min([d.open, d.close])) - yScale(d3.max([d.open, d.close])))
      //   .attr('width', d => (0.5 * (width - (2 * margin.stick))) / priceHistory.length)
      //   .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow
      //
      // chart.selectAll('line.stem')
      //   .data(priceHistory)
      //   .enter().append('svg:line')
      //   .attr('class', 'stem')
      //   .attr('x1', d => xScale(d.x) + (0.25 * ((width - (2 * margin.stick)) / priceHistory.length)))
      //   .attr('x2', d => xScale(d.x) + (0.25 * ((width - (2 * margin.stick)) / priceHistory.length)))
      //   .attr('y1', d => yScale(d.high))
      //   .attr('y2', d => yScale(d.low))
      //   .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow

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
