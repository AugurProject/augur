import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'
import moment from 'moment'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import debounce from 'utils/debounce'
import getValue from 'utils/get-value'
import { formatEther } from 'utils/format-number'
import { formatDate } from 'utils/format-date'

import Styles from 'modules/portfolio/components/performance-graph/performance-graph.styles'

class PerformanceGraph extends Component {
  static propTypes = {
    performanceData: PropTypes.object,
    universe: PropTypes.string,
    currentAugurTimestamp: PropTypes.number,
    getProfitLoss: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.periodIntervals = {
      HOUR: 3600,
      DAY: 86400,
      WEEK: 604800,
      MONTH: 2419200,
      ALL: 0,
    }

    this.state = {
      graphType: 'unrealized',
      graphTypeOptions: [
        { label: 'Total', value: 'total' },
        { label: 'Total Realized', value: 'realized' },
        { label: 'Total Unrealized', value: 'unrealized' },
      ],
      graphTypeDefault: 'unrealized',
      graphPeriod: 'DAY',
      graphPeriodOptions: [
        { label: 'Past 24hrs', value: 'DAY' },
        { label: 'Past Week', value: 'WEEK' },
        { label: 'Past Month', value: 'MONTH' },
        { label: 'All', value: 'ALL' },
      ],
      graphPeriodDefault: 'DAY',
      startTime: (props.currentAugurTimestamp - this.periodIntervals.DAY),
    }

    this.changeDropdown = this.changeDropdown.bind(this)
    this.updateChart = this.updateChart.bind(this)
    this.updateChartDebounced = debounce(this.updateChart.bind(this))
  }

  componentDidMount() {
    noData(Highcharts)

    Highcharts.setOptions({
      lang: {
        thousandsSep: ',',
      },
    })
    const id = 'performance_graph_chart'

    this.performanceGraph = new Highcharts.Chart(id, {
      title: {
        text: null,
      },
      chart: {
        backgroundColor: 'transparent',
        height: '220px',
        spacingLeft: 0,
        spacingRight: 0,
      },
      events: {
        load() {
          this.customTexts = []

          const text = this.renderer.text(
            'Responsive text',
            this.xAxis[0].toPixels(20),
            this.yAxis[0].toPixels(60),
          )
            .css({
              fontSize: '10px',
            })
            .add()

          this.customTexts.push(text)
        },
        redraw() {
          this.customTexts[0].attr({
            x: this.xAxis[0].toPixels(15),
            y: this.yAxis[0].toPixels(50),
          })
        },
      },
      lang: {
        noData: 'No performance history.',
      },
      rangeSelector: { selected: 1 },
      xAxis: {
        visible: true,
        type: 'datetime',
        lineColor: '#686177',
        crosshair: {
          width: 4,
          color: '#6f697e',
        },
        labels: {
          formatter() {
            return formatDate(new Date(this.value)).simpleDate
          },
          style: {
            color: '#a7a2b2',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            fontWeight: '500',
          },
        },
        tickLength: 6,
        showFirstLabel: false,
        showLastLabel: false,
        tickPositioner(low, high) {
          const positions = [low, this.dataMin, this.dataMax, high]
          return positions
        },
      },
      yAxis: {
        visible: true,
        showFirstLabel: false,
        showLastLabel: true,
        gridLineColor: '#686177',
        title: {
          text: null,
        },
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
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            fontWeight: '500',
          },
        },
        tickPositioner() {
          // default
          let positions = [this.dataMin, (this.dataMax / 2), Math.ceil(this.dataMax) + (this.dataMax * 0.05)]

          if (this.series[0] && this.series[0].length > 0) {
            const { data } = this.series[0]
            const i = data.length / 2
            const median = i % 1 === 0 ? (data[i - 1] + data[i]) / 2 : data[Math.floor(i)]
            positions = [this.dataMin, median, Math.ceil(this.dataMax) + (this.dataMax * 0.05)]
          }
          return positions
        },
      },
      plotOptions: {
        series: {
          color: 'white',
          fillColor: {
            linearGradient: [0, 0, 0, '100%'],
            stops: [
              [0, Highcharts.Color('#dbdae1').setOpacity(0.25).get('rgba')],
              [0.5, Highcharts.Color('#dbdae1').setOpacity(0.15).get('rgba')],
              [1, Highcharts.Color('#dbdae1').setOpacity(0).get('rgba')],
            ],
          },
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        positioner(labelWidth, labelHeight, point) {
          // tooltip wants to position top left of crosshair, this optionally
          // positions the inverse if the label will render off chart
          return { x: point.plotX - labelWidth < 0 ? point.plotX : point.plotX - labelWidth, y: point.plotY < labelHeight ? point.plotY + (labelHeight * 0.9) : point.plotY - (labelHeight * 0.9) }
        },
        backgroundColor: 'rgba(255,255,255,0)',
        borderWidth: 0,
        headerFormat: '',
        style: {
          fontSize: '0.625rem',
          color: 'white',
          fontWeight: '700',
        },
        shadow: false,
        shape: 'none',
        pointFormat: '<b style="color:{point.color}">{point.y} ETH</b>',
        valueDecimals: 2,
      },
      credits: {
        enabled: false,
      },
    })

    window.addEventListener('resize', this.updateChartDebounced)

    this.updateChart()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.graphType !== this.state.graphType || prevState.graphPeriod !== this.state.graphPeriod) this.updateChart()
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
    const {
      universe,
      currentAugurTimestamp,
      performanceData,
      getProfitLoss,
    } = this.props

    getProfitLoss(universe, this.state.startTime, currentAugurTimestamp, this.periodIntervals.HOUR, (err, performanceData) => {
      console.log(err, performanceData)
      const performanceDataPackage = [{
        name: 'Total',
        color: '#553580',
      }]
      const pData = []
      const { graphType } = this.state
      performanceData.forEach((object, index) => {
        const plotPoint = []
        const { profitLoss } = object
        plotPoint.push(object.timestamp)
        if (profitLoss && profitLoss[graphType]) {
          plotPoint.push(formatEther(profitLoss[graphType]).formattedValue)
        } else {
          plotPoint.push(0)
        }
        pData.push(plotPoint)
      })
      console.log('out', pData)
      performanceDataPackage[0].data = pData
      performanceDataPackage.forEach((series, i) => {
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
            data: series.data,
          }, false)
        } else {
          this.performanceGraph.series[i].setData(series.data, false)
        }
      })
  
      this.performanceGraph.redraw()
    })
  }

  render() {
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
