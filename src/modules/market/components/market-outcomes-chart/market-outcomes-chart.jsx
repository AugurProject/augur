import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Highstock from 'highcharts/js/highstock'
// import noData from 'highcharts/modules/no-data-to-display'
// import { isEqual } from 'lodash'
// import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import debounce from 'utils/debounce'

import Styles from 'modules/market/components/market-outcomes-chart/market-outcomes-chart.styles'

export default class MarketOutcomesChart extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    selectedOutcomes: PropTypes.any, // NOTE -- There is a PR to handle null values, but until then..
    updateSelectedOutcomes: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredOutcome: null,
      selectedOutcome: null // NOTE -- Just a placeholder until outcomes are implemented
    }

    this.updateChart = this.updateChart.bind(this)
    this.debouncedUpdateChart = debounce(this.updateChart.bind(this))
  }

  componentDidMount() {
    // noData(Highstock)
    //
    // Highstock.setOptions({
    //   lang: {
    //     thousandsSep: ','
    //   }
    // })
    //
    // this.marketOutcomesChart = new Highstock.Chart('market_outcomes_chart', {
    //   title: {
    //     text: null
    //   },
    //   chart: {
    //     spacingTop: 1,
    //     spacingRight: 0,
    //     spacingLeft: 0
    //   },
    //   lang: {
    //     noData: 'No price history'
    //   },
    //   rangeSelector: { selected: 1 },
    //   xAxis: {
    //     type: 'datetime',
    //     title: {
    //       text: null
    //     },
    //     tickLength: 7,
    //     crosshair: {
    //       snap: false,
    //       label: {
    //         enabled: true,
    //         shape: 'square'
    //       }
    //     }
    //   },
    //   yAxis: {
    //     title: {
    //       text: null
    //     },
    //     tickLength: 0,
    //     tickWidth: 0,
    //     ceiling: 1,
    //     crosshair: {
    //       snap: false,
    //       label: {
    //         enabled: true,
    //         format: '{value:.2f}',
    //         shape: 'square'
    //       }
    //     },
    //     labels: {
    //       align: 'left',
    //       y: 15,
    //       x: 0,
    //       formatter: function () { // eslint-disable-line func-names, object-shorthand
    //         return this.isFirst ? '' : this.value
    //       }
    //     }
    //   },
    //   legend: {
    //     enabled: false
    //   },
    //   tooltip: {
    //     enabled: false
    //   },
    //   plotOptions: {
    //     series: {
    //       point: {
    //         events: {
    //           mouseOver: event => this.setState({
    //             hoveredOutcome: {
    //               name: this.props.priceTimeSeries[event.target.series.index].name,
    //               price: event.target.y
    //             }
    //           }),
    //           mouseOut: event => this.setState({ hoveredOutcome: null }),
    //           click: event => this.props.updateSelectedOutcome(event.point.colorIndex)
    //         }
    //       }
    //     }
    //   },
    //   credits: {
    //     enabled: false
    //   }
    // })
    //
    // window.addEventListener('resize', this.debouncedUpdateChart)
    //
    // this.updateChart()
  }

  componentDidUpdate(prevProps) {
    // if (!isEqual(prevProps.priceTimeSeries, this.props.priceTimeSeries)) this.updateChart()
  }

  componentWillUnmount() {
    // this.marketOutcomesChart.destroy()
    // window.removeEventListener('resize', this.debouncedUpdateChart)
  }

  updateChart() {
    (this.props.priceTimeSeries || []).forEach((series, i) => {
      if (this.marketOutcomesChart.series[i] == null) {
        this.marketOutcomesChart.addSeries({
          type: 'line',
          name: series.name,
          data: series.data
        }, false)
      } else {
        this.marketOutcomesChart.series[i].setData(series.data, false)
      }
    })

    this.marketOutcomesChart.redraw()
  }

  render() {
    // const p = this.props
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
        <button
          id="market_outcomes_chart"
          className={Styles.MarketOutcomesChart__chart}
          onClick={() => this.props.updateSelectedOutcomes(0)}
        >
          <span>Charts Placeholder (clicking selects outcome 0)</span>
        </button>
      </div>
    )
  }
}
