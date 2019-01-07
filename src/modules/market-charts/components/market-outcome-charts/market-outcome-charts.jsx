import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ScrollSnap from "scroll-snap";
import logError from "utils/log-error";

import MarketOutcomeCandlestick from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick";
import MarketOutcomeDepth from "modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth";
import MarketOutcomeChartsOrders from "modules/market-charts/components/market-outcome-charts--orders/market-outcome-charts--orders";

import Styles from "modules/market-charts/components/market-outcome-charts/market-outcome-charts.styles";
import { loadCandleStickData } from "modules/markets/actions/load-candlestick-data";

import { BigNumber } from "bignumber.js";
import {
  clampPeriodByRange,
  defaultRangePeriodDurations
} from "modules/markets/helpers/range";

export default class MarketOutcomeCharts extends Component {
  static propTypes = {
    currentTimeInSeconds: PropTypes.number,
    excludeCandlestick: PropTypes.bool,
    hasOrders: PropTypes.bool.isRequired,
    marketDepth: PropTypes.object.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    orderBook: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    selectedOutcome: PropTypes.object.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    marketId: PropTypes.string,
    isMobile: PropTypes.bool,
    isMobileSmall: PropTypes.bool,
    updatePrecision: PropTypes.func,
    priceTimeSeries: PropTypes.array,
    fixedPrecision: PropTypes.number,
    outcomeName: PropTypes.string
  };

  static defaultProps = {
    marketId: null,
    fixedPrecision: 4,
    outcomeName: "",
    priceTimeSeries: [],
    excludeCandlestick: false,
    isMobile: false,
    isMobileSmall: false,
    currentTimeInSeconds: null,
    updatePrecision: () => {}
  };

  constructor(props) {
    super(props);

    this.snapConfig = {
      scrollSnapDestination: "100% 0%",
      scrollTime: 300
    };

    this.snapScroller = null;

    const { range, period } = defaultRangePeriodDurations;

    this.sharedChartMargins = {
      top: 0,
      bottom: 30
    };

    this.state = {
      candleScrolled: true,
      selectedPeriod: period,
      selectedRange: range,
      hoveredDepth: [],
      hoveredPrice: null,
      headerHeight: props.isMobile ? 20 : 0,
      priceTimeSeriesCandleStick: [],
      ordersWidth: 0
    };

    this.updateHoveredPrice = this.updateHoveredPrice.bind(this);
    this.updateHoveredDepth = this.updateHoveredDepth.bind(this);
    this.updateSelectedPeriod = this.updateSelectedPeriod.bind(this);
    this.updateSelectedRange = this.updateSelectedRange.bind(this);
    this.snapScrollHandler = this.snapScrollHandler.bind(this);
    this.updateChartHeaderHeight = this.updateChartHeaderHeight.bind(this);
    this.determineActiveScrolledChart = this.determineActiveScrolledChart.bind(
      this
    );
    this.updateOrdersWidth = this.updateOrdersWidth.bind(this);
  }

  componentDidMount() {
    this.snapScrollHandler();

    if (
      this.props.selectedOutcome &&
      !this.props.excludeCandlestick &&
      this.props.currentTimeInSeconds
    ) {
      this.getData();
    }
    this.calculateOrdersWidth();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isMobile && prevProps.isMobile !== this.props.isMobile) {
      this.snapScrollHandler();
    }

