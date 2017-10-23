import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highstock from 'highcharts/highstock'
import noData from 'highcharts/modules/no-data-to-display'
import { isEqual } from 'lodash'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import debounce from 'utils/debounce'

import Styles from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick.styles'

export default class MarketOutcomeCandlestick extends Component {
  static propTypes = {
    outcomeCandlestick: PropTypes.array.isRequired,
    selectedOutcome: PropTypes.any // NOTE -- There is a PR to handle null values, but until then..
  }

  constructor(props) {
    super(props)

    console.log('outcomeSeries -- ', props.outcomeCandlestick)

    this.state = {
      selectedOutcome: null // NOTE -- Just a placeholder until outcomes are implemented
    }

    this.updateGraph = this.updateGraph.bind(this)
    this.debouncedUpdateGraph = debounce(this.updateGraph.bind(this))
  }

  componentDidMount() {
    noData(Highstock)

    Highstock.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    this.outcomeCandlestick = Highstock.stockChart('market_outcome_candlestick', {
      rangeSelector: {
        selected: 1
      }
    })

    window.addEventListener('resize', this.debouncedUpdateGraph)

    this.updateGraph()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.outcomeCandlestick, this.props.outcomeCandlestick)) this.updateGraph()
  }

  componentWillUnmount() {
    this.outcomeCandlestick.destroy()
    window.removeEventListener('resize', this.debouncedUpdateGraph)
  }

  updateGraph() {
    if (this.outcomeCandlestick.series[0] == null) {
      this.outcomeCandlestick.addSeries({
        type: 'candlestick',
        data: this.props.outcomeCandlestick
      }, false)
    } else {
      this.outcomeCandlestick.series[0].setData(this.props.outcomeCandlestick, false)
    }

    this.outcomeCandlestick.redraw()

    console.log('updateGraph -- ', this.props.outcomeCandlestick)
  }

  render() {
    // const p = this.props
    // const s = this.state

    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <div
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
