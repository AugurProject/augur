import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { isEqual } from 'lodash'

import { ASKS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    marketDepth: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredDepth: PropTypes.func.isRequired,
    hoveredPrice: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      chartWidth: 0,
      chartHeight: 0,
      yScale: null,
      xScale: null
    }

    this.drawChart = this.drawChart.bind(this)
    this.drawCrosshairs = this.drawCrosshairs.bind(this)
  }

  componentDidMount() {
    this.drawChart(this.props.marketDepth)

    window.addEventListener('resize', this.drawChart)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.marketDepth, this.props.marketDepth)) this.drawChart()

    if (!isEqual(prevProps.hoveredPrice, this.props.hoveredPrice)) this.drawCrosshairs()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart)
  }

  drawChart() {
    if (this.depthChart) {
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv)
        .append('svg')
        .attr('id', 'outcome_depth')

      // Defs
      const chartDefs = chart.append('defs')

      //  Fills
      const subtleGradient = chartDefs.append('linearGradient')
        .attr('id', 'subtleGradient')

      subtleGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0')

      subtleGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1')

      const margin = {
        top: 0,
        right: 0,
        bottom: 30,
        left: 0,
        stick: 5,
        tickOffset: 10
      }

      const { marketDepth } = this.props
      const width = this.depthChart.clientWidth
      const height = this.depthChart.clientHeight

      chart.attr('id', 'outcome_depth')

      chart.attr('width', width)
      chart.attr('height', height)

      const xDomain = Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[0]], [])], [])

      // Ensure yDomain always has midmarket price at the center
      // TODO -- can probably clean this up...is a copy/paste from an older implementation
      // Can only use odd numbered intervals so midpoint is always centered
      const intervals = 5
      const allowedFloat = 2 // TODO -- set this to the precision

      // Determine bounding diff
      const maxDiff = Math.abs(this.props.orderBookKeys.mid - this.props.orderBookKeys.max)
      const minDiff = Math.abs(this.props.orderBookKeys.mid - this.props.orderBookKeys.min)
      const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

      // Set interval step
      const step = boundDiff / ((intervals - 1) / 2)

      const yDomain = new Array(intervals).fill(null).reduce((p, _unused, i) => {
        if (i === 0) return [Number((this.props.orderBookKeys.mid - boundDiff).toFixed(allowedFloat))]
        if (i + 1 === Math.round(intervals / 2)) return [...p, this.props.orderBookKeys.mid]
        return [...p, Number((p[i - 1] + step).toFixed(allowedFloat))]
      }, [])

      // const yDomain = Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[1]], [])], [])

      const xScale = d3.scaleLinear()
        .domain(d3.extent(xDomain))
        .range([margin.left, width - margin.right - 1])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(yDomain))
        .range([height - margin.bottom, margin.top])

      const depthLine = d3.line()
        .curve(d3.curveStepAfter)
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))

      Object.keys(marketDepth).forEach((side) => {
        chart.append('path')
          .data([marketDepth[side]])
          .attr('class', `depth-line outcome-line-${side}`)
          .attr('d', depthLine)
      })

      const area = d3.area()
        .curve(d3.curveStepAfter)
        .x0(0)
        .x1(d => xScale(d[0]))
        .y(d => yScale(d[1]))

      Object.keys(marketDepth).forEach((side) => {
        chart.append('path')
          .data([marketDepth[side]])
          .classed('filled-subtle', true)
          .attr('d', area)
      })

      chart.append('text')
        .attr('id', 'hovered_price_label')

      // create crosshairs
      const crosshair = chart.append('g')
        .attr('id', 'crosshairs')
        .attr('class', 'line')
        .attr('style', { display: 'none' })

      // create horizontal line
      crosshair.append('line')
        .attr('id', 'crosshairX')
        .attr('class', 'crosshair')

      // create vertical line
      crosshair.append('line')
        .attr('id', 'crosshairY')
        .attr('class', 'crosshair')

      chart.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', () => d3.select('#crosshairs').style('display', null))
        .on('mouseout', () => this.props.updateHoveredPrice(null))
        .on('mousemove', () => {
          const mouse = d3.mouse(d3.select('#outcome_depth').node())

          // Draw crosshairs
          // const y = mouse[1]

          // Determine closest order
          const hoveredPrice = this.state.yScale.invert(mouse[1])

          this.props.updateHoveredPrice(hoveredPrice)
        })
        .on('click', () => {
          console.log('TODO -- fill order form')
        })

      this.setState({
        yScale,
        xScale,
        chart: fauxDiv.toReact(),
        chartWidth: width,
        chartHeight: height
      })
    }
  }

  drawCrosshairs() {
    if (this.props.hoveredPrice == null) {
      d3.select('#crosshairs').style('display', 'none')
      d3.select('#hovered_price_label').text('')
      this.props.updateHoveredDepth([])
    } else {
      const nearestCompletelyFillingOrder = Object.keys(this.props.marketDepth).reduce((p, side) => {
        let fillingSideOrder = this.props.marketDepth[side].reduce((p, order) => {
          if (p === null) return order
          if (side === ASKS) {
            return (this.props.hoveredPrice > p[1] && this.props.hoveredPrice < order[1]) ? order: p
          }

          return (this.props.hoveredPrice < p[1] && this.props.hoveredPrice > order[1]) ? order : p
        }, null)

        if (p === null) return fillingSideOrder

        if (fillingSideOrder == null) {
          fillingSideOrder = [side]
        } else {
          fillingSideOrder.push(side)
        }
        return Math.abs(this.props.hoveredPrice - p[1]) < Math.abs(this.props.hoveredPrice - fillingSideOrder[1]) ? p : fillingSideOrder
      }, null)

      if (nearestCompletelyFillingOrder === null) return

      this.props.updateHoveredDepth(nearestCompletelyFillingOrder)

      d3.select('#crosshairs').style('display', null)

      d3.select('#crosshairX')
        .attr('x1', this.state.xScale(nearestCompletelyFillingOrder[0]))
        .attr('y1', 0)
        .attr('x2', this.state.xScale(nearestCompletelyFillingOrder[0]))
        .attr('y2', this.state.chartHeight)
      d3.select('#crosshairY')
        .attr('x1', 0)
        .attr('y1', this.state.yScale(this.props.hoveredPrice))
        .attr('x2', this.state.chartWidth)
        .attr('y2', this.state.yScale(this.props.hoveredPrice))
      d3.select('#hovered_price_label')
        .attr('x', 0)
        .attr('y', this.state.yScale(this.props.hoveredPrice) + 12)
        .text(this.props.hoveredPrice)
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
