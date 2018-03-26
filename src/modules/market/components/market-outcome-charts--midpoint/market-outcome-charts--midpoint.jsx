import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import Styles from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint.styles'

import { isEqual } from 'lodash'

export default class MarketOutcomeMidpoint extends Component {
  static propTypes = {
    chartWidths: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    sharedChartMargins: PropTypes.object.isRequired,
    hasPriceHistory: PropTypes.bool.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
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
      chartWidths: this.props.chartWidths,
      orderBookKeys: this.props.orderBookKeys,
      sharedChartMargins: this.props.sharedChartMargins,
      midpointLabelWidth: this.state.midpointLabelWidth,
      candleNullMessageWidth: this.state.candleNullMessageWidth,
      hasPriceHistory: this.props.hasPriceHistory,
      hasOrders: this.props.hasOrders,
      fixedPrecision: this.props.fixedPrecision,
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(this.props.sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(this.props.chartWidths, nextProps.chartWidths) ||
      this.props.fixedPrecision !== nextProps.fixedPrecision ||
      this.props.hasPriceHistory !== nextProps.hasPriceHistory ||
      this.props.hasOrders !== nextProps.hasOrders ||
      this.state.midpointLabelWidth !== nextState.midpointLabelWidth ||
      this.state.candleNullMessageWidth !== nextState.candleNullMessageWidth
    ) {
      this.drawMidpoint({
        chartWidths: nextProps.chartWidths,
        orderBookKeys: nextProps.orderBookKeys,
        sharedChartMargins: nextProps.sharedChartMargins,
        midpointLabelWidth: nextState.midpointLabelWidth,
        candleNullMessageWidth: nextState.candleNullMessageWidth,
        hasPriceHistory: nextProps.hasPriceHistory,
        hasOrders: nextProps.hasOrders,
        fixedPrecision: nextProps.fixedPrecision,
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.midpointContainer, this.state.midpointContainer)) {
      this.getCandleNullMessageWidth()
      this.getMidpointLabelWidth()
    }
  }

  // NOTE -- these measurments are done this way due to the use of reactFauxDom
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
      orderBookKeys,
      sharedChartMargins,
      midpointLabelWidth,
      candleNullMessageWidth,
      hasPriceHistory,
      hasOrders,
      chartWidths,
      fixedPrecision,
    } = options

    if (this.drawContainer) {
      // Faux DOM
      const midpointContainer = new ReactFauxDOM.Element('div')

      const drawParams = determineDrawParams({
        drawContainer: this.drawContainer,
        sharedChartMargins,
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
      })

      if (hasOrders) {
        drawMidpointLabel({
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
    sharedChartMargins,
  } = options

  const containerWidth = drawContainer.clientWidth
  const containerHeight = drawContainer.clientHeight

  const chartDim = {
    ...sharedChartMargins,
    tickOffset: 10,
    right: 10,
    left: 10,
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
  } = options

  // Left Segment
  midpointChart.append('line')
    .attr('class', `${Styles.MarketOutcomeMidpoint__line}`)
    .attr('x1', drawParams.chartDim.tickOffset)
    .attr('x2', () => {
      if (hasPriceHistory && hasOrders) { // All the way
        return drawParams.containerWidth - midpointLabelWidth - drawParams.chartDim.right
      } else if (hasPriceHistory && !hasOrders) { // To orders
        return chartWidths.candle
      } else if (!hasPriceHistory) { // To candle null label
        return (chartWidths.candle / 2) - (candleNullMessageWidth / 2) - drawParams.chartDim.right
      }
    })
    .attr('y1', () => drawParams.yScale(0.5))
    .attr('y2', () => drawParams.yScale(0.5))

  // Right Segment
  if (!hasPriceHistory) {
    midpointChart.append('line')
      .attr('class', `${Styles.MarketOutcomeMidpoint__line}`)
      .attr('x1', (chartWidths.candle / 2) + (candleNullMessageWidth / 2) + drawParams.chartDim.left)
      .attr('x2', hasOrders ? drawParams.containerWidth - midpointLabelWidth - drawParams.chartDim.right : chartWidths.candle)
      .attr('y1', () => drawParams.yScale(0.5))
      .attr('y2', () => drawParams.yScale(0.5))
  }

  if (!hasPriceHistory) {
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
  } = options

  //  Midpoint Label
  midpointChart.append('text')
    .attr('id', 'midpoint_label')
    .attr('class', `${Styles.MarketOutcomeMidpoint__label}`)
    .attr('x', drawParams.containerWidth)
    .attr('y', drawParams.yScale(0.5))
    .attr('text-anchor', 'end')
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
