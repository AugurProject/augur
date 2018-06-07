import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import MarketOutcomeChartHeaderDepth from 'modules/market/components/market-outcome-charts--header-depth/market-outcome-charts--header-depth'

import { isEqual } from 'lodash'
import CustomPropTypes from 'utils/custom-prop-types'
import { createBigNumber } from 'utils/create-big-number'

import { BUY, SELL } from 'modules/transactions/constants/types'
import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'

import Styles from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth.styles'

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateChartHeaderHeight: PropTypes.func.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredDepth: PropTypes.func.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    marketMin: CustomPropTypes.bigNumber, /* required */
    marketMax: CustomPropTypes.bigNumber, /* required */
    hoveredDepth: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    headerHeight: PropTypes.number.isRequired,
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
      updateSelectedOrderProperties,
      isMobile,
    } = this.props
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      fixedPrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      isMobile,
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
      updateSelectedOrderProperties,
      isMobile,
    } = this.props
    if (
      !isEqual(marketDepth, nextProps.marketDepth) ||
      !isEqual(orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(updateHoveredPrice, nextProps.updateHoveredPrice) ||
      !isEqual(updateSelectedOrderProperties, nextProps.updateSelectedOrderProperties) ||
      fixedPrecision !== nextProps.fixedPrecision ||
      marketMin !== nextProps.marketMin ||
      marketMax !== nextProps.marketMax ||
      isMobile !== nextProps.isMobile
    ) {
      this.drawDepth({
        marketDepth: nextProps.marketDepth,
        orderBookKeys: nextProps.orderBookKeys,
        sharedChartMargins: nextProps.sharedChartMargins,
        fixedPrecision: nextProps.fixedPrecision,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
        updateHoveredPrice: nextProps.updateHoveredPrice,
        updateSelectedOrderProperties: nextProps.updateSelectedOrderProperties,
        isMobile: nextProps.isMobile,
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
        fixedPrecision: nextProps.fixedPrecision,
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
        updateSelectedOrderProperties,
        isMobile,
      } = options

      const drawParams = determineDrawParams({
        depthChart: this.depthChart,
        sharedChartMargins,
        marketDepth,
        orderBookKeys,
        fixedPrecision,
        isMobile,
        marketMax,
        marketMin,
      })

      const depthContainer = new ReactFauxDOM.Element('div')

      // padding for overflowing x-axis ticks
      const widthPadding = 30

      const depthChart = d3.select(depthContainer)
        .append('svg')
        .attr('id', 'depth_chart')
        .attr('width', drawParams.containerWidth + widthPadding)
        .attr('height', drawParams.containerHeight)

      drawTicks({
        drawParams,
        depthChart,
        orderBookKeys,
        fixedPrecision,
        marketMax,
        marketMin,
        isMobile,
      })

      drawLines({
        drawParams,
        depthChart,
        marketDepth: drawParams.newMarketDepth,
        isMobile,
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
        updateSelectedOrderProperties,
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
      updateSelectedOrderProperties,
    } = this.props
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      fixedPrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSelectedOrderProperties,
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
        fixedPrecision,
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
        const yPosition = yScale(hoveredPrice)
        const clampedHoveredPrice = yScale.invert(yPosition)

        d3.select('#crosshairY')
          .attr('x1', 0)
          .attr('y1', yScale(hoveredPrice))
          .attr('x2', containerWidth)
          .attr('y2', yScale(hoveredPrice))

        d3.select('#hovered_price_label')
          .attr('x', 0)
          .attr('y', yScale(hoveredPrice) + 12)
          .text(clampedHoveredPrice.toFixed(fixedPrecision))
      }
    }
  }

  render() {
    const {
      fixedPrecision,
      hoveredDepth,
      isMobile,
      headerHeight,
      updateChartHeaderHeight,
    } = this.props

    return (
      <section className={Styles.MarketOutcomeDepth}>
        <MarketOutcomeChartHeaderDepth
          fixedPrecision={fixedPrecision}
          hoveredDepth={hoveredDepth}
          isMobile={isMobile}
          headerHeight={headerHeight}
          updateChartHeaderHeight={updateChartHeaderHeight}
        />
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

export function nearestCompletelyFillingOrder(price, { asks = [], bids = [] }) {
  const PRICE_INDEX = 1
  const items = [
    ...asks.filter(it => it[3]).map(it => [...it, ASKS]),
    ...bids.filter(it => it[3]).map(it => [...it, BIDS]),
  ]

  let closestIndex = -1
  let closestDistance = Number.MAX_VALUE
  for (let i = 0; i < items.length; i++) {
    const dist = Math.abs(items[i][PRICE_INDEX] - price)
    if (dist < closestDistance) {
      closestIndex = i
      closestDistance = dist
    }
  }

  return closestIndex === -1 ? null : items[closestIndex]
}

function determineDrawParams(options) {
  const {
    sharedChartMargins,
    depthChart,
    marketDepth,
    orderBookKeys,
    fixedPrecision,
    isMobile,
    marketMax,
    marketMin,
  } = options

  const chartDim = {
    ...sharedChartMargins, // top, bottom
    right: 0,
    left: 0,
    stick: 5,
    tickOffset: 10,
  }


  // If spread is zero we default to market min/max.
  const marketMinMax = (orderBookKeys.max.isEqualTo(orderBookKeys.min)) ? { ...orderBookKeys, min: marketMin, max: marketMax } : orderBookKeys

  const containerWidth = depthChart.clientWidth
  const containerHeight = depthChart.clientHeight
  const drawHeight = containerHeight - chartDim.top - chartDim.bottom

  const xDomain = Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[0].toNumber()], [])], [0])

  // Determine bounding diff
  const maxDiff = createBigNumber(marketMinMax.mid.minus(marketMinMax.max).toPrecision(15)).absoluteValue() // NOTE -- toPrecision to address an error when attempting to get the absolute value
  const minDiff = createBigNumber(marketMinMax.mid.minus(marketMinMax.min).toPrecision(15)).absoluteValue()

  let boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

  const yDomain = [
    createBigNumber(marketMinMax.mid.minus(boundDiff).toFixed(fixedPrecision)).toNumber(),
    createBigNumber(marketMinMax.mid.plus(boundDiff).toFixed(fixedPrecision)).toNumber(),
  ]

  boundDiff = boundDiff.toNumber()

  const xScale = d3.scaleLinear()
    .domain(isMobile ? d3.extent(xDomain).sort((a, b) => b - a) : d3.extent(xDomain))
    .range([chartDim.left, containerWidth - chartDim.right - 1])

  const yScale = d3.scaleLinear()
    .clamp(true)
    .domain(d3.extent(yDomain))
    .range([containerHeight - chartDim.bottom, chartDim.top])

  const newMarketDepth = {
    asks: [...marketDepth.asks],
    bids: [...marketDepth.bids],
  }


  if (newMarketDepth.asks.length > 0 && marketMax) {
    const askToCopy = newMarketDepth.asks[newMarketDepth.asks.length - 1]
    if (askToCopy[1] !== marketMax.toNumber()) {
      newMarketDepth.asks.push([askToCopy[0], marketMax, askToCopy[2], false])
    }
  }

  if (newMarketDepth.bids.length > 0 && marketMin) {
    const bidToCopy = newMarketDepth.bids[newMarketDepth.bids.length - 1]
    if (bidToCopy[1] !== marketMin.toNumber()) {
      newMarketDepth.bids.push([bidToCopy[0], marketMin, bidToCopy[2], false])
    }
  }

  return {
    containerWidth,
    containerHeight,
    drawHeight,
    chartDim,
    newMarketDepth,
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
    isMobile,
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
  if (!isMobile) {
    depthChart.append('text')
      .attr('class', 'tick-value')
      .attr('x', 0)
      .attr('y', drawParams.yScale(orderBookKeys.mid))
      .attr('dx', 0)
      .attr('dy', drawParams.chartDim.tickOffset)
      .text(orderBookKeys.mid && orderBookKeys.mid.toFixed(fixedPrecision))
  }

  //  Offset Ticks
  const offsetTicks = drawParams.yDomain.map((d, i) => { // Assumes yDomain is [min, max]
    if (i === 0) {
      const value = d + (drawParams.boundDiff / 4)
      if (value < 0) return 0
    }
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
      .attr('dx', 50)
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
      .attr('dx', 50)
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
    isMobile,
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
    .curve(d3.curveStepBefore)
    .x(d => drawParams.xScale(d[0]))
    .y(d => drawParams.yScale(d[1]))

  Object.keys(marketDepth).forEach((side) => {
    depthChart.append('path')
      .data([marketDepth[side]])
      .attr('class', `depth-line outcome-line-${side}`)
      .attr('d', depthLine)
  })

  const area = d3.area()
    .curve(d3.curveStepBefore)
    .x0(d => (isMobile ? drawParams.xScale(d[0]) : 0))
    .x1(d => (isMobile ? d3.extent(drawParams.xDomain)[1] : drawParams.xScale(d[0])))
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
    updateSelectedOrderProperties,
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
        updateSelectedOrderProperties({
          selectedNav: orderPrice > orderBookKeys.mid ? BUY : SELL,
          orderPrice: nearestFillingOrder[1],
          orderQuantity: nearestFillingOrder[0],
        })
      }
    })
}
