import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { isEqual } from 'lodash'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object.isRequired,
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
      depthContainer: null,
      containerWidth: 0,
      containerHeight: 0,
      yScale: null,
      xScale: null,
    }

    this.drawDepth = this.drawDepth.bind(this)
    this.drawDepthOnResize = this.drawDepthOnResize.bind(this)
    this.drawCrosshairs = this.drawCrosshairs.bind(this)
  }

  componentDidMount() {
    const {
      fixedPrecision,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    } = this.props
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      fixedPrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    })

    window.addEventListener('resize', this.drawDepthOnResize)
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      fixedPrecision,
      hoveredPrice,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    } = this.props
    if (
      !isEqual(marketDepth, nextProps.marketDepth) ||
      !isEqual(orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(updateHoveredPrice, nextProps.updateHoveredPrice) ||
      !isEqual(updateSeletedOrderProperties, nextProps.updateSeletedOrderProperties) ||
      fixedPrecision !== nextProps.fixedPrecision ||
      marketMin !== nextProps.marketMin ||
      marketMax !== nextProps.marketMax
    ) {
      this.drawDepth({
        marketDepth: nextProps.marketDepth,
        orderBookKeys: nextProps.orderBookKeys,
        sharedChartMargins: nextProps.sharedChartMargins,
        fixedPrecision: nextProps.fixedPrecision,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
        updateHoveredPrice: nextProps.updateHoveredPrice,
        updateSeletedOrderProperties: nextProps.updateSeletedOrderProperties,
      })
    }

    if (
      !isEqual(hoveredPrice, nextProps.hoveredPrice) ||
      !isEqual(marketDepth, nextProps.marketDepth) ||
      !isEqual(this.state.yScale, nextState.yScale) ||
      !isEqual(this.state.xScale, nextState.xScale) ||
      !isEqual(this.state.containerHeight, nextState.containerHeight) ||
      !isEqual(this.state.containerWidth, nextState.containerWidth) ||
      marketMin !== nextProps.marketMin ||
      marketMax !== nextProps.marketMax
    ) {
      this.drawCrosshairs({
        hoveredPrice: nextProps.hoveredPrice,
        marketDepth: nextProps.marketDepth,
        yScale: nextState.yScale,
        xScale: nextState.xScale,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
        containerHeight: nextState.containerHeight,
        containerWidth: nextState.containerWidth,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawDepthOnResize)
  }

  drawDepth(options) {
    if (this.depthChart) {
      const {
        marketDepth,
        orderBookKeys,
        sharedChartMargins,
        fixedPrecision,
        marketMin,
        marketMax,
        updateHoveredPrice,
        updateSeletedOrderProperties,
      } = options

      const drawParams = determineDrawParams({
        depthChart: this.depthChart,
        sharedChartMargins,
        marketDepth,
        orderBookKeys,
        fixedPrecision,
      })

      const depthContainer = new ReactFauxDOM.Element('div')

      const depthChart = d3.select(depthContainer)
        .append('svg')
        .attr('id', 'depth_chart')
        .attr('width', drawParams.containerWidth)
        .attr('height', drawParams.containerHeight)

      drawTicks({
        drawParams,
        depthChart,
        orderBookKeys,
        fixedPrecision,
        marketMax,
      })

      drawLines({
        drawParams,
        depthChart,
        marketDepth,
      })

      setupCrosshairs({
        drawParams,
        depthChart,
      })

      attachHoverClickHandlers({
        drawParams,
        depthChart,
        marketDepth,
        orderBookKeys,
        fixedPrecision,
        marketMin,
        marketMax,
        updateHoveredPrice,
        updateSeletedOrderProperties,
      })

      this.setState({
        depthContainer: depthContainer.toReact(),
        yScale: drawParams.yScale,
        xScale: drawParams.xScale,
        containerWidth: drawParams.containerWidth,
        containerHeight: drawParams.containerHeight,
      })
    }
  }

  drawDepthOnResize() {
    const {
      fixedPrecision,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    } = this.props
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      fixedPrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    })
  }

  drawCrosshairs(options) {
    const { updateHoveredDepth } = this.props
    if (this.depthChart) {
      const {
        hoveredPrice,
        marketDepth,
        xScale,
        yScale,
        containerHeight,
        containerWidth,
        marketMin,
        marketMax,
      } = options

      if (hoveredPrice == null) {
        d3.select('#crosshairs').style('display', 'none')
        d3.select('#hovered_price_label').text('')
        updateHoveredDepth([])
      } else {
        const nearestFillingOrder = nearestCompletelyFillingOrder(hoveredPrice, marketDepth)

        if (nearestFillingOrder === null) return

        updateHoveredDepth(nearestFillingOrder)

        d3.select('#crosshairs').style('display', null)

        if (
          hoveredPrice > marketMin &&
          hoveredPrice < marketMax
        ) {
          d3.select('#crosshairX')
            .attr('x1', xScale(nearestFillingOrder[0]))
            .attr('y1', 0)
            .attr('x2', xScale(nearestFillingOrder[0]))
            .attr('y2', containerHeight)
            .style('display', null)
        } else {
          d3.select('#crosshairX')
            .style('display', 'none')
        }

        d3.select('#crosshairY')
          .attr('x1', 0)
          .attr('y1', yScale(hoveredPrice))
          .attr('x2', containerWidth)
          .attr('y2', yScale(hoveredPrice))

        d3.select('#hovered_price_label')
          .attr('x', 0)
          .attr('y', yScale(hoveredPrice) + 12)
          .text(hoveredPrice)
      }
    }
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeDepth}>
        <div
          ref={(depthChart) => { this.depthChart = depthChart }}
          className={Styles.MarketOutcomeDepth__container}
        >
          {this.state.depthContainer}
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
        return (price > p[1] && price < order[1]) ? [...order, ASKS] : p
      }

      return (price < p[1] && price > order[1]) ? [...order, BIDS] : p
    }, null)

    if (p === null) return fillingSideOrder

    if (fillingSideOrder == null) return p

    return Math.abs(price - p[1]) < Math.abs(price - fillingSideOrder[1]) ? p : fillingSideOrder
  }, null)
}

