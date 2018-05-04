import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import Styles from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles'

import { isEqual } from 'lodash'

export default class MarketOutcomeMidpoint extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    chartWidths: PropTypes.object.isRequired,
    headerHeight: PropTypes.number.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    sharedChartMargins: PropTypes.object.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    hasPriceHistory: PropTypes.bool,
    excludeCandlestick: PropTypes.bool,
  }

  constructor(props) {
    super(props)

    this.state = {
      midpointLabelWidth: 0,
      candleNullMessageWidth: 0,
      midpointContainer: null,
    }

    this.drawMidpoint = this.drawMidpoint.bind(this)
    this.getMidpointLabelWidth = this.getMidpointLabelWidth.bind(this)
  }

  componentDidMount() {
    this.drawMidpoint({
      isMobile: this.props.isMobile,
      chartWidths: this.props.chartWidths,
      headerHeight: this.props.headerHeight,
      orderBookKeys: this.props.orderBookKeys,
      sharedChartMargins: this.props.sharedChartMargins,
      midpointLabelWidth: this.state.midpointLabelWidth,
      candleNullMessageWidth: this.state.candleNullMessageWidth,
      hasPriceHistory: this.props.hasPriceHistory,
      hasOrders: this.props.hasOrders,
      fixedPrecision: this.props.fixedPrecision,
      excludeCandlestick: this.props.excludeCandlestick,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(this.props.sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(this.props.chartWidths, nextProps.chartWidths) ||
      this.props.headerHeight !== nextProps.headerHeight ||
      this.props.fixedPrecision !== nextProps.fixedPrecision ||
      this.props.hasPriceHistory !== nextProps.hasPriceHistory ||
      this.props.hasOrders !== nextProps.hasOrders ||
      this.props.excludeCandlestick !== nextProps.excludeCandlestick ||
      this.props.isMobile !== nextProps.isMobile ||
      this.state.midpointLabelWidth !== nextState.midpointLabelWidth ||
      this.state.candleNullMessageWidth !== nextState.candleNullMessageWidth
    ) {
      this.drawMidpoint({
        isMobile: nextProps.isMobile,
        chartWidths: nextProps.chartWidths,
        headerHeight: nextProps.headerHeight,
        orderBookKeys: nextProps.orderBookKeys,
        sharedChartMargins: nextProps.sharedChartMargins,
        midpointLabelWidth: nextState.midpointLabelWidth,
        candleNullMessageWidth: nextState.candleNullMessageWidth,
        hasPriceHistory: nextProps.hasPriceHistory,
        hasOrders: nextProps.hasOrders,
        fixedPrecision: nextProps.fixedPrecision,
        excludeCandlestick: nextProps.excludeCandlestick,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.midpointContainer, this.state.midpointContainer)) {
      this.getCandleNullMessageWidth()
      this.getMidpointLabelWidth()
    }
  }

  // NOTE -- these measurements are done this way due to the use of reactFauxDom
  getMidpointLabelWidth() {
    const midpointLabelWidth = document.getElementById('midpoint_label')

    this.setState({ midpointLabelWidth: midpointLabelWidth != null ? midpointLabelWidth.getBBox().width : 0 })
  }

  getCandleNullMessageWidth() {
    const candleNullMessageWidth = document.getElementById('midpoint_null_candle_label')

    this.setState({ candleNullMessageWidth: candleNullMessageWidth != null ? candleNullMessageWidth.getBBox().width : 0 })
  }

  drawMidpoint(options) {
    const {
      isMobile,
      orderBookKeys,
      sharedChartMargins,
      midpointLabelWidth,
      candleNullMessageWidth,
      hasPriceHistory,
      hasOrders,
      chartWidths,
      headerHeight,
      fixedPrecision,
      excludeCandlestick,
    } = options

    if (this.drawContainer) {
      // Faux DOM
      const midpointContainer = new ReactFauxDOM.Element('div')

      const drawParams = determineDrawParams({
        drawContainer: this.drawContainer,
        headerHeight,
        sharedChartMargins,
        chartWidths,
        isMobile,
      })

      // Chart Element
      const midpointChart = d3.select(midpointContainer)
        .append('svg')
        .attr('width', drawParams.containerWidth)
        .attr('height', drawParams.containerHeight)

      drawMidpointLine({
        drawParams,
        midpointChart,
        midpointLabelWidth,
        candleNullMessageWidth,
        hasPriceHistory,
        hasOrders,
        chartWidths,
        excludeCandlestick,
        isMobile,
      })

      if (hasOrders) {
        drawMidpointLabel({
          isMobile,
          drawParams,
          orderBookKeys,
          midpointChart,
          fixedPrecision,
        })
      }

      return this.setState({
        midpointContainer: midpointContainer.toReact(),
      })
    }
  }

  render() {
    return (
      <section>
        <div
          ref={(drawContainer) => { this.drawContainer = drawContainer }}
          className={Styles.MarketOutcomeMidpoint}
        >
          {this.state.midpointContainer}
        </div>
      </section>
    )
  }
}

function determineDrawParams(options) {
  const {
    drawContainer,
    headerHeight,
    sharedChartMargins,
    chartWidths,
    isMobile,
  } = options

  const containerWidth = isMobile ? chartWidths.candle + chartWidths.orders : drawContainer.clientWidth
  const containerHeight = drawContainer.clientHeight + headerHeight

  const chartDim = {
    ...sharedChartMargins,
    tickOffset: 10,
    right: 30,
    left: 0,
  }

  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([
      chartDim.top,
      containerHeight - chartDim.bottom,
    ])

  return {
    containerWidth,
    containerHeight,
    chartDim,
    yScale,
    chartWidths,
  }
}

function drawMidpointLine(options) {
  const {
    drawParams,
    midpointChart,
    midpointLabelWidth,
    candleNullMessageWidth,
    hasPriceHistory,
    hasOrders,
    chartWidths,
    excludeCandlestick,
    isMobile,
  } = options

  // Establish the midpoint line segments to draw
  const drawSegments = []
  if (excludeCandlestick) {
    if (hasOrders) {
      drawSegments.push({
        start: drawParams.chartDim.left,
        end: drawParams.containerWidth - midpointLabelWidth - drawParams.chartDim.right,
      })
    }
  } else if (hasPriceHistory) {
    if (hasOrders) {
      if (isMobile) {
        drawSegments.push({
          start: drawParams.chartDim.left,
          end: chartWidths.candle - drawParams.chartDim.right,
        })
        drawSegments.push({
          start: chartWidths.candle + midpointLabelWidth + drawParams.chartDim.right,
          end: drawParams.containerWidth,
        })
      } else {
        drawSegments.push({
          start: drawParams.chartDim.left,
          end: drawParams.containerWidth - midpointLabelWidth - drawParams.chartDim.right,
        })
      }
    } else {
      drawSegments.push({
        start: drawParams.chartDim.left,
        end: chartWidths.candle - drawParams.chartDim.right,
      })
    }
  } else {
    drawSegments.push({
      start: drawParams.chartDim.left,
      end: (chartWidths.candle / 2) - (candleNullMessageWidth / 2) - (drawParams.chartDim.right / 2),
    })

    if (hasOrders) {
      if (isMobile) {
        drawSegments.push({
          start: (chartWidths.candle / 2) + (candleNullMessageWidth / 2) + (drawParams.chartDim.right / 2),
          end: chartWidths.candle - drawParams.chartDim.right,
        })

        drawSegments.push({
          start: chartWidths.candle + midpointLabelWidth + drawParams.chartDim.right,
          end: drawParams.containerWidth,
        })
      } else {
        drawSegments.push({
          start: (chartWidths.candle / 2) + (candleNullMessageWidth / 2) + (drawParams.chartDim.right / 2),
          end: drawParams.containerWidth - midpointLabelWidth - (drawParams.chartDim.right / 2),
        })
      }
    } else {
      drawSegments.push({
        start: drawParams.chartDim.left,
        end: (chartWidths.candle / 2) - (candleNullMessageWidth / 2) - (drawParams.chartDim.right / 2),
      })
      drawSegments.push({
        start: (chartWidths.candle / 2) + (candleNullMessageWidth / 2) + (drawParams.chartDim.right / 2),
        end: chartWidths.candle - drawParams.chartDim.right,
      })
    }
  }

  drawSegments.forEach((segment) => {
    midpointChart.append('line')
      .attr('class', `${Styles.MarketOutcomeMidpoint__line}`)
      .attr('x1', segment.start)
      .attr('x2', segment.end)
      .attr('y1', () => drawParams.yScale(0.5))
      .attr('y2', () => drawParams.yScale(0.5))
  })

  if (!hasPriceHistory && !excludeCandlestick) {
    drawCandlestickNullMessage({
      midpointChart,
      chartWidths,
      drawParams,
      candleNullMessageWidth,
      midpointLabelWidth,
      hasOrders,
    })
  }

  if (!hasOrders) {
    drawOrdersNullMessage({
      midpointChart,
      drawParams,
      chartWidths,
    })
  }
}

function drawMidpointLabel(options) {
  const {
    drawParams,
    orderBookKeys,
    midpointChart,
    fixedPrecision,
    isMobile,
  } = options

  //  Midpoint Label
  midpointChart.append('text')
    .attr('id', 'midpoint_label')
    .attr('class', `${Styles.MarketOutcomeMidpoint__label}`)
    .attr('x', isMobile ? drawParams.chartWidths.candle : drawParams.containerWidth)
    .attr('y', drawParams.yScale(0.5))
    .attr('text-anchor', isMobile ? 'start' : 'end')
    .attr('dominant-baseline', 'central')
    .text(`${orderBookKeys.mid.toFixed(fixedPrecision)} ETH`)
}

function drawCandlestickNullMessage(options) {
  const {
    midpointChart,
    chartWidths,
    drawParams,
  } = options

  midpointChart.append('text')
    .attr('id', 'midpoint_null_candle_label')
    .attr('class', `${Styles['MarketOutcomeMidpoint__null-message']}`)
    .attr('x', chartWidths.candle / 2)
    .attr('y', drawParams.yScale(0.5))
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text('No Completed Trades')
}

function drawOrdersNullMessage(options) {
  const {
    midpointChart,
    drawParams,
    chartWidths,
  } = options

  midpointChart.append('text')
    .attr('id', 'midpoint_null_candle_label')
    .attr('class', `${Styles['MarketOutcomeMidpoint__null-message']}`)
    .attr('x', chartWidths.candle + (chartWidths.orders / 2))
    .attr('y', drawParams.yScale(0.5))
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text('No Open Orders')
}
