import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CustomPropTypes from 'utils/custom-prop-types'
import { createBigNumber } from 'utils/create-big-number'

import MarketOutcomeChartsHeader from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header'
import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick'
import MarketOutcomeDepth from 'modules/market/components/market-outcome-charts--depth/market-outcome-charts--depth'
import MarketOutcomeOrderBook from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders'
import MarketOutcomeMidpoint from 'modules/market/components/market-outcome-charts--midpoint/market-outcome-charts--midpoint'

import Styles from 'modules/market/components/market-outcome-charts/market-outcome-charts.styles'

export default class MarketOutcomeCharts extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    minPrice: CustomPropTypes.bigNumber, /* required */
    maxPrice: CustomPropTypes.bigNumber, /* required */
    orderBook: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.string.isRequired,
    currentBlock: PropTypes.number.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    hasPriceHistory: PropTypes.bool.isRequired,
    hasOrders: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedPeriod: {},
      hoveredPeriod: {},
      hoveredDepth: [],
      hoveredPrice: null,
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
  }

  componentDidMount() {
    this.updateChartWidths()

    window.addEventListener('resize', this.updateChartWidths)
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
      selectedOutcome,
      updateSeletedOrderProperties,
    } = this.props
    const s = this.state

    return (
      <section className={Styles.MarketOutcomeCharts}>
        <MarketOutcomeChartsHeader
          priceTimeSeries={priceTimeSeries}
          selectedOutcome={selectedOutcome}
          hoveredPeriod={s.hoveredPeriod}
          hoveredDepth={s.hoveredDepth}
          fixedPrecision={s.fixedPrecision}
          updatePrecision={this.updatePrecision}
          updateSelectedPeriod={this.updateSelectedPeriod}
        />
        <div className={Styles.MarketOutcomeCharts__Charts}>
          <div
            ref={(candlestickContainer) => { this.candlestickContainer = candlestickContainer }}
            className={Styles.MarketOutcomeCharts__candlestick}
          >
            <MarketOutcomeCandlestick
              sharedChartMargins={s.sharedChartMargins}
              priceTimeSeries={priceTimeSeries}
              currentBlock={currentBlock}
              selectedPeriod={s.selectedPeriod}
              fixedPrecision={s.fixedPrecision}
              orderBookKeys={orderBookKeys}
              marketMax={maxPrice}
              marketMin={minPrice}
              hoveredPrice={s.hoveredPrice}
              updateHoveredPrice={this.updateHoveredPrice}
              updateHoveredPeriod={this.updateHoveredPeriod}
              updateSeletedOrderProperties={updateSeletedOrderProperties}
            />
          </div>
          <div
            ref={(ordersContainer) => { this.ordersContainer = ordersContainer }}
            className={Styles.MarketOutcomeCharts__orders}
          >
            <div className={Styles.MarketOutcomeCharts__depth}>
              <MarketOutcomeDepth
                priceTimeSeries={priceTimeSeries}
                sharedChartMargins={s.sharedChartMargins}
                fixedPrecision={s.fixedPrecision}
                orderBookKeys={orderBookKeys}
                marketDepth={marketDepth}
                marketMax={maxPrice}
                marketMin={minPrice}
                hoveredPrice={s.hoveredPrice}
                updateHoveredPrice={this.updateHoveredPrice}
                updateHoveredDepth={this.updateHoveredDepth}
                updateSeletedOrderProperties={updateSeletedOrderProperties}
              />
            </div>
            <div className={Styles.MarketOutcomeCharts__orderbook}>
              <MarketOutcomeOrderBook
                sharedChartMargins={s.sharedChartMargins}
                fixedPrecision={s.fixedPrecision}
                orderBook={orderBook}
                marketMidpoint={orderBookKeys.mid}
                hoveredPrice={s.hoveredPrice}
                updateHoveredPrice={this.updateHoveredPrice}
                updateSeletedOrderProperties={updateSeletedOrderProperties}
              />
            </div>
          </div>
          <MarketOutcomeMidpoint
            hasPriceHistory={hasPriceHistory}
            hasOrders={hasOrders}
            chartWidths={s.chartWidths}
            orderBookKeys={orderBookKeys}
            sharedChartMargins={s.sharedChartMargins}
            fixedPrecision={s.fixedPrecision}
          />
        </div>
      </section>
    )
  }
}
