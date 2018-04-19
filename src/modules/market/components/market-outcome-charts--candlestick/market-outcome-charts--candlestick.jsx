import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CustomPropTypes from 'utils/custom-prop-types'
import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { isEqual } from 'lodash'
import { createBigNumber } from 'utils/create-big-number'

import findPeriodSeriesBounds from 'modules/market/helpers/find-period-series-bounds'
import DerivePeriodTimeSeries from 'modules/market/workers/derive-period-time-series.worker'
import MarketOutcomeChartsHeaderCandlestick from 'modules/market/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick'

import { BUY, SELL } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles'

export default class MarketOutcomeCandlestick extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object.isRequired,
    priceTimeSeries: PropTypes.array.isRequired,
    selectedPeriod: PropTypes.object.isRequired,
    currentBlock: PropTypes.number.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    marketMin: CustomPropTypes.bigNumber,
    marketMax: CustomPropTypes.bigNumber,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredPeriod: PropTypes.func.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    updateSelectedPeriod: PropTypes.func.isRequired,
    updateChartHeaderHeight: PropTypes.func.isRequired,
    hoveredPeriod: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    hoveredPrice: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      candleTicksContainer: null,
      candleChartContainer: null,
      periodTimeSeries: [],
      chartWidth: 0,
      yScale: null,
      outcomeBounds: {
        min: createBigNumber(0),
        max: createBigNumber(0),
      },
    }

    this.drawCandlestick = this.drawCandlestick.bind(this)
    this.drawCandlestickOnResize = this.drawCandlestickOnResize.bind(this)
    this.updatePeriodTimeSeries = this.updatePeriodTimeSeries.bind(this)
  }

  componentWillMount() {
    const {
      currentBlock,
      priceTimeSeries,
      selectedPeriod,
      marketMin,
      marketMax,
    } = this.props

    this.updatePeriodTimeSeries({
      priceTimeSeries,
      selectedPeriod,
      currentBlock,
      marketMin,
      marketMax,
    })
  }

  componentDidMount() {
    const {
      fixedPrecision,
      orderBookKeys,
      sharedChartMargins,
      marketMin,
      marketMax,
    } = this.props

    this.drawCandlestick({
      periodTimeSeries: this.state.periodTimeSeries,
      orderBookKeys,
      outcomeBounds: this.state.outcomeBounds,
      fixedPrecision,
      sharedChartMargins,
      marketMin,
      marketMax,
    })

    window.addEventListener('resize', this.drawCandlestickOnResize)
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      fixedPrecision,
      hoveredPrice,
      orderBookKeys,
      priceTimeSeries,
      selectedPeriod,
      sharedChartMargins,
      marketMin,
      marketMax,
    } = this.props

    if (
      priceTimeSeries.length !== nextProps.priceTimeSeries.length ||
      !isEqual(selectedPeriod, nextProps.selectedPeriod)
    ) {
      this.updatePeriodTimeSeries({
        priceTimeSeries: nextProps.priceTimeSeries,
        selectedPeriod: nextProps.selectedPeriod,
        currenteBlock: nextProps.currentBlock,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
      })
    }

    if (
      !isEqual(this.state.periodTimeSeries, nextState.periodTimeSeries) ||
      !isEqual(this.state.outcomeBounds, nextState.outcomeBounds) ||
      !isEqual(orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(sharedChartMargins, nextProps.sharedChartMargins) ||
      !marketMin.isEqualTo(nextProps.marketMin) ||
      !marketMax.isEqualTo(nextProps.marketMax) ||
      fixedPrecision !== nextProps.fixedPrecision
    ) {
      this.drawCandlestick({
        periodTimeSeries: nextState.periodTimeSeries,
        orderBookKeys: nextProps.orderBookKeys,
        outcomeBounds: nextState.outcomeBounds,
        fixedPrecision: nextProps.fixedPrecision,
        sharedChartMargins: nextProps.sharedChartMargins,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
      })
    }

    if (!isEqual(hoveredPrice, nextProps.hoveredPrice)) updateHoveredPriceCrosshair(hoveredPrice, this.state.yScale, this.state.chartWidth)
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.candleChartContainer, this.state.candleChartContainer)) {
      const elem = document.getElementById('candlestick_chart_container')

      elem.scrollTo(elem.scrollWidth, 0)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawCandlestickOnResize)
  }

  updatePeriodTimeSeries(options) {
    const {
      priceTimeSeries,
      selectedPeriod,
      currentBlock,
      marketMin,
      marketMax,
    } = options

    const derivePeriodTimeSeriesWorker = new DerivePeriodTimeSeries()

    derivePeriodTimeSeriesWorker.postMessage({
      priceTimeSeries,
      selectedPeriod,
      currentBlock,
    })

    derivePeriodTimeSeriesWorker.onmessage = (event) => {
      let periodTimeSeries = event.data
      if (event.data.length !== 0) {
        periodTimeSeries = periodTimeSeries.reduce((p, period) => {
          const currentPeriod = period

          Object.entries(period).forEach(([key, value]) => {
            if (key !== 'period') currentPeriod[key] = createBigNumber(value)
          })

          return [...p, currentPeriod]
        }, [])
      }

      this.setState({
        outcomeBounds: findPeriodSeriesBounds(periodTimeSeries, marketMin, marketMax),
        periodTimeSeries,
      })

      derivePeriodTimeSeriesWorker.terminate()
    }
  }

  drawCandlestick(options) {
    const {
      updateHoveredPeriod,
      updateHoveredPrice,
      updateSeletedOrderProperties,
    } = this.props
    const {
      periodTimeSeries,
      orderBookKeys,
      outcomeBounds,
      fixedPrecision,
      sharedChartMargins,
      marketMin,
      marketMax,
    } = options

    if (this.drawContainer) {
      const drawParams = determineDrawParams({
        drawContainer: this.drawContainer,
        sharedChartMargins,
        outcomeBounds,
        periodTimeSeries,
        orderBookKeys,
        fixedPrecision,
        marketMin,
        marketMax,
      })

      // Faux DOM
      //  Tick Element (Fixed)
      const candleTicksContainer = new ReactFauxDOM.Element('div')
      candleTicksContainer.setAttribute('class', `${Styles['MarketOutcomeCandlestick__ticks-container']}`)
      candleTicksContainer.setAttribute('key', 'candlestick_ticks_container')
      //  Chart Element (Scrollable)
      const candleChartContainer = new ReactFauxDOM.Element('div')
      candleChartContainer.setAttribute('key', 'candlestick_chart_container')
      candleChartContainer.setAttribute('id', 'candlestick_chart_container')
      candleChartContainer.setAttribute('class', `${Styles['MarketOutcomeCandlestick__chart-container']}`)
      candleChartContainer.setAttribute('style', {
        width: `${drawParams.containerWidth - drawParams.chartDim.left}px`,
        left: drawParams.chartDim.left,
      })

      const candleTicks = d3.select(candleTicksContainer)
        .append('svg')
        .attr('width', drawParams.containerWidth)
        .attr('height', drawParams.containerHeight)
      const candleChart = d3.select(candleChartContainer)
        .append('svg')
        .attr('id', 'candlestick_chart')
        .attr('height', drawParams.containerHeight)
        .attr('width', drawParams.drawableWidth)

      drawTicks({
        orderBookKeys,
        periodTimeSeries,
        candleTicks,
        drawParams,
        fixedPrecision,
      })

      drawCandles({
        periodTimeSeries,
        candleChart,
        drawParams,
      })

      drawVolume({
        fixedPrecision,
        periodTimeSeries,
        candleChart,
        drawParams,
      })

      drawXAxisLabels({
        periodTimeSeries,
        candleChart,
        drawParams,
      })

      drawCrosshairs({
        candleTicks,
      })

      attachHoverClickHandlers({
        updateHoveredPeriod,
        updateHoveredPrice,
        periodTimeSeries,
        fixedPrecision,
        candleChart,
        drawParams,
        updateSeletedOrderProperties,
      })

      // Set react components to state for render
      this.setState({
        yScale: drawParams.yScale,
        chartWidth: drawParams.containerWidth,
        candleTicksContainer: candleTicksContainer.toReact(),
        candleChartContainer: candleChartContainer.toReact(),
      })
    }
  }

  drawCandlestickOnResize() {
    const {
      fixedPrecision,
      orderBookKeys,
      sharedChartMargins,
    } = this.props
    this.drawCandlestick({
      periodTimeSeries: this.state.periodTimeSeries,
      orderBookKeys,
      outcomeBounds: this.state.outcomeBounds,
      fixedPrecision,
      sharedChartMargins,
    })
  }

  render() {
    const {
      hoveredPeriod,
      priceTimeSeries,
      fixedPrecision,
      updateSelectedPeriod,
      updateChartHeaderHeight,
      isMobile,
    } = this.props

    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <MarketOutcomeChartsHeaderCandlestick
          isMobile={isMobile}
          volume={hoveredPeriod.volume}
          open={hoveredPeriod.open}
          high={hoveredPeriod.high}
          low={hoveredPeriod.low}
          close={hoveredPeriod.close}
          priceTimeSeries={priceTimeSeries}
          fixedPrecision={fixedPrecision}
          updateSelectedPeriod={updateSelectedPeriod}
          updateChartHeaderHeight={updateChartHeaderHeight}
        />
        <div
          ref={(drawContainer) => { this.drawContainer = drawContainer }}
          className={Styles.MarketOutcomeCandlestick__container}
        >
          {this.state.candleTicksContainer}
          {this.state.candleChartContainer}
        </div>
      </section>
    )
  }
}

