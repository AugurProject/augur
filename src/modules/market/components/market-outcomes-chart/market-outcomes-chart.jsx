import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Highstock from 'highcharts/js/highstock'
// import noData from 'highcharts/modules/no-data-to-display'
import { isEqual } from 'lodash'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import Styles from 'modules/market/components/market-outcomes-chart/market-outcomes-chart.styles'

export default class MarketOutcomesChart extends Component {
  static propTypes = {
    priceHistory: PropTypes.array.isRequired,
    selectedOutcomes: PropTypes.any, // NOTE -- There is a PR to handle null values, but until then..
    updateSelectedOutcomes: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      hoveredOutcome: null,
      selectedOutcome: null // NOTE -- Just a placeholder until outcomes are implemented
    }

    this.drawChart = this.drawChart.bind(this)
  }

  componentDidMount() {
    this.drawChart()

    window.addEventListener('resize', this.drawChart)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.priceHistory, this.props.priceHistory)) this.drawChart()
  }

  drawChart() {
    if (this.outcomesChart) {
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv)
        .append('svg')

      const priceHistory = this.props.priceHistory

      const margin = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 50
      }

      const width = this.outcomesChart.clientWidth
      const height = this.outcomesChart.clientHeight

      chart.attr('id', 'outcomes_chart')

      // this.chart.attr('viewBox', `0 0 ${width} ${height}`)

      chart.attr('width', width)
      chart.attr('height', height)

      const xDomain = priceHistory.reduce((p, outcome) => [...p, ...outcome.data.map(dataPoint => dataPoint[0])], [])
      const yDomain = priceHistory.reduce((p, outcome) => [...p, ...outcome.data.map(dataPoint => dataPoint[1])], [])

      const xScale = d3.scaleTime()
        .domain(d3.extent(xDomain))
        .range([margin.left, width - margin.right])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(yDomain))
        .range([height - margin.bottom, margin.top])

      const outcomeLine = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))

      priceHistory.forEach((outcome, i) => {
        chart.append('path')
          .data([priceHistory[i].data])
          .attr('class', 'outcome-line')
          .attr('d', outcomeLine)
      })

      chart.append('g')
        .attr('class', 'outcomes-axis')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))

      chart.append('g')
        .attr('class', 'outcomes-axis')
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
          <div>
            <span >Filter (TODO)</span>
          </div>
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

// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import { isEqual } from 'lodash'
//
// import * as d3 from 'd3'
// import { withFauxDOM } from 'react-faux-dom'
//
// import Styles from 'modules/market/components/market-outcomes-chart/market-outcomes-chart.styles'
//
// class MarketOutcomesChart extends Component {
//   static propTypes = {
//     priceHistory: PropTypes.array.isRequired,
//     selectedOutcome: PropTypes.any, // NOTE -- There is a PR to handle null values, but until then..
//     updateSelectedOutcome: PropTypes.func.isRequired,
//     connectFauxDOM: PropTypes.func.isRequired,
//     chart: PropTypes.element
//   }
//
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       hoveredOutcome: null,
//       selectedOutcome: null // NOTE -- Just a placeholder until outcomes are implemented
//     }
//
//     this.drawChart = this.drawChart.bind(this)
//   }
//
//   componentDidMount() {
//     this.drawChart(this.props.priceHistory)
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (!isEqual(this.props.priceHistory, nextProps.priceHistory)) this.drawChart(nextProps.priceHistory)
//   }
//
//   drawChart(priceHistory) {
//     const sales = [
//       { product: 'Hoodie', count: 7 },
//       { product: 'Jacket', count: 6 },
//       { product: 'Snuggie', count: 9 },
//     ]
//
//     const svg = d3.select(this.props.connectFauxDOM('svg', 'chart'))
//
//     const margin = {
//       top: 20,
//       right: 20,
//       bottom: 30,
//       left: 50
//     }
//     const width = this.outcomesChart.clientWidth - margin.right - margin.left
//     const height = this.outcomesChart.clientHeight - margin.top - margin.bottom
//
//     console.log('width -- ', width)
//     console.log('height -- ', height, height / sales.length)
//
//     svg.attr('width', width)
//     svg.attr('height', height)
//
//     console.log('chart avail -- ', !!svg.size())
//
//     const rects = svg.selectAll('rect')
//       .data(sales)
//
//     const newRects = rects.enter()
//
//     const maxCount = d3.max(sales, d => d.count)
//     const x = d3.scaleLinear()
//       .range([0, width]) // px
//       .domain([0, maxCount]) // values
//     const y = d3.scaleBand()
//       .rangeRound([0, height]) // px
//       .domain(sales.map(d => d.product)) // values
//
//     newRects.append('rect')
//       .attr('x', x(0))
//       .attr('y', d => y(d.product))
//       .attr('height', y.bandwidth())
//       .attr('width', d => x(d.count))
//
//     // const x = d3.scaleLinear().range(d3.extent(priceHistory, d => d[0]))
//     // const y = d3.scaleLinear().range(d3.extent(priceHistory, d => d[1]))
//     //
//     // console.log('x -- ', x)
//     // console.log('y -- ', y)
//
//     // d3.select(chart)
//     //   .append('span')
//     //   .html('heyo')
//   }
//
//   render() {
//     // const p = this.props
//     const s = this.state
//
//     return (
//       <div className={Styles.MarketOutcomesChart}>
//         <h3>price (eth) of each outcome</h3>
//         <div className={Styles[`MarketOutcomesChart__chart-header`]}>
//           <span className={Styles.MarketOutcomesChart__details}>
//             {s.hoveredOutcome === null ?
//               'select an outcome to begin placing an order' :
//               <span>
//                 <span className={Styles.MarketOutcomesChart__name}>
//                   {s.hoveredOutcome.name}
//                 </span>
//                 <span className={Styles.MarketOutcomesChart__price}>
//                   last: {s.hoveredOutcome.price.toFixed(4)} eth
//                 </span>
//                 <span className={Styles.MarketOutcomesChart__instruction}>
//                   click to view more information about this outcome
//                 </span>
//               </span>
//             }
//           </span>
//           <div>
//             <span >Filter (TODO)</span>
//           </div>
//         </div>
//         <div
//           ref={(outcomesChart) => { this.outcomesChart = outcomesChart }}
//           className={Styles.MarketOutcomesChart__chart}
//         >
//           {this.props.chart}
//         </div>
//       </div>
//     )
//   }
// }
//
// export default withFauxDOM(MarketOutcomesChart)
//
// //
// // <div
// //   id="market_outcomes_graph"
// //   className={Styles.MarketOutcomesGraph__graph}
// // />