function determineDrawParams(options) {
  const {
    sharedChartMargins,
    depthChart,
    marketDepth,
    orderBookKeys,
    fixedPrecision,
  } = options

  const chartDim = {
    ...sharedChartMargins, // top, bottom
    right: 0,
    left: 0,
    stick: 5,
    tickOffset: 10,
  }

  const containerWidth = depthChart.clientWidth
  const containerHeight = depthChart.clientHeight
  const drawHeight = containerHeight - chartDim.top - chartDim.bottom

  const xDomain = Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[0]], [])], [])

  // Determine bounding diff
  const maxDiff = Math.abs(orderBookKeys.mid - orderBookKeys.max)
  const minDiff = Math.abs(orderBookKeys.mid - orderBookKeys.min)
  const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

  const yDomain = [
    Number((orderBookKeys.mid - boundDiff).toFixed(fixedPrecision)),
    Number((orderBookKeys.mid + boundDiff).toFixed(fixedPrecision)),
  ]

  const xScale = d3.scaleLinear()
    .domain(d3.extent(xDomain))
    .range([chartDim.left, containerWidth - chartDim.right - 1])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(yDomain))
    .range([containerHeight - chartDim.bottom, chartDim.top])

  return {
    containerWidth,
    containerHeight,
    drawHeight,
    chartDim,
    xDomain,
    yDomain,
    boundDiff,
    xScale,
    yScale,
  }
}

function drawTicks(options) {
  const {
    drawParams,
    depthChart,
    orderBookKeys,
    fixedPrecision,
    marketMin,
    marketMax,
  } = options

  // Y Axis
  //  Chart Bounds
  depthChart.append('g')
    .attr('id', 'depth_chart_bounds')
    .selectAll('line')
    .data(new Array(2))
    .enter()
    .append('line')
    .attr('class', 'bounding-line')
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', (d, i) => ((drawParams.containerHeight - drawParams.chartDim.bottom)) * i)
    .attr('y2', (d, i) => ((drawParams.containerHeight - drawParams.chartDim.bottom)) * i)

  //  Midpoint Label
  depthChart.append('text')
    .attr('class', 'tick-value')
    .attr('x', 0)
    .attr('y', drawParams.yScale(orderBookKeys.mid))
    .attr('dx', 0)
    .attr('dy', drawParams.chartDim.tickOffset)
    .text(orderBookKeys.mid && orderBookKeys.mid.toFixed(fixedPrecision))

  //  Offset Ticks
  const offsetTicks = drawParams.yDomain.map((d, i) => { // Assumes yDomain is [min, max]
    if (i === 0) return d + (drawParams.boundDiff / 4)
    return d - (drawParams.boundDiff / 4)
  })

  const yTicks = depthChart.append('g')
    .attr('id', 'depth_y_ticks')

  yTicks.selectAll('line')
    .data(offsetTicks)
    .enter()
    .append('line')
    .attr('class', 'tick-line')
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', d => drawParams.yScale(d))
    .attr('y2', d => drawParams.yScale(d))
  yTicks.selectAll('text')
    .data(offsetTicks)
    .enter()
    .append('text')
    .attr('class', 'tick-value')
    .attr('x', 0)
    .attr('y', d => drawParams.yScale(d))
    .attr('dx', 0)
    .attr('dy', drawParams.chartDim.tickOffset)
    .text(d => d.toFixed(fixedPrecision))

  //  Min/Max Boundary Lines
  const rangeBounds = depthChart.append('g')
    .attr('id', 'depth_range_bounds')

  if (drawParams.yDomain[0] < marketMin) {
    rangeBounds.append('line')
      .attr('class', 'tick-line')
      .attr('x1', 0)
      .attr('x2', drawParams.containerWidth)
      .attr('y1', () => drawParams.yScale(orderBookKeys.min))
      .attr('y2', () => drawParams.yScale(orderBookKeys.min))

    rangeBounds.append('text')
      .attr('class', 'tick-value')
      .attr('x', 0)
      .attr('y', d => drawParams.yScale(orderBookKeys.min))
      .attr('dx', 0)
      .attr('dy', drawParams.chartDim.tickOffset)
      .text('min')

    rangeBounds.append('rect')
      .attr('class', 'bounding-box')
      .attr('x', 0)
      .attr('y', () => drawParams.yScale(orderBookKeys.min))
      .attr('height', drawParams.drawHeight - drawParams.yScale(orderBookKeys.min))
      .attr('width', drawParams.containerWidth)

  } else if (drawParams.yDomain[drawParams.yDomain.length - 1] > marketMax) {
    rangeBounds.append('line')
      .attr('class', 'tick-line')
      .attr('x1', 0)
      .attr('x2', drawParams.containerWidth)
      .attr('y1', () => drawParams.yScale(orderBookKeys.max))
      .attr('y2', () => drawParams.yScale(orderBookKeys.max))

    rangeBounds.append('text')
      .attr('class', 'tick-value')
      .attr('x', 0)
      .attr('y', d => drawParams.yScale(orderBookKeys.max))
      .attr('dx', 0)
      .attr('dy', drawParams.chartDim.tickOffset)
      .text('max')

    rangeBounds.append('rect')
      .attr('class', 'bounding-box')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', drawParams.yScale(orderBookKeys.max))
      .attr('width', drawParams.containerWidth)
  }

  // X Axis
  depthChart.append('g')
    .attr('id', 'depth-x-axis')
    .attr('transform', `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`)
    .call(d3.axisBottom(drawParams.xScale)
      .ticks(3))
    .select('path').remove()
}

