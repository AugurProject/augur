import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highchart from 'highcharts/js/highstock'
import noData from 'highcharts/modules/no-data-to-display'
import { isEqual } from 'lodash'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import debounce from 'utils/debounce'

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

    this.PLOT_BACKGROUND = 'PLOT_BACKGROUND'
    this.SERIES = 'SERIES'

    this.updateGraph = this.updateGraph.bind(this)
    this.debouncedUpdateGraph = debounce(this.updateGraph.bind(this))
    this.determineHoveredPrice = this.determineHoveredPrice.bind(this)
  }

  componentDidMount() {
    noData(Highchart)

    Highchart.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    this.outcomeCandlestick = Highchart.stockChart('market_outcome_candlestick', {
      chart: {
        animation: false,
        panning: false,
        marginLeft: 20,
      },
      rangeSelector: {
        enabled: false
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      navigator: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      panning: false,
      zoom: false,
      yAxis: [{
        opposite: false,
        labels: {
          align: 'left',
          y: 15,
          x: -20,
          formatter: function () { // eslint-disable-line func-names, object-shorthand
            return this.isFirst ? '' : this.value
          }
        },
        tickPositioner: () => {
          // Can only use odd numbered intervals so midpoint is always centered
          const intervals = 5
          const allowedFloat = 2
          const padding = 0.2 // percentage padding

          // Determine bounding diff
          const maxDiff = Math.abs(this.props.orderBookMid - this.props.outcomeMax)
          const minDiff = Math.abs(this.props.orderBookMid - this.props.outcomeMin)
          const boundDiff = (maxDiff > minDiff ? maxDiff : minDiff) * (1 + padding)

          // Set interval step
          const step = boundDiff / ((intervals - 1) / 2)

          const res = new Array(intervals).fill(null).reduce((p, _unused, i) => {
            if (i === 0) return [Number((this.props.orderBookMid - boundDiff).toFixed(allowedFloat))]
            if (i + 1 === Math.round(intervals / 2)) return [...p, this.props.orderBookMid]
            return [...p, Number((p[i - 1] + step).toFixed(allowedFloat))]
          }, [])

          return res
        },
        lineWidth: 1,
        tickAmount: 5,
        yAxis: 0
      }, {
        labels: {
          enabled: false,
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],
      series: [{
        type: 'candlestick'
      }, {
        type: 'column',
        yAxis: 1
      }]
    })

    window.addEventListener('resize', this.debouncedUpdateGraph)

    this.candlestickGraph.addEventListener('mousemove', this.determineHoveredPrice)

    this.updateGraph()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.marketPriceHistory, this.props.marketPriceHistory)) this.updateGraph()
  }

  componentWillUnmount() {
    this.outcomeCandlestick.destroy()
    window.removeEventListener('resize', this.debouncedUpdateGraph)
    this.candlestickGraph.removeEventListener('mousemove', e => console.log('moved -- ', e.target))
  }

  updateGraph() {
    this.outcomeCandlestick.series[0].setData(this.props.marketPriceHistory, false)
    this.outcomeCandlestick.series[1].setData(this.props.marketPriceHistory, false)

    this.outcomeCandlestick.redraw()
  }

  determineHoveredPrice(event) {
    const yValue = this.outcomeCandlestick.yAxis[0].toValue(event.chartY)

    if (yValue > this.props.marketMax || yValue < this.props.marketMin) return this.props.updateHoveredPrice(null)

    this.props.updateHoveredPrice(yValue)
  }

  render() {
    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <div
          ref={(candlestickGraph) => { this.candlestickGraph = candlestickGraph }}
          id="market_outcome_candlestick"
          className={Styles.MarketOutcomeCandlestick__graph}
        />
      </section>
    )
  }
}
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
//       id="market_outcome_candlestick"
//       className={Styles.MarketOutcomesGraph__graph}
//     />
// </div>
