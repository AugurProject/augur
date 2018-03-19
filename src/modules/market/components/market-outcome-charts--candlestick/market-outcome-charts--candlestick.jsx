import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons'

// import updatePeriodTimeSeries from 'modules/market/helpers/period-time-series'

import DerivePeriodTimeSeries from 'modules/market/workers/derive-period-time-series.worker'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { isEqual } from 'lodash'

import { BUY, SELL } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles'

export default class MarketOutcomeCandlestick extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object.isRequired,
    priceTimeSeries: PropTypes.array.isRequired,
    selectedPeriod: PropTypes.object.isRequired,
    currentBlock: PropTypes.number.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    outcomeBounds: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    marketMin: PropTypes.number.isRequired,
    marketMax: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredPeriod: PropTypes.func.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    hoveredPrice: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      periodTimeSeries: [],
      chartWidth: 0,
      yScale: null,
      // hoveredPeriod: {},
      // hoveredPrice: null
    }

    this.drawCandlestick = this.drawCandlestick.bind(this)
    this.drawCandlestickOnResize = this.drawCandlestickOnResize.bind(this)
    this.updatePeriodTimeSeries = this.updatePeriodTimeSeries.bind(this)
  }

  componentWillMount() {
    this.updatePeriodTimeSeries(this.props.priceTimeSeries, this.props.selectedPeriod, this.props.currentBlock)
  }

  componentDidMount() {
    this.drawCandlestick(this.state.periodTimeSeries, this.props.orderBookKeys, this.props.fixedPrecision)

    window.addEventListener('resize', this.drawCandlestickOnResize)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      this.props.priceTimeSeries.length !== nextProps.priceTimeSeries.length ||
      !isEqual(this.props.selectedPeriod, nextProps.selectedPeriod)
    ) {
      this.updatePeriodTimeSeries(nextProps.priceTimeSeries, nextProps.selectedPeriod, nextProps.currentBlock)
    }

    if (
      !isEqual(this.state.periodTimeSeries, nextState.periodTimeSeries) ||
      !isEqual(this.props.orderBookKeys, nextProps.orderBookKeys) ||
      this.props.fixedPrecision !== nextProps.fixedPrecision
    ) {
      this.drawCandlestick(nextState.periodTimeSeries, nextProps.orderBookKeys, nextProps.fixedPrecision)
    }

    if (!isEqual(this.props.hoveredPrice, nextProps.hoveredPrice)) updateHoveredPriceCrosshair(this.props.hoveredPrice, this.state.yScale, this.state.chartWidth)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawCandlestickOnResize)
  }

  updatePeriodTimeSeries(priceTimeSeries, selectedPeriod, currentBlock) {
    const derivePeriodTimeSeriesWorker = new DerivePeriodTimeSeries()

    derivePeriodTimeSeriesWorker.postMessage({
      priceTimeSeries,
      selectedPeriod,
      currentBlock,
    })

    derivePeriodTimeSeriesWorker.onmessage = (event) => {
      this.setState({
        periodTimeSeries: event.data,
      })

      derivePeriodTimeSeriesWorker.terminate()
    }
  }

  drawCandlestick(priceTimeSeries, orderBookKeys, fixedPrecision) {
    if (this.candlestickChart) {
      // Chart Element
      const fauxDiv = new ReactFauxDOM.Element('div')
      const candlestick = d3.select(fauxDiv)
        .append('svg')
        .attr('id', 'outcome_candlestick')

      // Dimensions/Positioning
      const margin = {
        ...this.props.sharedChartMargins, // top, bottom
        right: this.props.sharedChartMargins.gap,
        left: 50,
        stick: 5,
        tickOffset: 10,
      }

      const candleDimensions = {
        width: 6,
        gap: 9,
      }

      const width = this.candlestickChart.clientWidth
      const height = this.candlestickChart.clientHeight

      candlestick.attr('width', width)
      candlestick.attr('height', height)

      // Domain
      //  X
      const xDomain = priceTimeSeries.reduce((p, dataPoint) => [...p, dataPoint.period], [])

      //  Y
      // Determine bounding diff
      // This scale is off because it's only looking at the order book rather than the price history + scaling around the midpoint
      const maxDiff = Math.abs(this.props.orderBookKeys.mid - this.props.outcomeBounds.max)
      const minDiff = Math.abs(this.props.orderBookKeys.mid - this.props.outcomeBounds.min)
      const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

      const yDomain = [
        Number((orderBookKeys.mid - boundDiff).toFixed(fixedPrecision)),
        Number((orderBookKeys.mid + boundDiff).toFixed(fixedPrecision)),
      ]

      // Scale
      const xScale = d3.scaleTime()
        .domain(d3.extent(xDomain))
        .range([margin.left, width - margin.left - margin.right - 1])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(yDomain))
        .range([height - margin.bottom, margin.top])

      // Y axis
      //  Bounds
      //    Top
      candlestick.append('line')
        .attr('class', 'bounding-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', 0)
        .attr('y2', 0)
      //    Bottom
      candlestick.append('line')
        .attr('class', 'bounding-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height - margin.bottom)
        .attr('y2', height - margin.bottom)

      //  Midpoint
      //    Conditional Tick Line
      if (orderBookKeys.mid == null) {
        candlestick.append('line')
          .attr('class', 'tick-line tick-line--midpoint')
          .attr('x1', margin.tickOffset)
          .attr('x2', width)
          .attr('y1', () => yScale(orderBookKeys.mid))
          .attr('y2', () => yScale(orderBookKeys.mid))
      }
      //    Label
      candlestick.append('text')
        .attr('class', 'tick-value')
        .attr('x', 0)
        .attr('y', yScale(orderBookKeys.mid))
        .attr('dx', 0)
        .attr('dy', margin.tickOffset)
        .text(orderBookKeys.mid && orderBookKeys.mid.toFixed(fixedPrecision))

      //  Ticks
      const offsetTicks = yDomain.map((d, i) => { // Assumes yDomain is [min, max]
        if (i === 0) return d + (boundDiff / 2)
        return d - (boundDiff / 2)
      })

      const yTicks = candlestick.append('g')
        .attr('id', 'depth_y_ticks')

      yTicks.selectAll('line')
        .data(offsetTicks)
        .enter()
        .append('line')
        .attr('class', 'tick-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
      yTicks.selectAll('text')
        .data(offsetTicks)
        .enter()
        .append('text')
        .attr('class', 'tick-value')
        .attr('x', 0)
        .attr('y', d => yScale(d))
        .attr('dx', 0)
        .attr('dy', margin.tickOffset)
        .text(d => d.toFixed(fixedPrecision))

      // X Axis
      //  Ticks
      candlestick.append('g')
        .attr('id', 'candlestick-x-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(priceTimeSeries.length))
        .select('path').remove()

      // Candles
      candlestick.selectAll('rect.candle')
        .data(priceTimeSeries)
        .enter().append('rect')
        .attr('x', d => xScale(d.period))
        .attr('y', d => yScale(d3.max([d.open, d.close])))
        .attr('height', d => yScale(d3.min([d.open, d.close])) - yScale(d3.max([d.open, d.close])))
        .attr('width', candleDimensions.width)
        .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow

      candlestick.selectAll('line.stem')
        .data(priceTimeSeries)
        .enter().append('line')
        .attr('class', 'stem')
        .attr('x1', d => xScale(d.period) + (candleDimensions.width / 2))
        .attr('x2', d => xScale(d.period) + (candleDimensions.width / 2))
        .attr('y1', d => yScale(d.high))
        .attr('y2', d => yScale(d.low))
        .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow

      // Volume Bars
      const yVolumeDomain = priceTimeSeries.reduce((p, dataPoint) => [...p, dataPoint.volume], [])

      const yVolumeScale = d3.scaleLinear()
        .domain(d3.extent(yVolumeDomain))
        .range([height - margin.bottom, margin.top + ((height - margin.bottom) * 0.66)])

      candlestick.selectAll('rect.volume')
        .data(priceTimeSeries)
        .enter().append('rect')
        .attr('x', d => xScale(d.period))
        .attr('y', d => yVolumeScale(d.volume))
        .attr('height', d => height - margin.bottom - yVolumeScale(d.volume))
        .attr('width', d => candleDimensions.width)
        .attr('class', 'period-volume') // eslint-disable-line no-confusing-arrow

      candlestick.append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .on('mousemove', () => this.props.updateHoveredPrice(yScale.invert(d3.mouse(d3.select('#outcome_candlestick').node())[1]).toFixed(fixedPrecision)))
        .on('mouseout', () => this.props.updateHoveredPrice(null))
        .on('click', () => {
          const mouse = d3.mouse(d3.select('#outcome_candlestick').node())
          const orderPrice = yScale.invert(mouse[1]).toFixed(fixedPrecision)

          if (
            orderPrice > this.props.marketMin &&
            orderPrice < this.props.marketMax
          ) {
            this.props.updateSeletedOrderProperties({
              selectedNav: orderPrice > this.props.orderBookKeys.mid ? BUY : SELL,
              orderPrice,
            })
          }
        })

      // Hover Handler
      candlestick.selectAll('rect.hover')
        .data(priceTimeSeries)
        .enter().append('rect')
        .attr('x', d => xScale(d.period))
        .attr('y', 0)
        .attr('height', height - margin.bottom)
        .attr('width', d => (0.5 * (width - (2 * margin.stick))) / priceTimeSeries.length)
        .attr('class', 'period-hover')
        .on('mouseover', d => this.props.updateHoveredPeriod(d))
        .on('mousemove', () => this.props.updateHoveredPrice(yScale.invert(d3.mouse(d3.select('#outcome_candlestick').node())[1]).toFixed(fixedPrecision)))
        .on('mouseout', () => {
          this.props.updateHoveredPeriod({})
          this.props.updateHoveredPrice(null)
        })

      candlestick.append('text')
        .attr('id', 'hovered_candlestick_price_label')

      const crosshair = candlestick.append('g')
        .attr('id', 'candlestick_crosshairs')
        .attr('class', 'line')
        .attr('style', { display: 'none' })

      crosshair.append('line')
        .attr('id', 'candlestick_crosshairY')
        .attr('class', 'crosshair')

      // Set Chart to State
      this.setState({
        yScale,
        chartWidth: width,
        chart: fauxDiv.toReact(),
      })
    }
  }

  drawCandlestickOnResize() {
    this.drawCandlestick(this.state.periodTimeSeries, this.props.orderBookKeys, this.props.fixedPrecision)
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <div
          ref={(candlestickChart) => { this.candlestickChart = candlestickChart }}
          className={Styles.MarketOutcomeCandlestick__chart}
        >
          {this.state.chart}
        </div>
      </section>
    )
  }
}

function updateHoveredPriceCrosshair(hoveredPrice, yScale, chartWidth) {
  if (hoveredPrice == null) {
    d3.select('#candlestick_crosshairs').style('display', 'none')
    d3.select('#hovered_candlestick_price_label').text('')
  } else {
    d3.select('#candlestick_crosshairs').style('display', null)
    d3.select('#candlestick_crosshairY')
      .attr('x1', 0)
      .attr('y1', yScale(hoveredPrice))
      .attr('x2', chartWidth)
      .attr('y2', yScale(hoveredPrice))
    d3.select('#hovered_candlestick_price_label')
      .attr('x', 0)
      .attr('y', yScale(hoveredPrice) + 12)
      .text(hoveredPrice)
  }
}
