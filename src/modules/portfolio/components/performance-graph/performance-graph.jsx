import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import noData from 'highcharts/modules/no-data-to-display'
import moment from 'moment'

import Dropdown from 'modules/common/components/dropdown/dropdown'

import debounce from 'utils/debounce'
import { formatEther } from 'utils/format-number'

import Styles from 'modules/portfolio/components/performance-graph/performance-graph.styles'

class PerformanceGraph extends Component {
  static propTypes = {
    universe: PropTypes.string.isRequired,
    currentAugurTimestamp: PropTypes.number.isRequired,
    getProfitLoss: PropTypes.func.isRequired,
    isAnimating: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.periodIntervals = {
      HOUR: 3600,
      HALF_DAY: 43200,
      DAY: 86400,
      WEEK: 604800,
      MONTH: 2592000,
      YEAR: 39030400,
    }

    this.timeFrames = {
      DAY: (props.currentAugurTimestamp - this.periodIntervals.DAY),
      WEEK: (props.currentAugurTimestamp - this.periodIntervals.WEEK),
      MONTH: (props.currentAugurTimestamp - this.periodIntervals.MONTH),
      ALL: 0,
    }

    this.state = {
      graphType: 'total',
      graphTypeOptions: [
        { label: 'Total', value: 'total' },
        { label: 'Total Realized', value: 'realized' },
        { label: 'Total Unrealized', value: 'unrealized' },
      ],
      graphTypeDefault: 'total',
      graphPeriod: 'DAY',
      graphPeriodOptions: [
        { label: 'Past 24hrs', value: 'DAY' },
        { label: 'Past Week', value: 'WEEK' },
        { label: 'Past Month', value: 'MONTH' },
        { label: 'All', value: 'ALL' },
      ],
      graphPeriodDefault: 'DAY',
      startTime: this.timeFrames.DAY,
      endTime: props.currentAugurTimestamp,
      selectedSeriesData: [],
      performanceData: [],
    }

    this.changeDropdown = this.changeDropdown.bind(this)
    this.updateChart = this.updateChart.bind(this)
    this.updateChartDebounced = debounce(this.updateChart.bind(this))
    this.updatePerformanceData = this.updatePerformanceData.bind(this)
    this.parsePerformanceData = this.parsePerformanceData.bind(this)
    this.chartSetup = this.chartSetup.bind(this)
    this.chartFullRefresh = this.chartFullRefresh.bind(this)
  }

  componentDidMount() {
    noData(Highcharts)
    this.chartFullRefresh(!this.props.isAnimating)
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.isAnimating && !this.props.isAnimating) || !this.state.selectedSeriesData.length) {
      // fetch data as we need a new range of info
      this.chartFullRefresh(true)
    } else if (prevState.graphPeriod !== this.state.graphPeriod) {
      this.updatePerformanceData()
    } else if (prevState.graphType !== this.state.graphType) {
      // update chart based on data we have in state, no fetch
      this.parsePerformanceData()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartDebounced)
  }

  chartFullRefresh(forceUpdate = false) {
    this.chartSetup(() => {
      if (forceUpdate) this.updatePerformanceData()
    })
  }

  chartSetup(callback = (() => {})) {
    window.removeEventListener('resize', this.updateChartDebounced)

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
            return moment.unix(this.value).format('LL')
          },
          style: {
            color: '#a7a2b2',
            fontSize: '0.625rem',
            textTransform: 'uppercase',
            fontWeight: '500',
          },
        },
        tickLength: 6,
        showFirstLabel: true,
        showLastLabel: true,
        tickPositioner(low, high) {
          const positions = [this.dataMin, this.dataMax]
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
            return `${formatEther(this.value).formattedValue} ETH`
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
          let positions = [-0.15, 0, 0.5, 1]
          if (this.series[0]) {
            positions = []
            const rangeMargin = ((this.dataMax - this.dataMin) * 0.2)
            let minTickValue = this.dataMin >= 0 ? -0.25 : (this.dataMin - rangeMargin)
            let maxTickValue = this.dataMax <= 0 ? 0.25 : (this.dataMax + rangeMargin)
            if (this.dataMin === 0 && this.dataMax > 0) {
              minTickValue = (rangeMargin * -1)
            }
            if (this.dataMax === 0 && this.dataMin < 0) {
              maxTickValue = rangeMargin
            }
            const median = ((minTickValue + maxTickValue) / 2)
            positions.push(minTickValue)
            positions.push(this.dataMin)
            if (median > 0) positions.push(0)
            positions.push(median)
            if (median < 0) positions.push(0)
            positions.push(this.dataMax)
            positions.push(maxTickValue)
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
        shared: true,
        shape: 'none',
        pointFormatter() {
          return `<p style="line-height:1.2rem"><b style="color:${this.color}">${this.y} ETH</b><br/>${moment.unix(this.x).format('LLL')}</p>`
        },
        valueDecimals: 4,
      },
      credits: {
        enabled: false,
      },
    })

    window.addEventListener('resize', this.updateChartDebounced)

    callback()
  }

  changeDropdown(value) {
    let {
      graphType,
      graphPeriod,
      startTime,
    } = this.state

    this.state.graphTypeOptions.forEach((type, ind) => {
      if (type.value === value) {
        graphType = value
      }
    })

    this.state.graphPeriodOptions.forEach((period, ind) => {
      if (period.value === value) {
        graphPeriod = value
      }
    })

    if (graphPeriod !== this.state.graphPeriod) {
      startTime = this.timeFrames[graphPeriod]
    }

    this.setState({ graphType, graphPeriod, startTime })
  }

  parsePerformanceData() {
    const {
      performanceData,
      graphType,
    } = this.state
    const selectedSeriesData = [{
      name: graphType,
      color: '#553580',
    }]
    const seriesData = []
    performanceData.forEach((object, index) => {
      const plotPoint = []
      const { profitLoss } = object
      plotPoint.push(object.timestamp)
      if (profitLoss && profitLoss[graphType]) {
        plotPoint.push(formatEther(profitLoss[graphType]).formattedValue)
      } else {
        plotPoint.push(0)
      }
      seriesData.push(plotPoint)
    })
    selectedSeriesData[0].data = seriesData
    this.setState({ selectedSeriesData }, () => {
      this.updateChart()
    })
  }

  updatePerformanceData() {
    const {
      universe,
      getProfitLoss,
    } = this.props
    const {
      startTime,
      endTime,
    } = this.state

    getProfitLoss(universe, startTime, endTime, null, (err, rawPerformanceData) => {
      if (err) return console.error(err)
      // make the first entry into the data a 0 value to make sure we start from 0 PL
      const { aggregate } = rawPerformanceData
      const interval = aggregate[1].timestamp - aggregate[0].timestamp
      let performanceData = [{ timestamp: (aggregate[0].timestamp - interval), profitLoss: { unrealized: '0', realized: '0', total: '0' } }]
      performanceData = performanceData.concat(aggregate)
      this.setState({ performanceData }, () => {
        this.parsePerformanceData()
      })
    })
  }

  updateChart() {
    const { selectedSeriesData } = this.state
    selectedSeriesData.forEach((series, i) => {
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
        this.performanceGraph.series[i].setData(series.data, false, {}, false)
      }
    })

    this.performanceGraph.redraw()
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
