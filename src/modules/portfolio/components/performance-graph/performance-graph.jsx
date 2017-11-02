import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'
import { formatEther } from 'utils/format-number'
import { formatDate } from 'utils/format-date'

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
    // console.log('componentDidMount')
    // console.log(this.props)
    // console.log(this.state)
    const id = 'performance_graph_chart'
    const series = getValue(this.props.performanceData, `${this.state.graphType}.${this.state.graphPeriod}`)[0]
    const defaultSeriesData = {
      type: 'area',
      color: '#ffffff',
      className: Styles.PerformanceGraph__Series,
      marker: {
        fillColor: 'white',
        lineColor: 'white',
      },
      name: series.name,
      data: series.data
    }

    // console.log(defaultSeriesData)

    this.performanceGraph = new Highcharts.Chart(id, {
      title: {
        text: null
      },
      chart: {
        backgroundColor: '#1e1a31',
        spacingLeft: 0,
        spacingRight: 0,
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
          formatter() {
            return formatDate(new Date(this.value)).simpleDate
          },
          style: {
            color: '#a7a2b2',
            fontSize: '1rem',
          }
        },
        tickLength: 6,
        // showFirstLabel: false,
        // showLastLabel: false,
        // minPadding: .05,
        // maxPadding: .025,
        // floor: 0,
        tickPositioner() {
          const positions = [this.dataMin - (this.dataMin * 0.1), this.dataMin, this.dataMax, this.dataMax + (this.dataMax * 0.1)]
          return positions
        }
      },
      yAxis: {
        visible: true,
        showFirstLabel: false,
        showLastLabel: true,
        title: {
          text: null,
        },
        // endOnTick: true,
        // max: Math.ceil(this.dataMax),
        opposite: false,
        labels: {
          align: 'left',
          y: 15,
          x: 5,
          format: '{value} ETH',
          formatter() {
            return formatEther(this.value).full
          },
          style: {
            color: '#a7a2b2',
            fontSize: '1rem'
          }
        },
        tickPositioner(...a) {
          // default
          let positions = [this.dataMin, (this.dataMax / 2), Math.ceil(this.dataMax) + (this.dataMax * 0.05)]

          if (this.series[0] && this.series[0].length > 0) {
            const data = this.series[0].data
            const i = data.length / 2
            const median = i % 1 === 0 ? (data[i - 1] + data[i]) / 2 : data[Math.floor(i)]
            positions = [this.dataMin, median, Math.ceil(this.dataMax) + (this.dataMax * 0.1)]
          }
          // console.log(positions)
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
        positioner(labelWidth, labelHeight, point) {
          // console.log(labelWidth, labelHeight, point)
          return { x: point.plotX - labelWidth, y: point.plotY - (labelHeight * 0.9) }
        },
        backgroundColor: 'rgba(255,255,255,0)',
        borderWidth: 0,
        headerFormat: '',
        style: {
          fontSize: '1rem'
        },
        shadow: false,
        shape: 'none',
        pointFormat: '<b style="color:{point.color}">{point.y} ETH</b>',
        valueDecimals: 2
      },
      credits: {
        enabled: false
      },
      series: [defaultSeriesData]
    })

    window.addEventListener('resize', this.updateChartDebounced)

    this.updateChart()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.performanceData !== this.props.performanceData || prevState.graphType !== this.state.graphType || prevState.graphPeriod !== this.state.graphPeriod) this.updateChart()
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
          color: '#ffffff',
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

    // console.log(this.performanceGraph)
    this.performanceGraph.redraw()
  }

  render() {
    // const p = this.props
    const s = this.state

    return (
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

export default PerformanceGraph
