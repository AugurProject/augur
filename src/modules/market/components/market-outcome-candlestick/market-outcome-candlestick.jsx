import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import * as d3 from 'd3'
import ReactFauxDOM from 'react-faux-dom'

import MarketOutcomeCandlestickHeader from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick-header'

import { isEqual } from 'lodash'

import Styles from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick.styles'

export default class MarketOutcomeCandlestick extends Component {
  static propTypes = {
    marketPriceHistory: PropTypes.array.isRequired,
    outcomeMin: PropTypes.number.isRequired,
    outcomeMax: PropTypes.number.isRequired,
    orderBookMid: PropTypes.number.isRequired,
    marketMin: PropTypes.number.isRequired,
    marketMax: PropTypes.number.isRequired,
    hoveredPrice: PropTypes.any,
    updateHoveredPrice: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      chart: null,
      hoveredPeriod: {}
    }

    this.drawChart = this.drawChart.bind(this)
  }

  componentDidMount() {
    this.drawChart()

    window.addEventListener('resize', this.drawChart)
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.marketPriceHistory, this.props.marketPriceHistory)) this.drawChart()
  }

  drawChart() {
    if (this.candlestickChart) {
      const fauxDiv = new ReactFauxDOM.Element('div')
      const chart = d3.select(fauxDiv).append('svg')

      const priceHistory = this.props.marketPriceHistory

      const margin = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 50,
        stick: 5,
        tickOffset: 10
      }

      const width = this.candlestickChart.clientWidth
      const height = this.candlestickChart.clientHeight

      chart.attr('id', 'outcome_candlestick')

      chart.attr('width', width)
      chart.attr('height', height)

      const xDomain = priceHistory.reduce((p, dataPoint) => [...p, dataPoint.period], [])

      // Ensure yDomain always has midmarket price at the center
      // TODO -- can probably clean this up...is a copy/paste from an older implementation
      // Can only use odd numbered intervals so midpoint is always centered
      const intervals = 5
      const allowedFloat = 2 // TODO -- set this to the precision

      // Determine bounding diff
      const maxDiff = Math.abs(this.props.orderBookMid - this.props.outcomeMax)
      const minDiff = Math.abs(this.props.orderBookMid - this.props.outcomeMin)
      const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff)

      // Set interval step
      const step = boundDiff / ((intervals - 1) / 2)

      const yDomain = new Array(intervals).fill(null).reduce((p, _unused, i) => {
        if (i === 0) return [Number((this.props.orderBookMid - boundDiff).toFixed(allowedFloat))]
        if (i + 1 === Math.round(intervals / 2)) return [...p, this.props.orderBookMid]
        return [...p, Number((p[i - 1] + step).toFixed(allowedFloat))]
      }, [])

      // Candlesticks
      const xScale = d3.scaleTime()
        .domain(d3.extent(xDomain))
        .range([margin.left, width - margin.right - 1])

      const yScale = d3.scaleLinear()
        .domain(d3.extent(yDomain))
        .range([height - margin.bottom, margin.top])

      chart.selectAll('line')
        .data(yDomain)
        .enter()
        .append('line')
        .attr('class', 'tick-line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', (d, i) => ((height - margin.bottom) / 4) * i)
        .attr('y2', (d, i) => ((height - margin.bottom) / 4) * i)

      chart.selectAll('text')
        .data(yDomain.sort((a, b) => (b - a)))
        .enter()
        .append('text')
        .attr('class', 'tick-value')
        .attr('x', 0)
        .attr('y', (d, i) => ((height - margin.bottom) / 4) * i)
        .attr('dy', margin.tickOffset)
        .attr('dx', 0)
        .text((d, i) => {
          if (i && i !== yDomain.length - 1) return d.toFixed(allowedFloat)
        })

      chart.selectAll('rect.candle')
        .data(priceHistory)
        .enter().append('rect')
        .attr('x', d => xScale(d.period))
        .attr('y', d => yScale(d3.max([d.open, d.close])))
        .attr('height', d => yScale(d3.min([d.open, d.close])) - yScale(d3.max([d.open, d.close])))
        .attr('width', d => (0.5 * (width - (2 * margin.stick))) / priceHistory.length)
        .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow

      chart.selectAll('line.stem')
        .data(priceHistory)
        .enter().append('line')
        .attr('class', 'stem')
        .attr('x1', d => xScale(d.period) + (0.25 * ((width - (2 * margin.stick)) / priceHistory.length)))
        .attr('x2', d => xScale(d.period) + (0.25 * ((width - (2 * margin.stick)) / priceHistory.length)))
        .attr('y1', d => yScale(d.high))
        .attr('y2', d => yScale(d.low))
        .attr('class', d => d.close > d.open ? 'up-period' : 'down-period') // eslint-disable-line no-confusing-arrow

      // Volume
      const yVolumeDomain = priceHistory.reduce((p, dataPoint) => [...p, dataPoint.volume], [])

      const yVolumeScale = d3.scaleLinear()
        .domain(d3.extent(yVolumeDomain))
        .range([height - margin.bottom, margin.top + ((height - margin.bottom) * 0.66)])

      chart.selectAll('rect.volume')
        .data(priceHistory)
        .enter().append('rect')
        .attr('x', d => ((0.05 * (width - (2 * margin.stick))) / priceHistory.length) + xScale(d.period))
        .attr('y', d => yVolumeScale(d.volume))
        .attr('height', d => height - margin.bottom - yVolumeScale(d.volume))
        .attr('width', d => (0.40 * (width - (2 * margin.stick))) / priceHistory.length)
        .attr('class', 'period-volume') // eslint-disable-line no-confusing-arrow

      chart.selectAll('rect.hover')
        .data(priceHistory)
        .enter().append('rect')
        .attr('x', d => xScale(d.period))
        .attr('y', 0)
        .attr('height', height - margin.bottom)
        .attr('width', d => (0.5 * (width - (2 * margin.stick))) / priceHistory.length)
        .attr('class', 'period-hover')
        .on('mouseover', d => this.setState({ hoveredPeriod: d }))
        .on('mouseout', () => this.setState({ hoveredPeriod: {} }))

      this.setState({ chart: fauxDiv.toReact() })
    }
  }

  render() {
    const s = this.state

    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <MarketOutcomeCandlestickHeader
          volume={s.hoveredPeriod.volume}
          open={s.hoveredPeriod.open}
          high={s.hoveredPeriod.high}
          low={s.hoveredPeriod.low}
          close={s.hoveredPeriod.close}
        />
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

// import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import Highchart from 'highcharts/js/highstock'
// import noData from 'highcharts/modules/no-data-to-display'
// import { isEqual } from 'lodash'
// // import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'
//
// import debounce from 'utils/debounce'
//
// import Styles from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick.styles'
//
// export default class MarketOutcomeCandlestick extends Component {
//   static propTypes = {
//     marketPriceHistory: PropTypes.array.isRequired,
//     outcomeMin: PropTypes.number.isRequired,
//     outcomeMax: PropTypes.number.isRequired,
//     orderBookMid: PropTypes.number.isRequired,
//     marketMin: PropTypes.number.isRequired,
//     marketMax: PropTypes.number.isRequired,
//     hoveredPrice: PropTypes.any,
//     updateHoveredPrice: PropTypes.func.isRequired,
//   }
//
//   constructor(props) {
//     super(props)
//
//     this.PLOT_BACKGROUND = 'PLOT_BACKGROUND'
//     this.SERIES = 'SERIES'
//
//     this.updateGraph = this.updateGraph.bind(this)
//     this.debouncedUpdateGraph = debounce(this.updateGraph.bind(this))
//     this.updateCrosshair = this.updateCrosshair.bind(this)
//     this.determineHoveredPrice = this.determineHoveredPrice.bind(this)
//   }
//
//   componentDidMount() {
//     noData(Highchart)
//
//     Highchart.setOptions({
//       lang: {
//         thousandsSep: ','
//       }
//     })
//
//     this.outcomeCandlestick = Highchart.stockChart('market_outcome_candlestick', {
//       chart: {
//         animation: false,
//         panning: false,
//         marginLeft: 20,
//       },
//       rangeSelector: {
//         enabled: false
//       },
//       legend: {
//         enabled: false
//       },
//       tooltip: {
//         enabled: false
//       },
//       navigator: {
//         enabled: false
//       },
//       credits: {
//         enabled: false
//       },
//       scrollbar: {
//         enabled: false
//       },
//       panning: false,
//       zoom: false,
//       yAxis: [{
//         opposite: false,
//         labels: {
//           align: 'left',
//           y: 15,
//           x: -20,
//           formatter: function () { // eslint-disable-line func-names, object-shorthand
//             return this.isFirst ? '' : this.value
//           }
//         },
//         tickPositioner: () => {
//           // Can only use odd numbered intervals so midpoint is always centered
//           const intervals = 5
//           const allowedFloat = 2
//           const padding = 0.2 // percentage padding
//
//           // Determine bounding diff
//           const maxDiff = Math.abs(this.props.orderBookMid - this.props.outcomeMax)
//           const minDiff = Math.abs(this.props.orderBookMid - this.props.outcomeMin)
//           const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff) * (1 + padding)
//
//           // Set interval step
//           const step = boundDiff / ((intervals - 1) / 2)
//
//           const res = new Array(intervals).fill(null).reduce((p, _unused, i) => {
//             if (i === 0) return [Number((this.props.orderBookMid - boundDiff).toFixed(allowedFloat))]
//             if (i + 1 === Math.round(intervals / 2)) return [...p, this.props.orderBookMid]
//             return [...p, Number((p[i - 1] + step).toFixed(allowedFloat))]
//           }, [])
//
//           return res
//         },
//         lineWidth: 1,
//         tickAmount: 5,
//         yAxis: 0
//       }, {
//         labels: {
//           enabled: false,
//         },
//         top: '65%',
//         height: '35%',
//         offset: 0,
//         lineWidth: 2
//       }],
//       series: [{
//         type: 'candlestick'
//       }, {
//         type: 'column',
//         yAxis: 1
//       }]
//     })
//
//     window.addEventListener('resize', this.debouncedUpdateGraph)
//
//     this.candlestickGraph.addEventListener('mousemove', this.determineHoveredPrice)
//
//     this.updateGraph()
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (!isEqual(this.props.marketPriceHistory, nextProps.marketPriceHistory)) this.updateGraph()
//
//     if (!isEqual(this.props.hoveredPrice, nextProps.hoveredPrice)) this.updateCrosshair(nextProps.hoveredPrice)
//   }
//
//   componentWillUnmount() {
//     this.outcomeCandlestick.destroy()
//     window.removeEventListener('resize', this.debouncedUpdateGraph)
//     this.candlestickGraph.removeEventListener('mousemove', this.determineHoveredPrice)
//   }
//
//   determineHoveredPrice(event) {
//     const yValue = this.outcomeCandlestick.yAxis[0].toValue(event.chartY)
//
//     if (yValue > this.props.marketMax || yValue < this.props.marketMin) return this.props.updateHoveredPrice(null)
//
//     this.props.updateHoveredPrice(yValue)
//   }
//
//   updateGraph() {
//     this.outcomeCandlestick.series[0].setData(this.props.marketPriceHistory, false)
//     this.outcomeCandlestick.series[1].setData(this.props.marketPriceHistory, false)
//
//     this.outcomeCandlestick.yAxis[0].drawCrosshair({ chartY: 100 })
//
//     this.outcomeCandlestick.redraw()
//   }
//
//   updateCrosshair(hoveredPrice) {
//     // clear the old crosshair
//     this.outcomeCandlestick.yAxis[0].removePlotLine('candlestick_price_crosshair')
//
//     // conditionally render to crosshair
//     if (hoveredPrice !== null) {
//       this.outcomeCandlestick.yAxis[0].addPlotLine({
//         value: hoveredPrice,
//         color: 'red',
//         width: 1,
//         id: 'candlestick_price_crosshair'
//       })
//     }
//   }
//
//   render() {
//     return (
//       <section className={Styles.MarketOutcomeCandlestick}>
//         <div
//           ref={(candlestickGraph) => { this.candlestickGraph = candlestickGraph }}
//           id='market_outcome_candlestick'
//           className={Styles.MarketOutcomeCandlestick__graph}
//         />
//       </section>
//     )
//   }
// }


//
// <div className={Styles.MarketOutcomesGraph}>
//     <h3>price (eth) of each outcome</h3>
//     <div className={Styles[`MarketOutcomesGraph__graph-header`]}>
//       <span className={Styles.MarketOutcomesGraph__details}>
//         {s.hoveredOutcome === null ?
//           'select an outcome to begin placing an order' :
//           <span>
//             <span className={Styles.MarketOutcomesGraph__name}>
//               {s.hoveredOutcome.name}
//             </span>
//             <span className={Styles.MarketOutcomesGraph__price}>
//               last: {s.hoveredOutcome.price.toFixed(4)} eth
//             </span>
//             <span className={Styles.MarketOutcomesGraph__instruction}>
//               click to view more information about this outcome
//             </span>
//           </span>
//         }
//       </span>
//       <div>
//         <span >Filter (TODO)</span>
//       </div>
//     </div>
//     <div
//       id='market_outcome_candlestick'
//       className={Styles.MarketOutcomesGraph__graph}
//     />
// </div>
