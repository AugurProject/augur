import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highstock from 'highstock-release/js/highstock'
import noData from 'highstock-release/modules/no-data-to-display'
import { isEqual } from 'lodash'
import { ChevronDown, ChevronUp } from 'modules/common/components/icons/icons'

import debounce from 'utils/debounce'

import Styles from 'modules/market/components/market-outcomes-graph/market-outcomes-graph.styles'

export default class MarketOutcomesGraph extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    selectedOutcome: PropTypes.any, // NOTE -- There is a PR to handle null values, but until then..
    updateSelectedOutcome: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredOutcome: null,
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

    this.marketOutcomesGraph = new Highstock.Chart('market_outcomes_graph', {
      title: {
        text: null
      },
      chart: {
        height: 300, // mirror this height in css container height declaration,
        spacingTop: 1,
        spacingRight: 0,
        spacingLeft: 0
      },
      lang: {
        noData: 'No price history'
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        type: 'datetime',
        title: {
          text: null
        },
        tickLength: 7,
        crosshair: {
          snap: false,
          label: {
            enabled: true,
            shape: 'square'
          }
        }
      },
      yAxis: {
        title: {
          text: null
        },
        tickLength: 0,
        tickWidth: 0,
        ceiling: 1,
        crosshair: {
          snap: false,
          label: {
            enabled: true,
            format: '{value:.2f}',
            shape: 'square'
          }
        },
        labels: {
          align: 'left',
          y: 15,
          x: 0,
          formatter: function () { // eslint-disable-line func-names, object-shorthand
            return this.isFirst ? '' : this.value
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      plotOptions: {
        series: {
          point: {
            events: {
              mouseOver: event => this.setState({
                hoveredOutcome: {
                  name: this.props.priceTimeSeries[event.target.series.index].name,
                  price: event.target.y
                }
              }),
              mouseOut: event => this.setState({ hoveredOutcome: null }),
              click: event => this.props.updateSelectedOutcome(event.point.colorIndex)
            }
          }
        }
      },
      credits: {
        enabled: false
      }
    })

    window.addEventListener('resize', this.debouncedUpdateGraph)

    this.updateGraph()
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.priceTimeSeries, this.props.priceTimeSeries)) this.updateGraph()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedUpdateGraph)
  }

  updateGraph() {
    (this.props.priceTimeSeries || []).forEach((series, i) => {
      if (this.marketOutcomesGraph.series[i] == null) {
        this.marketOutcomesGraph.addSeries({
          type: 'line',
          name: series.name,
          data: series.data
        }, false)
      } else {
        this.marketOutcomesGraph.series[i].setData(series.data, false)
      }
    })

    this.marketOutcomesGraph.redraw()
  }

  render() {
    const p = this.props
    const s = this.state

    return (
      <div className={Styles.MarketOutcomesGraph}>
        {p.selectedOutcome === null &&
          <div>
            <h3>price (eth) of each outcome</h3>
            <div className={Styles[`MarketOutcomesGraph__graph-header`]}>
              <span className={Styles.MarketOutcomesGraph__details}>
                {s.hoveredOutcome === null ?
                  'select an outcome to begin placing an order' :
                  <span>
                    <span className={Styles.MarketOutcomesGraph__name}>
                      {s.hoveredOutcome.name}
                    </span>
                    <span className={Styles.MarketOutcomesGraph__price}>
                      last: {s.hoveredOutcome.price.toFixed(4)} eth
                    </span>
                    <span className={Styles.MarketOutcomesGraph__instruction}>
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
              id="market_outcomes_graph"
              className={Styles.MarketOutcomesGraph__graph}
            />
          </div>
        }
      </div>
    )
  }
}
