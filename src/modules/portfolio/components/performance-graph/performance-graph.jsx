import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'

import Styles from 'modules/portfolio/components/performance-graph/performance-graph.styles'

// Graph Types:
// Realized, Unrealized, All

// GraphPeriods:
// 24hrs, Week, Month, All

class PerformanceGraph extends Component {
  static propTypes = {
    performanceData: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = {
      graphType: 'All',
      graphPeriod: 'day'
    }

    this.updateChart = this.updateChart.bind(this)
    this.updateChartDebounced = debounce(this.updateChart.bind(this))
  }

  componentDidMount() {
    noData(Highcharts)

    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })

    const id = 'performance_graph_chart'

    this.performanceGraph = new Highcharts.Chart(id, {
      title: {
        text: null
      },
      chart: {
        backgroundColor: '#1e1a31',
      },
      lang: {
        noData: 'No performance history.'
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        visible: true,
        type: 'datetime',
        crosshair: true,
        tickPositioner: function () {
          // TODO: this is going to need more work than this placeholder function
          const positions = [0, this.dataMin, this.dataMax]
          console.log(this.dataMin)
          console.log(this.dataMax)
          return positions
        }
      },
      yAxis: {
        visible: false,
        crosshair: true,
      },
      plotOptions: {
        series: {
          color: 'white',
          fillColor: {
            linearGradient: [0, 0, 0, '100%'],
            stops: [
              [0, Highcharts.Color('#dbdae1').setOpacity(0.25).get('rgba')],
              [0.5, Highcharts.Color('#dbdae1').setOpacity(0.15).get('rgba')],
              [1, Highcharts.Color('#dbdae1').setOpacity(0).get('rgba')]
            ]
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<span style="color: #372e4b;">{series.name}</span>: <b>{point.y} ETH Tokens</b><br/>',
        valueDecimals: 2
      },
      credits: {
        enabled: false
      }
    });

    window.addEventListener('resize', this.updateChartDebounced)

    this.updateChart()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.performanceData !== this.props.performanceData) this.updateChartDebounced()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartDebounced)
  }

  updateChart() {
    console.log(this.performanceGraph);
    console.log(this.performanceGraph.getChartSize());
    console.log(this.performanceGraph.chartWidth, this.refs.performance_graph_container.clientWidth, (this.performanceGraph.chartWidth > this.refs.performance_graph_container.clientWidth));

    (getValue(this.props.performanceData, `${this.state.graphType}.${this.state.graphPeriod}`) || []).forEach((series, i) => {
      if (this.performanceGraph.series[i] == null) {
        this.performanceGraph.addSeries({
          type: 'area',
          color: 'white',
          className: Styles.PerformanceGraph__Series,
          marker: {
            fillColor: 'white',
            lineColor: 'white',
          },
          name: series.name,
          data: series.data
        }, false)
      } else {
        this.performanceGraph.series[i].setData(series.data, false)
      }
    })
    this.performanceGraph.redraw()
  }

  render() {
    const p = this.props

    return(
      <section
        className={Styles.PerformanceGraph}
        ref="performance_graph_container"
      >
        <div id="performance_graph_chart" />
      </section>
    )
  }
}

export default PerformanceGraph;
