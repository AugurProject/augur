import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts/js/highcharts'
import noData from 'highcharts/modules/no-data-to-display'
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

    }

    this.updateGraph = this.updateGraph.bind(this)
    this.debouncedUpdateGraph = debounce(this.updateGraph.bind(this))
  }

  componentDidMount() {
    noData(Highcharts)

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    this.marketOutcomesGraph = new Highcharts.Chart('market_outcomes_graph', {
      title: {
        text: null
      },
      chart: {
        height: 300 // mirror this height in css container height declaration
      },
      lang: {
        noData: 'No price history'
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        type: 'datetime',
        title: {
          text: null
        }
      },
      yAxis: {
        title: {
          text: null
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} ETH</b><br/>',
        valueDecimals: 2
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
    return (
      <div>
        <h3>price (eth) of each outcome</h3>
        <div>
          <span>select an outcome to begin placing an order</span>
          <span>Filter (TODO)</span>
        </div>
        <div
          id="market_outcomes_graph"
          className={Styles.MarketOutcomesGraph__graph}
        />
      </div>
    )
  }
}
