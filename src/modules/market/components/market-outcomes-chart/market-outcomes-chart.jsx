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
    this.drawChart()

    window.addEventListener('resize', this.drawChart)
  }

  componentDidUpdate(prevProps) {
    const { outcomes } = this.props
    if (!isEqual(prevProps.outcomes, outcomes)) this.drawChart()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.drawChart)
  }

  drawChart() {
    if (this.outcomesChart) {
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv).append('svg')

      const { outcomes } = this.props

      const margin = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 50,
      }

      const width = this.outcomesChart.clientWidth
      const height = this.outcomesChart.clientHeight

      chart.attr('id', 'outcomes_chart')

      chart.attr('width', width)
      chart.attr('height', height)

      const xDomain = outcomes.reduce((p, outcome) => [...p, ...outcome.priceTimeSeries.map(dataPoint => dataPoint.timestamp)], [])
      const yDomain = outcomes.reduce((p, outcome) => [...p, ...outcome.priceTimeSeries.map(dataPoint => createBigNumber(dataPoint.price).toNumber())], [])

      const xScale = d3.scaleTime()
        .domain(d3.extent(xDomain))
        .range([margin.left, width - margin.right - 1])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(yDomain))
        .range([height - margin.bottom, margin.top])

      const outcomeLine = d3.line()
        .x(d => xScale(d.timestamp))
        .y(d => yScale(createBigNumber(d.price).toNumber()))

      // TODO -- refactor this to be more correct in d3 conventions, i.e. -- chart.select....
      outcomes.forEach((outcome, i) => {
        chart.append('path')
          .data([outcome.priceTimeSeries])
          .classed(`${Styles['outcome-line']}`, true)
          .classed(`${Styles[`outcome-line-${outcome.id}`]}`, true)
          .attr('d', outcomeLine)
      })

      chart.append('g')
        .attr('class', Styles['outcomes-axis'])
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))

      chart.append('g')
        .attr('class', Styles['outcomes-axis'])
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))

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

// NOTE -- this goes into the self closing div
// <span >Filter (TODO)</span>
