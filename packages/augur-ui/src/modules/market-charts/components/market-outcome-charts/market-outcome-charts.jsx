import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ScrollSnap from "scroll-snap";

import MarketOutcomeDepth from "modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth";
import MarketOutcomeChartsOrders from "modules/market-charts/components/market-outcome-charts--orders/market-outcome-charts--orders";

import Styles from "modules/market-charts/components/market-outcome-charts/market-outcome-charts.styles";

import { BigNumber } from "bignumber.js";

export default class MarketOutcomeCharts extends Component {
  static propTypes = {
    hasOrders: PropTypes.bool.isRequired,
    marketDepth: PropTypes.object.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    orderBook: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    updatePrecision: PropTypes.func,
    priceTimeSeries: PropTypes.array,
    fixedPrecision: PropTypes.number
  };

  static defaultProps = {
    fixedPrecision: 4,
    priceTimeSeries: [],
    isMobile: false,
    updatePrecision: () => {}
  };

  constructor(props) {
    super(props);

    this.snapConfig = {
      scrollSnapDestination: "100% 0%",
      scrollTime: 300
    };

    this.snapScroller = null;

    this.sharedChartMargins = {
      top: 0,
      bottom: 30
    };

    this.state = {
      candleScrolled: true,
      hoveredDepth: [],
      hoveredPrice: null,
      headerHeight: props.isMobile ? 20 : 0,
      ordersWidth: 0
    };

    this.updateHoveredPrice = this.updateHoveredPrice.bind(this);
    this.updateHoveredDepth = this.updateHoveredDepth.bind(this);
    this.snapScrollHandler = this.snapScrollHandler.bind(this);
    this.updateChartHeaderHeight = this.updateChartHeaderHeight.bind(this);
    this.determineActiveScrolledChart = this.determineActiveScrolledChart.bind(
      this
    );
    this.updateOrdersWidth = this.updateOrdersWidth.bind(this);
  }

  componentDidMount() {
    this.snapScrollHandler();

    this.calculateOrdersWidth();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isMobile && prevProps.isMobile !== this.props.isMobile) {
      this.snapScrollHandler();
    }

    this.calculateOrdersWidth();
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
      hasOrders,
      marketDepth,
      maxPrice,
      minPrice,
      orderBook,
      orderBookKeys,
      priceTimeSeries,
      updateSelectedOrderProperties,
      isMobile,
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