    if (
      (prevState.selectedPeriod !== this.state.selectedPeriod ||
        prevState.selectedRange !== this.state.selectedRange ||
        prevProps.selectedOutcome.id !== this.props.selectedOutcome.id ||
        prevProps.currentTimeInSeconds !== this.props.currentTimeInSeconds) &&
      !this.props.excludeCandlestick
    ) {
      this.getData();
    }
    this.calculateOrdersWidth();
  }

  getData() {
    const { currentTimeInSeconds, marketId, selectedOutcome } = this.props;

    const { selectedPeriod, selectedRange } = this.state;

    // This prevents the candlestick from continuously shifting around.
    const currentTimeAsMultipleOfPeriod =
      Math.floor(currentTimeInSeconds / selectedPeriod) * selectedPeriod;

    loadCandleStickData(
      {
        marketId,
        period: selectedPeriod,
        start: currentTimeAsMultipleOfPeriod - selectedRange,
        end: currentTimeInSeconds,
        outcome: selectedOutcome.id
      },
      (err, data) => {
        if (err) return logError(err);

        const priceTimeSeriesCandleStick = data[selectedOutcome.id] || [];
        this.setState({
          priceTimeSeriesCandleStick
        });
      }
    );
  }

  calculateOrdersWidth() {
    const width = this.ordersContainer.clientWidth;
    if (width !== this.state.ordersWidth) {
      this.updateOrdersWidth(width);
    }
  }

  updateHoveredDepth(hoveredDepth) {
    this.setState({
      hoveredDepth
    });
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice
    });
  }

  updateSelectedPeriod(selectedPeriod) {
    this.setState({
      selectedPeriod
    });
  }

  updateSelectedRange(selectedRange) {
    const selectedPeriod = clampPeriodByRange(
      selectedRange,
      this.state.selectedPeriod
    );
    this.setState({
      selectedPeriod,
      selectedRange
    });
  }

  updateChartHeaderHeight(headerHeight) {
    this.setState({
      headerHeight
    });
  }

  updateOrdersWidth(ordersWidth) {
    this.setState({
      ordersWidth
    });
  }

  snapScrollHandler() {
    if (
      this.snapScroller === null &&
      this.charts != null &&
      this.snapConfig != null
    ) {
      this.snapScroller = new ScrollSnap(this.charts, this.snapConfig);
    }

    if (this.snapScroller != null) {
      if (this.props.isMobile) {
        this.snapScroller.bind(this.determineActiveScrolledChart);
        this.determineActiveScrolledChart();
      } else {
        this.snapScroller.unbind();
      }
    }
  }

  determineActiveScrolledChart() {
    this.setState({
      candleScrolled: this.charts.scrollLeft === 0
    });
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
      isMobileSmall,
      fixedPrecision,
      pricePrecision,
      updatePrecision
    } = this.props;
    const s = this.state;

    return (
      <section className={Styles.MarketOutcomeCharts}>
        <div
          ref={charts => {
            this.charts = charts;
          }}
          className={classNames(Styles.MarketOutcomeCharts__charts, {
            [Styles["MarketOutcomeCharts__charts--mobile"]]: isMobile
          })}
        >
          {excludeCandlestick || (
            <div
              ref={candlestickContainer => {
                this.candlestickContainer = candlestickContainer;
              }}
              className={classNames(Styles.MarketOutcomeCharts__candlestick, {
                [Styles["MarketOutcomeCharts__candlestick--mobile"]]: isMobile
              })}
            >
              <MarketOutcomeCandlestick
                currentTimeInSeconds={currentTimeInSeconds}
                outcomeName={outcomeName}
                isMobile={isMobile}
                isMobileSmall={isMobileSmall}
                sharedChartMargins={this.sharedChartMargins}
                priceTimeSeries={s.priceTimeSeriesCandleStick}
                selectedPeriod={s.selectedPeriod}
                selectedRange={s.selectedRange}
                fixedPrecision={fixedPrecision}
                pricePrecision={pricePrecision}
                orderBookKeys={orderBookKeys}
                marketMax={maxPrice}
                marketMin={minPrice}
                updateSelectedPeriod={this.updateSelectedPeriod}
                updateSelectedRange={this.updateSelectedRange}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
              />
            </div>
          )}
          <div
            ref={ordersContainer => {
              this.ordersContainer = ordersContainer;
            }}
            className={classNames(Styles.MarketOutcomeCharts__orders, {
              [Styles["MarketOutcomeCharts__orders--mobile"]]: isMobile
            })}
          >
            <div className={Styles.MarketOutcomeCharts__depth}>
              <MarketOutcomeDepth
                headerHeight={s.headerHeight}
                isMobile={isMobile}
                priceTimeSeries={priceTimeSeries}
                sharedChartMargins={this.sharedChartMargins}
                fixedPrecision={fixedPrecision}
                pricePrecision={pricePrecision}
                orderBookKeys={orderBookKeys}
                marketDepth={marketDepth}
                marketMax={maxPrice}
                marketMin={minPrice}
                hasOrders={hasOrders}
                hoveredPrice={s.hoveredPrice}
                hoveredDepth={s.hoveredDepth}
                updateHoveredPrice={this.updateHoveredPrice}
                updateHoveredDepth={this.updateHoveredDepth}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
                updateChartHeaderHeight={this.updateChartHeaderHeight}
                ordersWidth={s.ordersWidth}
              />
            </div>
            <div className={Styles.MarketOutcomeCharts__orderbook}>
              <MarketOutcomeChartsOrders
                headerHeight={s.headerHeight}
                isMobile={isMobile}
                sharedChartMargins={this.sharedChartMargins}
                fixedPrecision={fixedPrecision}
                pricePrecision={pricePrecision}
                orderBook={orderBook}
                marketMidpoint={orderBookKeys.mid}
                hoveredPrice={s.hoveredPrice}
                updateHoveredPrice={this.updateHoveredPrice}
                updatePrecision={updatePrecision}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
                hasOrders={hasOrders}
                orderBookKeys={orderBookKeys}
              />
            </div>
          </div>
        </div>
        {isMobile && (
          <div className={Styles.MarketOutcomeCharts__indicator}>
            <div
              className={classNames(Styles.MarketOutcomeCharts__dot, {
                [Styles["MarketOutcomeCharts__dot--active"]]: s.candleScrolled
              })}
            />
            <div
              className={classNames(Styles.MarketOutcomeCharts__dot, {
                [Styles["MarketOutcomeCharts__dot--active"]]: !s.candleScrolled
              })}
            />
          </div>
        )}
      </section>
    );
  }
}
