import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ScrollSnap from 'scroll-snap'
import logError from 'utils/log-error'

import debounce from 'utils/debounce'

import MarketOutcomeCandlestick
  from 'modules/market/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth'
import MarketOutcomeOrderBook
  from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders'
import MarketOutcomeMidpoint
  from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint'

import Styles from 'modules/market/components/market-outcome-charts/market-outcome-charts.styles'
import { loadCandleStickData } from 'modules/market/actions/load-candlestick-data'

import { BigNumber } from 'bignumber.js'
import { clampPeriodByRange, defaultRangePeriodDurations } from 'src/modules/market/helpers'

export default class MarketOutcomeCharts extends Component {
  static propTypes = {
    currentTimeInSeconds: PropTypes.number,
    excludeCandlestick: PropTypes.bool,
    fixedPrecision: PropTypes.number.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    hasPriceHistory: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    marketDepth: PropTypes.object.isRequired,
    marketId: PropTypes.string,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    orderBook: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    outcomeName: PropTypes.string,
    priceTimeSeries: PropTypes.array,
    selectedOutcome: PropTypes.object.isRequired,
    updatePrecision: PropTypes.func,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.snapConfig = {
      scrollSnapDestination: '100% 0%',
      scrollTime: 300,
    }

    this.snapScroller = null

    const { range, period } = defaultRangePeriodDurations
    this.state = {
      candleScrolled: true,
      selectedPeriod: period,
      selectedRange: range,
      hoveredPeriod: {},
      hoveredDepth: [],
      hoveredPrice: null,
      headerHeight: 0,
      priceTimeSeriesCandleStick: [],
      sharedChartMargins: {
        top: 0,
        bottom: 30,
      },
      chartWidths: {
        candle: 0,
        orders: 0,
      },
    }

    this.updateHoveredPeriod = this.updateHoveredPeriod.bind(this)
    this.updateHoveredPrice = this.updateHoveredPrice.bind(this)
    this.updateHoveredDepth = this.updateHoveredDepth.bind(this)
    this.updateSelectedPeriod = this.updateSelectedPeriod.bind(this)
    this.updateSelectedRange = this.updateSelectedRange.bind(this)
    this.updateChartWidths = this.updateChartWidths.bind(this)
    this.debouncedUpdateChartWidths = debounce(this.updateChartWidths, 500)
    this.snapScrollHandler = this.snapScrollHandler.bind(this)
    this.updateChartHeaderHeight = this.updateChartHeaderHeight.bind(this)
    this.updateChartsWidth = this.updateChartWidths.bind(this)
    this.determineActiveScrolledChart = this.determineActiveScrolledChart.bind(this)
  }

  componentDidMount() {
    this.updateChartWidths()

    this.snapScrollHandler()

    if (this.props.selectedOutcome && !this.props.excludeCandlestick && this.props.currentTimeInSeconds) {
      this.getData()
    }

    window.addEventListener('resize', this.debouncedUpdateChartWidths)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.isMobile &&
      prevProps.isMobile !== this.props.isMobile
    ) {
      this.snapScrollHandler()
    }