function drawLines(options) {
  const {
    drawParams,
    depthChart,
    marketDepth,
  } = options

  // Defs
  const chartDefs = depthChart.append('defs')

  //  Fills
  const subtleGradient = chartDefs.append('linearGradient')
    .attr('id', 'subtleGradient')

  subtleGradient.append('stop')
    .attr('class', 'stop-left')
    .attr('offset', '0')

  subtleGradient.append('stop')
    .attr('class', 'stop-right')
    .attr('offset', '1')

  // Depth Line
  const depthLine = d3.line()
    .curve(d3.curveStepAfter)
    .x(d => drawParams.xScale(d[0]))
    .y(d => drawParams.yScale(d[1]))

  Object.keys(marketDepth).forEach((side) => {
    depthChart.append('path')
      .data([marketDepth[side]])
      .attr('class', `depth-line outcome-line-${side}`)
      .attr('d', depthLine)
  })

  const area = d3.area()
    .curve(d3.curveStepAfter)
    .x0(0)
    .x1(d => drawParams.xScale(d[0]))
    .y(d => drawParams.yScale(d[1]))

  Object.keys(marketDepth).forEach((side) => {
    depthChart.append('path')
      .data([marketDepth[side]])
      .classed('filled-subtle', true)
      .attr('d', area)
  })
}

function setupCrosshairs(options) {
  const {
    depthChart,
  } = options

  depthChart.append('text')
    .attr('id', 'hovered_price_label')

  // create crosshairs
  const crosshair = depthChart.append('g')
    .attr('id', 'crosshairs')
    .attr('class', 'line')
    .style('display', 'none')

  // X Crosshair
  crosshair.append('line')
    .attr('id', 'crosshairX')
    .attr('class', 'crosshair')
    .style('display', 'none')

  // Y Crosshair
  crosshair.append('line')
    .attr('id', 'crosshairY')
    .attr('class', 'crosshair')
}

function attachHoverClickHandlers(options) {
  const {
    drawParams,
    depthChart,
    marketDepth,
    orderBookKeys,
    fixedPrecision,
    marketMin,
    marketMax,
    updateHoveredPrice,
    updateSeletedOrderProperties,
  } = options

  depthChart.append('rect')
    .attr('class', 'overlay')
    .attr('width', drawParams.containerWidth)
    .attr('height', drawParams.containerHeight)
    .on('mouseover', () => d3.select('#crosshairs').style('display', null))
    .on('mouseout', () => updateHoveredPrice(null))
    .on('mousemove', () => {
      const mouse = d3.mouse(d3.select('#depth_chart').node())

      // Determine closest order
      const hoveredPrice = drawParams.yScale.invert(mouse[1]).toFixed(fixedPrecision)

      updateHoveredPrice(hoveredPrice)
    })
    .on('click', () => {
      const mouse = d3.mouse(d3.select('#depth_chart').node())
      const orderPrice = drawParams.yScale.invert(mouse[1]).toFixed(fixedPrecision)
      const nearestFillingOrder = nearestCompletelyFillingOrder(orderPrice, marketDepth)

      if (
        nearestFillingOrder != null &&
        orderPrice > marketMin &&
        orderPrice < marketMax
      ) {
        updateSeletedOrderProperties({
          selectedNav: orderPrice > orderBookKeys.mid ? BUY : SELL,
          orderPrice: nearestFillingOrder[1],
          orderQuantity: nearestFillingOrder[0],
        })
      }
    })
}
