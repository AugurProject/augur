import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import ScrollSnap from 'scroll-snap'

import CustomPropTypes from 'utils/custom-prop-types'

import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth'
import MarketOutcomeOrderBook from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders'
import MarketOutcomeMidpoint from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint'

import Styles from 'modules/market/components/market-outcome-charts/market-outcome-charts.styles'

export default class MarketOutcomeCharts extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    minPrice: CustomPropTypes.bigNumber, /* required */
    maxPrice: CustomPropTypes.bigNumber, /* required */
    orderBook: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    hasPriceHistory: PropTypes.bool,
    hasOrders: PropTypes.bool.isRequired,
    priceTimeSeries: PropTypes.array,
    excludeCandlestick: PropTypes.bool,
    currentBlock: PropTypes.number,
  }

  constructor(props) {
    super(props)

    this.snapConfig = {
      scrollSnapDestination: '100% 0%',
      scrollTime: 300,
    }

    this.snapScroller = null

    this.state = {
      candleScrolled: true,
      selectedPeriod: {},
      hoveredPeriod: {},
      hoveredDepth: [],
      hoveredPrice: null,
      headerHeight: 0,
      fixedPrecision: 4,
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
    this.updatePrecision = this.updatePrecision.bind(this)
    this.updateHoveredDepth = this.updateHoveredDepth.bind(this)
    this.updateSelectedPeriod = this.updateSelectedPeriod.bind(this)
    this.updateChartWidths = this.updateChartWidths.bind(this)
    this.snapScrollHandler = this.snapScrollHandler.bind(this)
    this.updateChartHeaderHeight = this.updateChartHeaderHeight.bind(this)
    this.updateChartsWidth = this.updateChartWidths.bind(this)
    this.determineActiveScrolledChart = this.determineActiveScrolledChart.bind(this)
  }

  componentDidMount() {
    this.updateChartWidths()

    this.snapScrollHandler()

    window.addEventListener('resize', this.updateChartWidths)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.isMobile &&
      prevProps.isMobile !== this.props.isMobile
    ) {
      this.snapScrollHandler()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateChartWidths)
  }

  updateHoveredPeriod(hoveredPeriod) {
    this.setState({
      hoveredPeriod,
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

  updatePrecision(isIncreasing) {
    let { fixedPrecision } = this.state

    if (isIncreasing) {
      fixedPrecision += 1
    } else {
      fixedPrecision = fixedPrecision - 1 < 0 ? 0 : fixedPrecision -= 1
    }

    return this.setState({ fixedPrecision })
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
    console.log('here!@ -- ', this.charts.scrollLeft)
    this.setState({
      candleScrolled:  this.charts.scrollLeft === 0 ? true : false
    })
  }

  render() {
    const {
      currentBlock,
      hasOrders,
      hasPriceHistory,
      marketDepth,
      maxPrice,
      minPrice,
      orderBook,
      orderBookKeys,
      priceTimeSeries,
      updateSeletedOrderProperties,
      excludeCandlestick,
      isMobile,
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
                isMobile={isMobile}
                sharedChartMargins={s.sharedChartMargins}
                priceTimeSeries={priceTimeSeries}
                currentBlock={currentBlock}
                selectedPeriod={s.selectedPeriod}
                fixedPrecision={s.fixedPrecision}
                orderBookKeys={orderBookKeys}
                marketMax={maxPrice}
                marketMin={minPrice}
                hoveredPrice={s.hoveredPrice}
                hoveredPeriod={s.hoveredPeriod}
                updateHoveredPrice={this.updateHoveredPrice}
                updateHoveredPeriod={this.updateHoveredPeriod}
                updateSelectedPeriod={this.updateSelectedPeriod}
                updateSeletedOrderProperties={updateSeletedOrderProperties}
                updateChartHeaderHeight={this.updateChartHeaderHeight}
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
                fixedPrecision={s.fixedPrecision}
                orderBookKeys={orderBookKeys}
                marketDepth={marketDepth}
                marketMax={maxPrice}
                marketMin={minPrice}
                hoveredPrice={s.hoveredPrice}
                hoveredDepth={s.hoveredDepth}
                updateHoveredPrice={this.updateHoveredPrice}
                updateHoveredDepth={this.updateHoveredDepth}
                updateSeletedOrderProperties={updateSeletedOrderProperties}
              />
            </div>
            <div className={Styles.MarketOutcomeCharts__orderbook}>
              <MarketOutcomeOrderBook
                headerHeight={s.headerHeight}
                isMobile={isMobile}
                sharedChartMargins={s.sharedChartMargins}
                fixedPrecision={s.fixedPrecision}
                orderBook={orderBook}
                marketMidpoint={orderBookKeys.mid}
                hoveredPrice={s.hoveredPrice}
                updateHoveredPrice={this.updateHoveredPrice}
                updatePrecision={this.updatePrecision}
                updateSeletedOrderProperties={updateSeletedOrderProperties}
              />
            </div>
          </div>
          <MarketOutcomeMidpoint
            isMobile={isMobile}
            excludeCandlestick={excludeCandlestick}
            hasPriceHistory={hasPriceHistory}
            hasOrders={hasOrders}
            chartWidths={s.chartWidths}
            headerHeight={s.headerHeight}
            orderBookKeys={orderBookKeys}
            sharedChartMargins={s.sharedChartMargins}
            fixedPrecision={s.fixedPrecision}
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
