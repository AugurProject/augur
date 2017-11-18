import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import MarketOutcomeDepthHeader from 'modules/market/components/market-outcome-depth/market-outcome-depth-header'

import { isEqual } from 'lodash'

import { ASKS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-depth/market-outcome-depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    marketDepth: PropTypes.object.isRequired,
    orderBookMin: PropTypes.number.isRequired,
    orderBookMid: PropTypes.number.isRequired,
    orderBookMax: PropTypes.number.isRequired,
    hoveredPrice: PropTypes.any,
    updateHoveredPrice: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      hoveredDepth: []
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

      const marketDepth = this.props.marketDepth

      const margin = {
        top: 0,
        right: 0,
        bottom: 30,
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

      // Ensure yDomain always has midmarket price at the center
      // TODO -- can probably clean this up...is a copy/paste from an older implementation
      // Can only use odd numbered intervals so midpoint is always centered
      const intervals = 5
      const allowedFloat = 2 // TODO -- set this to the precision

      // Determine bounding diff
      const maxDiff = Math.abs(this.props.orderBookMid - this.props.orderBookMax)
      const minDiff = Math.abs(this.props.orderBookMid - this.props.orderBookMin)
      const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

      // Set interval step
      const step = boundDiff / ((intervals - 1) / 2)

      const yDomain = new Array(intervals).fill(null).reduce((p, _unused, i) => {
        if (i === 0) return [Number((this.props.orderBookMid - boundDiff).toFixed(allowedFloat))]
        if (i + 1 === Math.round(intervals / 2)) return [...p, this.props.orderBookMid]
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

      // Mouse Events
      // chart.on('mousemove', () => {
      //   const pos = d3.mouse(d3.select('#outcome_depth').node())
      //   const xValue = xScale.invert(pos[0])
      //   const yValue = yScale.invert(pos[1])
      //
      //   console.log(xValue, yValue)
      // })

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
        .on('mouseout', () => {
          this.setState({ hoveredDepth: [] })
          d3.select('#crosshairs').style('display', 'none')
          d3.select('#hovered_price_label').text('')
        })
        .on('mousemove', () => {
          const mouse = d3.mouse(d3.select('#outcome_depth').node())

          // Draw crosshairs
          const y = mouse[1]

          d3.select('#crosshairY')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', width)
            .attr('y2', y)

          // Determine closest order
          const yValue = yScale.invert(mouse[1])

          const nearestCompletelyFillingOrder = Object.keys(marketDepth).reduce((p, side) => {
            const fillingSideOrder = marketDepth[side].reduce((p, order) => {
              if (p === null) return order
              if (side === ASKS) {
                return (yValue > p[1] && yValue < order[1]) ? order : p
              }

              return (yValue < p[1] && yValue > order[1]) ? order : p
            }, null)

            fillingSideOrder.push(side)

            // We actually infer the side based on proximity
            if (p === null) return fillingSideOrder
            return Math.abs(yValue - p[1]) < Math.abs(yValue - fillingSideOrder[1]) ? p : fillingSideOrder
          }, null)

          d3.select('#crosshairX')
            .attr('x1', xScale(nearestCompletelyFillingOrder[0]))
            .attr('y1', 0)
            .attr('x2', xScale(nearestCompletelyFillingOrder[0]))
            .attr('y2', height)

          d3.select('#hovered_price_label')
          .attr('x', 0)
          .attr('y', y + 12)
          .text(yValue)

          this.setState({ hoveredDepth: nearestCompletelyFillingOrder })
        })
        .on('click', () => {
          console.log('TODO -- fill order form')
        })

      this.setState({ chart: fauxDiv.toReact() })
    }
  }

  render() {
    const s = this.state

    return (
      <section className={Styles.MarketOutcomeDepth}>
        <MarketOutcomeDepthHeader
          side={s.hoveredDepth[3]}
          price={s.hoveredDepth[1]}
          quantity={s.hoveredDepth[2]}
        />
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