function determineDrawParams(options) {
  const {
    drawContainer,
    outcomeBounds,
    sharedChartMargins,
    periodTimeSeries,
    orderBookKeys,
    fixedPrecision,
    marketMin,
    marketMax,
  } = options

  // Dimensions/Positioning
  const chartDim = {
    ...sharedChartMargins,
    right: 0,
    left: 50,
    stick: 5,
    tickOffset: 10,
  }
  const candleDim = {
    width: 6,
    gap: 9,
  }

  const containerWidth = drawContainer.clientWidth
  const containerHeight = drawContainer.clientHeight

  // Domain
  //  X
  const xDomain = periodTimeSeries.reduce((p, dataPoint) => [...p, dataPoint.period], [])

  const domainScaleWidth = ((candleDim.width + (candleDim.gap * 2)) * periodTimeSeries.length) - (candleDim.gap * 2)

  let drawableWidth = containerWidth

  // Determine the smaller scale
  if (domainScaleWidth < containerWidth - chartDim.left - chartDim.right) { // expand domain
    // Is determining what the synthetic domain min needs to be in order to properly scale the view for fixed spaced candles
    if (xDomain.length !== 0) {
      xDomain.push(xDomain[0] - (((xDomain[xDomain.length - 1] - xDomain[0]) * containerWidth) / domainScaleWidth))
    }
  } else {
    drawableWidth = domainScaleWidth
  }

  //  Y
  // Determine bounding diff
  // This scale is off because it's only looking at the order book rather than the price history + scaling around the midpoint
  const maxDiff = createBigNumber(orderBookKeys.mid.minus(outcomeBounds.max).toPrecision(15)).absoluteValue() // NOTE -- toPrecision to address an error when attempting to get the absolute value
  const minDiff = createBigNumber(orderBookKeys.mid.minus(outcomeBounds.min).toPrecision(15)).absoluteValue()
  let boundDiff = maxDiff.gt(minDiff) ? maxDiff : minDiff

  const yDomain = [
    createBigNumber(orderBookKeys.mid.plus(boundDiff).toFixed(fixedPrecision)).toNumber(),
    createBigNumber(orderBookKeys.mid.minus(boundDiff).toFixed(fixedPrecision)).toNumber(),
  ]

  boundDiff = boundDiff.toNumber()

  // Scale
  const xScale = d3.scaleTime()
    .domain(d3.extent(xDomain))
    .range([chartDim.left, drawableWidth - chartDim.left - chartDim.right])

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([chartDim.top, containerHeight - chartDim.bottom])

  return {
    containerWidth,
    containerHeight,
    drawableWidth,
    chartDim,
    candleDim,
    boundDiff,
    xDomain,
    yDomain,
    xScale,
    yScale,
    marketMin,
    marketMax,
    orderBookKeys,
  }
}

