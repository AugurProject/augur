import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import Dropdown from 'modules/common/components/dropdown/dropdown'

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
    	graphType: 'Total',
    	graphTypeOptions: [
        { label: 'Total', value: 'Total' },
        { label: 'Total Realized', value: 'Realized' },
        { label: 'Total Unrealized', value: 'Unrealized' }
      ],
      graphTypeDefault: 'Total',
    	graphPeriod: 'day',
    	graphPeriodOptions: [
        { label: 'Past 24hrs', value: 'day' },
        { label: 'Past Week', value: 'week' },
        { label: 'Past Month', value: 'month' },
        { label: 'All', value: 'all' }
      ],
      graphPeriodDeafault: 'day'
    }

    this.changeDropdown = this.changeDropdown.bind(this)
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
        crosshair: {
          width: 4,
        },
        labels: {
          // align: '',
          style: {
            color: '#a7a2b2',
            fontSize: '1rem'
          }
        },
        tickPositioner: function () {
          // TODO: this is going to need more work than this placeholder function
          const positions = [this.dataMin, this.dataMax]
          // console.log(this.dataMin)
          // console.log(this.dataMax)
          return positions
        }
      },
      yAxis: {
        visible: true,
        // crosshair: {
        //   width: 1,
        // },
        showFirstLabel: false,
        showLastLabel: false,
        title: {
          text: null,
        },
        opposite: false,
        labels: {
          align: 'left',
          y: 15,
          x: 5,
          format: '{value} ETH',
          // x: -20,
          style: {
            // @color-lightgray: #a7a2b2;
            // @color-lightergray: #dbdae1;
            // @color-lightest-gray: #dfdfdf;
            // @color-offwhite: #f0eff6;
            color: '#a7a2b2',
            fontSize: '1rem'
          }
        },
        tickPositioner: function () {
          // TODO: this is going to need more work than this placeholder function
          const positions = [this.dataMin, (this.dataMax / 2), this.dataMax]
          // console.log(this.dataMin)
          // console.log(this.dataMax)
          return positions
        }
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.performanceData !== this.props.performanceData || prevState.graphType !== this.state.graphType || prevState.graphPeriod !== this.state.graphPeriod) this.updateChartDebounced()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartDebounced)
  }

  changeDropdown(value) {
    let newType = this.state.graphType
    let newPeriod = this.state.graphPeriod

    this.state.graphTypeOptions.forEach((type, ind) => {
      if (type.value === value) {
        newType = value
      }
    })

    this.state.graphPeriodOptions.forEach((period, ind) => {
      if (period.value === value) {
        newPeriod = value
      }
    })

    this.setState({ graphType: newType, graphPeriod: newPeriod })
  }

  updateChart() {
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
    const s = this.state

    return(
      <section
        className={Styles.PerformanceGraph}
      >
        <div
          className={Styles.PerformanceGraph__SortBar}
        >
          <div
            className={Styles['PerformanceGraph__SortBar-title']}
          >
            Profits/losses
          </div>
          <div
            className={Styles['PerformanceGraph__SortBar-dropdowns']}
          >
            <Dropdown default={s.graphTypeDefault} options={s.graphTypeOptions} onChange={this.changeDropdown} />
            <Dropdown default={s.graphPeriodDefault} options={s.graphPeriodOptions} onChange={this.changeDropdown} />
          </div>
        </div>
        <div id="performance_graph_chart" />
      </section>
    )
  }
}

export default PerformanceGraph;