    if ((prevState.selectedPeriod !== this.state.selectedPeriod || prevState.selectedRange !== this.state.selectedRange || prevProps.selectedOutcome.id !== this.props.selectedOutcome.id || prevProps.currentTimeInSeconds !== this.props.currentTimeInSeconds) && !this.props.excludeCandlestick) {
      this.getData()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedUpdateChartWidths)
  }

  getData() {
    const {
      currentTimeInSeconds,
      marketId,
      selectedOutcome,
    } = this.props

    const {
      selectedPeriod,
      selectedRange,
    } = this.state

    // This prevents the candlestick from continuously shifting around.
    const currentTimeAsMultipleOfPeriod = Math.floor(currentTimeInSeconds / selectedPeriod) * selectedPeriod

    loadCandleStickData({
      marketId,
      period: selectedPeriod,
      start: currentTimeAsMultipleOfPeriod - selectedRange,
      end: currentTimeInSeconds,
      outcome: selectedOutcome.id,
    }, (err, data) => {
      if (err) return logError(err)

      const priceTimeSeriesCandleStick = data[selectedOutcome.id] || []
      this.setState({
        priceTimeSeriesCandleStick,
        hasPriceHistory: priceTimeSeriesCandleStick.length !== 0,
      })
    })
  }

  updateHoveredDepth(hoveredDepth) {
    this.setState({
      hoveredDepth,
    })
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice,
    })
  }

  updateSelectedPeriod(selectedPeriod) {
    this.setState({
      selectedPeriod,
    })
  }

  updateSelectedRange(selectedRange) {
    const selectedPeriod = clampPeriodByRange(selectedRange, this.state.selectedPeriod)
    this.setState({
      selectedPeriod,
      selectedRange,
    })
  }

  updateChartWidths() { // NOTE -- utilized for the midpoint component's null state rendering
    this.setState({
      chartWidths: {
        candle: this.candlestickContainer ? this.candlestickContainer.clientWidth : 0,
        orders: this.ordersContainer ? this.ordersContainer.clientWidth : 0,
      },
    })
  }

  updateChartHeaderHeight(headerHeight) {
    this.setState({
      headerHeight,
    })
  }

  updateHoveredPeriod(hoveredPeriod) {
    this.setState({
      hoveredPeriod,
    })
  }

  snapScrollHandler() {
    if (
      this.snapScroller === null &&
      this.charts != null &&
      this.snapConfig != null
    ) {
      this.snapScroller = new ScrollSnap(this.charts, this.snapConfig)
    }

    if (this.snapScroller != null) {
      if (this.props.isMobile) {
        this.snapScroller.bind(this.determineActiveScrolledChart)
        this.determineActiveScrolledChart()
      } else {
        this.snapScroller.unbind()
      }
    }
  }

  determineActiveScrolledChart() {
    this.setState({
      candleScrolled: this.charts.scrollLeft === 0,
    })
  }

  render() {
    const {
      currentTimeInSeconds,
      outcomeName,
      hasOrders,
      marketDepth,
      maxPrice,
      minPrice,
      orderBook,
      orderBookKeys,
      priceTimeSeries,
      updateSelectedOrderProperties,
      excludeCandlestick,
      isMobile,
      fixedPrecision,
      updatePrecision,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.MarketOutcomeCharts}>
        <div
          ref={(charts) => { this.charts = charts }}
          className={classNames(Styles.MarketOutcomeCharts__charts, {
            [Styles['MarketOutcomeCharts__charts--mobile']]: isMobile,
          })}
        >
          {excludeCandlestick ||
            <div
              ref={(candlestickContainer) => { this.candlestickContainer = candlestickContainer }}
              className={classNames(Styles.MarketOutcomeCharts__candlestick, {
                [Styles['MarketOutcomeCharts__candlestick--mobile']]: isMobile,
              })}
            >
              <MarketOutcomeCandlestick
                currentTimeInSeconds={currentTimeInSeconds}
                outcomeName={outcomeName}
                isMobile={isMobile}
                sharedChartMargins={s.sharedChartMargins}
                priceTimeSeries={s.priceTimeSeriesCandleStick}
                selectedPeriod={s.selectedPeriod}
                selectedRange={s.selectedRange}
                fixedPrecision={fixedPrecision}
                orderBookKeys={orderBookKeys}
                marketMax={maxPrice}
                marketMin={minPrice}
                hoveredPrice={s.hoveredPrice}
                hoveredPeriod={s.hoveredPeriod}
                updateHoveredPrice={this.updateHoveredPrice}
                updateHoveredPeriod={this.updateHoveredPeriod}
                updateSelectedPeriod={this.updateSelectedPeriod}
                updateSelectedRange={this.updateSelectedRange}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
              />
            </div>
          }
          <div
            ref={(ordersContainer) => { this.ordersContainer = ordersContainer }}
            className={classNames(Styles.MarketOutcomeCharts__orders, {
              [Styles['MarketOutcomeCharts__orders--mobile']]: isMobile,
            })}
          >
            <div className={Styles.MarketOutcomeCharts__depth}>
              <MarketOutcomeDepth
                headerHeight={s.headerHeight}
                isMobile={isMobile}
                priceTimeSeries={priceTimeSeries}
                sharedChartMargins={s.sharedChartMargins}
                fixedPrecision={fixedPrecision}
                orderBookKeys={orderBookKeys}
                marketDepth={marketDepth}
                marketMax={maxPrice}
                marketMin={minPrice}
                hoveredPrice={s.hoveredPrice}
                hoveredDepth={s.hoveredDepth}
                updateHoveredPrice={this.updateHoveredPrice}
                updateHoveredDepth={this.updateHoveredDepth}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
                updateChartHeaderHeight={this.updateChartHeaderHeight}
              />
            </div>
            <div className={Styles.MarketOutcomeCharts__orderbook}>
              <MarketOutcomeOrderBook
                headerHeight={s.headerHeight}
                isMobile={isMobile}
                sharedChartMargins={s.sharedChartMargins}
                fixedPrecision={fixedPrecision}
                orderBook={orderBook}
                marketMidpoint={orderBookKeys.mid}
                hoveredPrice={s.hoveredPrice}
                updateHoveredPrice={this.updateHoveredPrice}
                updatePrecision={updatePrecision}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
              />
            </div>
          </div>
          <MarketOutcomeMidpoint
            isMobile={isMobile}
            excludeCandlestick={excludeCandlestick}
            hasPriceHistory={s.hasPriceHistory}
            hasOrders={hasOrders}
            chartWidths={s.chartWidths}
            headerHeight={s.headerHeight}
            orderBookKeys={orderBookKeys}
            sharedChartMargins={s.sharedChartMargins}
            fixedPrecision={fixedPrecision}
          />
        </div>
        {isMobile &&
          <div className={Styles.MarketOutcomeCharts__indicator}>
            <div
              className={classNames(Styles.MarketOutcomeCharts__dot, {
                [Styles['MarketOutcomeCharts__dot--active']]: s.candleScrolled,
              })}
            />
            <div
              className={classNames(Styles.MarketOutcomeCharts__dot, {
                [Styles['MarketOutcomeCharts__dot--active']]: !s.candleScrolled,
              })}
            />
          </div>
        }
      </section>
    )
  }
}
