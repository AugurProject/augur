import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { isEqual } from 'lodash'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { ASKS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    marketDepth: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredDepth: PropTypes.func.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    marketMin: PropTypes.number.isRequired,
    marketMax: PropTypes.number.isRequired,
    hoveredPrice: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      chartWidth: 0,
      chartHeight: 0,
      yScale: null,
      xScale: null,
    }

    this.drawChart = this.drawChart.bind(this)
    this.drawCrosshairs = this.drawCrosshairs.bind(this)
  }

  componentDidMount() {
    this.drawChart(this.props.marketDepth, this.props.orderBookKeys)

    window.addEventListener('resize', () => this.drawChart(this.props.marketDepth, this.props.orderBookKeys))
  }

  componentWillReceiveProps(nextProps) {
    if (
      !isEqual(this.props.marketDepth, nextProps.marketDepth) ||
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys)
    ) {
      this.drawChart(nextProps.marketDepth, nextProps.orderBookKeys)
    }

    if (
      !isEqual(this.props.hoveredPrice, nextProps.hoveredPrice) ||
      !isEqual(this.props.marketDepth, nextProps.marketDepth)
    ) {
      this.drawCrosshairs(nextProps.hoveredPrice, nextProps.marketDepth)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart)
  }

  drawChart(marketDepth, orderBookKeys) {
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
        tickOffset: 10,
      }

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
      const maxDiff = Math.abs(orderBookKeys.mid - orderBookKeys.max)
      const minDiff = Math.abs(orderBookKeys.mid - orderBookKeys.min)
      const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

      // Set interval step
      const step = boundDiff / ((intervals - 1) / 2)

      const yDomain = new Array(intervals).fill(null).reduce((p, _unused, i) => {
        if (i === 0) return [Number((orderBookKeys.mid - boundDiff).toFixed(allowedFloat))]
        if (i + 1 === Math.round(intervals / 2)) return [...p, orderBookKeys.mid]
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
          const hoveredPrice = this.state.yScale.invert(mouse[1]).toFixed(this.props.fixedPrecision)

          this.props.updateHoveredPrice(hoveredPrice)
        })
        .on('click', () => {
          const mouse = d3.mouse(d3.select('#outcome_depth').node())
          const orderPrice = this.state.yScale.invert(mouse[1]).toFixed(this.props.fixedPrecision)
          const nearestFillingOrder = nearestCompletelyFillingOrder(orderPrice, marketDepth)

          if (
            orderPrice > this.props.marketMin &&
            orderPrice < this.props.marketMax
          ) {
            this.props.updateSeletedOrderProperties({
              selectedNav: orderPrice > orderBookKeys.mid ? BUY : SELL,
              orderPrice: nearestFillingOrder[1],
              orderQuantity: nearestFillingOrder[0],
            })
          }
        })

      this.setState({
        yScale,
        xScale,
        chart: fauxDiv.toReact(),
        chartWidth: width,
        chartHeight: height,
      })
    }
  }

  drawCrosshairs(price, marketDepth) {
    if (price == null) {
      d3.select('#crosshairs').style('display', 'none')
      d3.select('#hovered_price_label').text('')
      this.props.updateHoveredDepth([])
    } else {
      const nearestFillingOrder = nearestCompletelyFillingOrder(price, marketDepth)

      if (nearestFillingOrder === null) return

      this.props.updateHoveredDepth(nearestFillingOrder)

      d3.select('#crosshairs').style('display', null)

      d3.select('#crosshairY')
        .attr('x1', 0)
        .attr('y1', this.state.yScale(price))
        .attr('x2', this.state.chartWidth)
        .attr('y2', this.state.yScale(price))

      d3.select('#hovered_price_label')
        .attr('x', 0)
        .attr('y', this.state.yScale(price) + 12)
        .text(price)

      d3.select('#crosshairX')
        .attr('x1', this.state.xScale(nearestFillingOrder[0]))
        .attr('y1', 0)
        .attr('x2', this.state.xScale(nearestFillingOrder[0]))
        .attr('y2', this.state.chartHeight)
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

function nearestCompletelyFillingOrder(price, marketDepth) {
  return Object.keys(marketDepth).reduce((p, side) => {

    const fillingSideOrder = marketDepth[side].reduce((p, order) => {
      if (p === null) return order
      if (side === ASKS) {
        return (price > p[1] && price < order[1]) ? order: p
      }

      return (price < p[1] && price > order[1]) ? order : p
    }, null)

    if (p === null) return fillingSideOrder

    if (fillingSideOrder == null) return p

    return Math.abs(price - p[1]) < Math.abs(price - fillingSideOrder[1]) ? p : fillingSideOrder
  }, null)
}