function drawTicks(options) {
  const {
    orderBookKeys,
    candleTicks,
    drawParams,
    fixedPrecision,
  } = options

  // Y axis
  //  Bounds
  //    Top
  candleTicks.append('line')
    .attr('class', 'bounding-line')
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', 0)
    .attr('y2', 0)
  //    Bottom
  candleTicks.append('line')
    .attr('class', 'bounding-line')
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', drawParams.containerHeight - drawParams.chartDim.bottom)
    .attr('y2', drawParams.containerHeight - drawParams.chartDim.bottom)

  //  Midpoint
  //    Conditional Tick Line
  // candleTicks.append('line')
  //   .attr('class', 'tick-line tick-line--midpoint')
  //   .attr('x1', drawParams.chartDim.tickOffset)
  //   .attr('x2', drawParams.containerWidth)
  //   .attr('y1', () => drawParams.yScale(orderBookKeys.mid))
  //   .attr('y2', () => drawParams.yScale(orderBookKeys.mid))

  //    Label
  candleTicks.append('text')
    .attr('class', 'tick-value')
    .attr('x', 0)
    .attr('y', drawParams.yScale(orderBookKeys.mid))
    .attr('dx', 0)
    .attr('dy', drawParams.chartDim.tickOffset)
    .text(orderBookKeys.mid.toFixed(fixedPrecision))

  //  Ticks
  const offsetTicks = drawParams.yDomain.map((d, i) => { // Assumes yDomain is [max, min]
    if (i === 0) return d - (drawParams.boundDiff / 2)
    return d + (drawParams.boundDiff / 2)
  })

  const yTicks = candleTicks.append('g')
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
}

