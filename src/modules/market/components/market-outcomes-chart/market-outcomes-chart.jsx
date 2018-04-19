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
    } = this.props

    if (!isEqual(outcomes, nextProps.outcomes)) this.drawChart(nextProps.outcomes)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart)
  }

  drawChart(outcomes) {
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
        outcomes,
        drawParams,
        chart,
      })

      const outcomeLine = d3.line()
        .x(d => drawParams.xScale(d.timestamp))
        .y(d => drawParams.yScale(createBigNumber(d.price).toNumber()))

      // TODO -- refactor this to be more correct in d3 conventions, i.e. -- chart.select....
      outcomes.forEach((outcome, i) => {
        chart.append('path')
          .data([outcome.priceTimeSeries])
          .classed(`${Styles['outcome-line']}`, true)
          .classed(`${Styles[`outcome-line-${i + 1}`]}`, true)
          .attr('d', outcomeLine)
      })

      chart.append('g')
        .attr('class', Styles['outcomes-axis'])
        .attr('transform', `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`)
        .call(d3.axisBottom(drawParams.xScale))

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

  console.log('outcomes -- ', outcomes)

  const chartDim = {
    top: 20,
    right: 0,
    bottom: 30,
    left: 50,
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
    outcomes,
    chart,
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

  console.log('ticks -- ', drawParams.yDomain, range, ticks)

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

  // chart.append('g')
  //   .attr('class', Styles['outcomes-axis'])
  //   .attr('transform', `translate(${drawParams.chartDim.left}, 0)`)
  //   .call(d3.axisLeft(drawParams.yScale))
}

function drawAxisLabels() {

}

function drawSeries() {

}
