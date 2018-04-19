import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import { createBigNumber } from 'utils/create-big-number'

import Styles from 'modules/market/components/market-outcomes-chart/market-outcomes-chart.styles'

export default class MarketOutcomesChart extends Component {
  static propTypes = {
    outcomes: PropTypes.array.isRequired,
    updateSelectedOutcome: PropTypes.func.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    selectedOutcome: PropTypes.any, // NOTE -- There is a PR in the prop-types lib to handle null values, but until then..
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      hoveredOutcome: null,
      // selectedOutcome: null // NOTE -- Just a placeholder until outcomes are implemented
    }

    this.drawChart = this.drawChart.bind(this)
  }

  componentDidMount() {
    this.drawChart(this.props.outcomes)

    window.addEventListener('resize', this.drawChart)
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      outcomes,
      fixedPrecision,
    } = this.props

    if (
      !isEqual(outcomes, nextProps.outcomes) ||
      fixedPrecision !== nextProps.fixedPrecision
    ) this.drawChart(nextProps.outcomes, fixedPrecision)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart)
  }

  drawChart(outcomes, fixedPrecision) {
    if (this.outcomesChart) {
      const drawParams = determineDrawParams({
        drawContainer: this.outcomesChart,
        outcomes,
      })

      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv).append('svg')
        .attr('id', 'outcomes_chart')
        .attr('width', drawParams.width)
        .attr('height', drawParams.height)

      drawTicks({
        drawParams,
        chart,
        fixedPrecision,
      })

      drawXAxisLabels({
        drawParams,
        chart,
      })

      drawSeries({
        chart,
        outcomes,
        drawParams,
      })

      this.setState({ chart: fauxDiv.toReact() })
    }
  }

  render() {
    const s = this.state

    return (
      <div className={Styles.MarketOutcomesChart}>
        <h3>price (eth) of each outcome</h3>
        <div className={Styles[`MarketOutcomesChart__chart-header`]}>
          <span className={Styles.MarketOutcomesChart__details}>
            {s.hoveredOutcome === null ?
              'select an outcome to begin placing an order' :
              <span>
                <span className={Styles.MarketOutcomesChart__name}>
                  {s.hoveredOutcome.name}
                </span>
                <span className={Styles.MarketOutcomesChart__price}>
                  last: {s.hoveredOutcome.price.toFixed(4)} eth
                </span>
                <span className={Styles.MarketOutcomesChart__instruction}>
                  click to view more information about this outcome
                </span>
              </span>
            }
          </span>
          <div />
        </div>
        <div
          ref={(outcomesChart) => { this.outcomesChart = outcomesChart }}
          className={Styles.MarketOutcomesChart__chart}
        >
          {s.chart}
        </div>
      </div>
    )
  }
}

function determineDrawParams(options) {
  const {
    drawContainer,
    outcomes,
  } = options

  const chartDim = {
    top: 20,
    right: 0,
    bottom: 30,
    left: 50,
    tickOffset: 10,
  }

  const containerWidth = drawContainer.clientWidth
  const containerHeight = drawContainer.clientHeight

  const xDomain = outcomes.reduce((p, outcome) => [...p, ...outcome.priceTimeSeries.map(dataPoint => dataPoint.timestamp)], [])
  const yDomain = d3.extent(outcomes.reduce((p, outcome) => [...p, ...outcome.priceTimeSeries.map(dataPoint => createBigNumber(dataPoint.price).toNumber())], []))

  const xScale = d3.scaleTime()
    .domain(d3.extent(xDomain))
    .range([chartDim.left, containerWidth - chartDim.right - 1])

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([containerHeight - chartDim.bottom, chartDim.top])

  return {
    chartDim,
    containerWidth,
    containerHeight,
    xDomain,
    yDomain,
    xScale,
    yScale,
  }
}

function drawTicks(options) {
  const {
    drawParams,
    chart,
    fixedPrecision,
  } = options

  // Y axis
  //  Bounds
  //    Top
  chart.append('line')
    .attr('class', Styles['MarketOutcomesChart__bounding-line'])
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', drawParams.chartDim.top)
    .attr('y2', drawParams.chartDim.top)
  //    Bottom
  chart.append('line')
    .attr('class', Styles['MarketOutcomesChart__bounding-line'])
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', drawParams.containerHeight - drawParams.chartDim.bottom)
    .attr('y2', drawParams.containerHeight - drawParams.chartDim.bottom)

  const numberOfTicks = 5 // NOTE -- excludes bounds
  const range = Math.abs(drawParams.yDomain[1] - drawParams.yDomain[0])
  const interval = range / numberOfTicks

  const ticks = [...new Array(5)].map((_item, i) => {
    if (i === 0) return drawParams.yDomain[0] + interval
    return drawParams.yDomain[0] + ((i + 1) * interval)
  })

  chart.append('g')
    .selectAll('line')
    .data(ticks)
    .enter()
    .append('line')
    .classed(Styles['MarketOutcomesChart__tick-line'], true)
    .classed(Styles['MarketOutcomesChart__tick-line--excluded'], (d, i) => i + 1 === ticks.length)
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', d => drawParams.yScale(d))
    .attr('y2', d => drawParams.yScale(d))

  chart.append('g')
    .selectAll('text')
    .data(ticks)
    .enter()
    .append('text')
    .classed(Styles['MarketOutcomesChart__tick-value'], true)
    .attr('x', 0)
    .attr('y', d => drawParams.yScale(d))
    .attr('dx', 0)
    .attr('dy', drawParams.chartDim.tickOffset)
    .text(d => d.toFixed(fixedPrecision))
}

function drawXAxisLabels(options) {
  const {
    chart,
    drawParams,
  } = options

  chart.append('g')
    .attr('class', Styles['MarketOutcomesChart__outcomes-axis'])
    .attr('transform', `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`)
    .call(d3.axisBottom(drawParams.xScale))
}

function drawSeries(options) {
  const {
    drawParams,
    outcomes,
    chart,
  } = options

  const outcomeLine = d3.line()
    .x(d => drawParams.xScale(d.timestamp))
    .y(d => drawParams.yScale(createBigNumber(d.price).toNumber()))

  outcomes.forEach((outcome, i) => {
    chart.append('path')
      .data([outcome.priceTimeSeries])
      .classed(`${Styles['MarketOutcomesChart__outcome-line']}`, true)
      .classed(`${Styles[`MarketOutcomesChart__outcome-line--${i + 1}`]}`, true)
      .attr('d', outcomeLine)
  })
}