function drawCandles(options) {
  const {
    periodTimeSeries,
    candleChart,
    drawParams,
  } = options

  candleChart.selectAll('rect.candle')
    .data(periodTimeSeries)
    .enter().append('rect')
    .attr('x', d => drawParams.xScale(d.period))
    .attr('y', d => drawParams.yScale(d3.max([d.open.toNumber(), d.close.toNumber()])))
    .attr('height', d => drawParams.yScale(d3.min([d.open.toNumber(), d.close.toNumber()])) - drawParams.yScale(d3.max([d.open.toNumber(), d.close.toNumber()])))
    .attr('width', drawParams.candleDim.width)
    .attr('class', d => d.close.gt(d.open) ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow

  candleChart.selectAll('line.stem')
    .data(periodTimeSeries)
    .enter().append('line')
    .attr('class', 'stem')
    .attr('x1', d => drawParams.xScale(d.period) + (drawParams.candleDim.width / 2))
    .attr('x2', d => drawParams.xScale(d.period) + (drawParams.candleDim.width / 2))
    .attr('y1', d => drawParams.yScale(d.high))
    .attr('y2', d => drawParams.yScale(d.low))
    .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow
}

function drawVolume(options) {
  const {
    periodTimeSeries,
    candleChart,
    drawParams,
  } = options

  const yVolumeDomain = periodTimeSeries.reduce((p, dataPoint) => [...p, dataPoint.volume.toNumber()], [])

  const yVolumeScale = d3.scaleLinear()
    .domain(d3.extent(yVolumeDomain))
    .range([drawParams.containerHeight - drawParams.chartDim.bottom, drawParams.chartDim.top + ((drawParams.containerHeight - drawParams.chartDim.bottom) * 0.66)])

  candleChart.selectAll('rect.volume')
    .data(periodTimeSeries)
    .enter().append('rect')
    .attr('x', d => drawParams.xScale(d.period))
    .attr('y', d => yVolumeScale(d.volume.toNumber()))
    .attr('height', d => drawParams.containerHeight - drawParams.chartDim.bottom - yVolumeScale(d.volume.toNumber()))
    .attr('width', d => drawParams.candleDim.width)
    .attr('class', 'period-volume')
}

function drawXAxisLabels(options) {
  const {
    periodTimeSeries,
    candleChart,
    drawParams,
  } = options

  candleChart.append('g')
    .attr('id', 'candlestick-x-axis')
    .attr('transform', `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`)
    .call(d3.axisBottom(drawParams.xScale).ticks(periodTimeSeries.length / 3)) // TODO -- improve tick count
    .select('path').remove()
}

function drawCrosshairs(options) {
  const { candleTicks } = options

  candleTicks.append('text')
    .attr('id', 'hovered_candlestick_price_label')

  const crosshair = candleTicks.append('g')
    .attr('id', 'candlestick_crosshairs')
    .attr('class', 'line')
    .style('display', 'none')

  crosshair.append('line')
    .attr('id', 'candlestick_crosshairY')
    .attr('class', 'crosshair')
}

function attachHoverClickHandlers(options) {
  const {
    updateHoveredPeriod,
    updateHoveredPrice,
    periodTimeSeries,
    fixedPrecision,
    candleChart,
    drawParams,
    updateSeletedOrderProperties,
  } = options

  candleChart.append('rect')
    .attr('class', 'overlay')
    .attr('width', drawParams.drawableWidth)
    .attr('height', drawParams.containerHeight)
    .on('mousemove', () => updateHoveredPrice(drawParams.yScale.invert(d3.mouse(d3.select('#candlestick_chart').node())[1]).toFixed(fixedPrecision)))
    .on('mouseout', () => updateHoveredPrice(null))
    .on('click', () => {
      const mouse = d3.mouse(d3.select('#candlestick_chart').node())
      const orderPrice = drawParams.yScale.invert(mouse[1]).toFixed(fixedPrecision)

      if (
        orderPrice > drawParams.marketMin &&
        orderPrice < drawParams.marketMax
      ) {
        updateSeletedOrderProperties({
          selectedNav: orderPrice > drawParams.orderBookKeys.mid ? BUY : SELL,
          orderPrice,
        })
      }
    })

  candleChart.selectAll('rect.hover')
    .data(periodTimeSeries)
    .enter().append('rect')
    .attr('id', 'testing')
    .attr('x', d => drawParams.xScale(d.period) - (drawParams.candleDim.gap * 0.5))
    .attr('y', 0)
    .attr('height', drawParams.containerHeight - drawParams.chartDim.bottom)
    .attr('width', drawParams.candleDim.width + drawParams.candleDim.gap)
    .attr('class', 'period-hover')
    .on('mouseover', d => updateHoveredPeriod(d))
    .on('mousemove', () => updateHoveredPrice(drawParams.yScale.invert(d3.mouse(d3.select('#candlestick_chart').node())[1]).toFixed(fixedPrecision)))
    .on('mouseout', () => {
      updateHoveredPeriod({})
      updateHoveredPrice(null)
    })
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
