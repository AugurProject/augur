import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import ReactFauxDOM from "react-faux-dom";

import MarketOutcomeChartHeaderDepth from "modules/market-charts/components/market-outcome-charts--header-depth/market-outcome-charts--header-depth";
import { createBigNumber } from "utils/create-big-number";
import { isEqual } from "lodash";
import CustomPropTypes from "utils/custom-prop-types";
import { ZERO } from "modules/trades/constants/numbers";
import { BUY, SELL } from "modules/transactions/constants/types";
import { ASKS, BIDS } from "modules/orders/constants/orders";

import Styles from "modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth.styles";

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object.isRequired,
    marketDepth: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    updateChartHeaderHeight: PropTypes.func.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredDepth: PropTypes.func.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    marketMin: CustomPropTypes.bigNumber.isRequired,
    marketMax: CustomPropTypes.bigNumber.isRequired,
    hoveredDepth: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    headerHeight: PropTypes.number.isRequired,
    ordersWidth: PropTypes.number.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    hoveredPrice: PropTypes.any
  };

  static defaultProps = {
    hoveredPrice: null
  };

  constructor(props) {
    super(props);

    this.state = {
      depthContainer: null,
      containerWidth: 0,
      containerHeight: 0,
      yScale: null,
      xScale: null
    };

    this.drawDepth = this.drawDepth.bind(this);
    this.drawDepthOnResize = this.drawDepthOnResize.bind(this);
    this.drawCrosshairs = this.drawCrosshairs.bind(this);
  }

  componentDidMount() {
    const {
      pricePrecision,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      isMobile,
      hasOrders
    } = this.props;
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      pricePrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      isMobile,
      hasOrders
    });

    window.addEventListener("resize", this.drawDepthOnResize);
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      hoveredPrice,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      isMobile,
      ordersWidth
    } = this.props;
    if (
      !isEqual(marketDepth, nextProps.marketDepth) ||
      !isEqual(orderBookKeys, nextProps.orderBookKeys) ||
      !isEqual(sharedChartMargins, nextProps.sharedChartMargins) ||
      !isEqual(updateHoveredPrice, nextProps.updateHoveredPrice) ||
      !isEqual(
        updateSelectedOrderProperties,
        nextProps.updateSelectedOrderProperties
      ) ||
      marketMin !== nextProps.marketMin ||
      marketMax !== nextProps.marketMax ||
      isMobile !== nextProps.isMobile ||
      ordersWidth !== nextProps.ordersWidth
    ) {
      this.drawDepth({
        marketDepth: nextProps.marketDepth,
        orderBookKeys: nextProps.orderBookKeys,
        pricePrecision: nextProps.pricePrecision,
        sharedChartMargins: nextProps.sharedChartMargins,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
        updateHoveredPrice: nextProps.updateHoveredPrice,
        updateSelectedOrderProperties: nextProps.updateSelectedOrderProperties,
        isMobile: nextProps.isMobile,
        hasOrders: nextProps.hasOrders
      });
    }

    if (
      !isEqual(hoveredPrice, nextProps.hoveredPrice) ||
      !isEqual(marketDepth, nextProps.marketDepth) ||
      !isEqual(this.state.yScale, nextState.yScale) ||
      !isEqual(this.state.xScale, nextState.xScale) ||
      !isEqual(this.state.containerHeight, nextState.containerHeight) ||
      !isEqual(this.state.containerWidth, nextState.containerWidth) ||
      marketMin !== nextProps.marketMin ||
      marketMax !== nextProps.marketMax
    ) {
      this.drawCrosshairs({
        hoveredPrice: nextProps.hoveredPrice,
        pricePrecision: nextProps.pricePrecision,
        marketDepth: nextProps.marketDepth,
        yScale: nextState.yScale,
        xScale: nextState.xScale,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
        containerHeight: nextState.containerHeight,
        containerWidth: nextState.containerWidth
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.drawDepthOnResize);
  }

  drawDepth(options) {
    if (this.depthChart) {
      const {
        marketDepth,
        orderBookKeys,
        sharedChartMargins,
        pricePrecision,
        marketMin,
        marketMax,
        updateHoveredPrice,
        updateSelectedOrderProperties,
        isMobile,
        hasOrders
      } = options;

      const drawParams = determineDrawParams({
        depthChart: this.depthChart,
        sharedChartMargins,
        marketDepth,
        orderBookKeys,
        pricePrecision,
        isMobile,
        marketMax,
        marketMin
      });

      const depthContainer = new ReactFauxDOM.Element("div");

      // padding for overflowing x-axis ticks
      const widthPadding = 30;

      const depthChart = d3
        .select(depthContainer)
        .append("svg")
        .attr("id", "depth_chart")
        .attr("width", drawParams.containerWidth + widthPadding)
        .attr("height", drawParams.containerHeight);

      drawLines({
        drawParams,
        depthChart,
        marketDepth: drawParams.newMarketDepth,
        isMobile,
        hasOrders
      });

      drawTicks({
        drawParams,
        depthChart,
        orderBookKeys,
        pricePrecision,
        marketMax,
        marketMin,
        isMobile,
        hasOrders
      });

      setupCrosshairs({
        drawParams,
        depthChart
      });

      attachHoverClickHandlers({
        drawParams,
        depthChart,
        marketDepth,
        orderBookKeys,
        pricePrecision,
        marketMin,
        marketMax,
        updateHoveredPrice,
        updateSelectedOrderProperties
      });

      this.setState({
        depthContainer: depthContainer.toReact(),
        yScale: drawParams.yScale,
        xScale: drawParams.xScale,
        containerWidth: drawParams.containerWidth,
        containerHeight: drawParams.containerHeight
      });
    }
  }

  drawDepthOnResize() {
    const {
      pricePrecision,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      hasOrders
    } = this.props;
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      pricePrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      hasOrders
    });
  }

  drawCrosshairs(options) {
    const { updateHoveredDepth, sharedChartMargins } = this.props;
    if (this.depthChart) {
      const {
        hoveredPrice,
        marketDepth,
        xScale,
        yScale,
        containerHeight,
        containerWidth,
        marketMin,
        marketMax,
        pricePrecision
      } = options;

      if (hoveredPrice == null) {
        d3.select("#crosshairs").style("display", "none");
        d3.select("#hovered_price_label").text("");
        updateHoveredDepth([]);
      } else {
        const nearestFillingOrder = nearestCompletelyFillingOrder(
          hoveredPrice,
          marketDepth
        );
        if (nearestFillingOrder === null) return;

        updateHoveredDepth(nearestFillingOrder);

        d3.select("#crosshairs").style("display", null);

        if (
          createBigNumber(hoveredPrice).gte(marketMin) &&
          createBigNumber(hoveredPrice).lte(marketMax)
        ) {
          d3.select("#crosshairX")
            .attr("x1", xScale(nearestFillingOrder[1]))
            .attr("y1", 0)
            .attr("x2", xScale(nearestFillingOrder[1]))
            .attr("y2", containerHeight - sharedChartMargins.bottom)
            .style("display", null);
        } else {
          d3.select("#crosshairX").style("display", "none");
        }
        const yPosition = yScale(hoveredPrice);
        const clampedHoveredPrice = yScale.invert(yPosition);

        d3.select("#crosshairY")
          .attr("x1", 0)
          .attr("y1", yScale(nearestFillingOrder[0]))
          .attr("x2", containerWidth)
          .attr("y2", yScale(nearestFillingOrder[0]));

        let labelOffset = 5;
        if (nearestFillingOrder && nearestFillingOrder[4] === ASKS) {
          labelOffset = -40;
        }
        d3.select("#hovered_price_label")
          .attr("x", xScale(hoveredPrice) + labelOffset)
          .attr("y", containerHeight - sharedChartMargins.bottom - 12)
          .text(clampedHoveredPrice.toFixed(pricePrecision));
      }
    }
  }

  render() {
    const {
      fixedPrecision,
      pricePrecision,
      hoveredDepth,
      isMobile,
      headerHeight,
      updateChartHeaderHeight
    } = this.props;

    return (
      <section className={Styles.MarketOutcomeDepth}>
        <MarketOutcomeChartHeaderDepth
          fixedPrecision={fixedPrecision}
          pricePrecision={pricePrecision}
          hoveredDepth={hoveredDepth}
          isMobile={isMobile}
          headerHeight={headerHeight}
          updateChartHeaderHeight={updateChartHeaderHeight}
        />
        <div
          ref={depthChart => {
            this.depthChart = depthChart;
          }}
          className={Styles.MarketOutcomeDepth__container}
        >
          {this.state.depthContainer}
        </div>
      </section>
    );
  }
}

export function nearestCompletelyFillingOrder(price, { asks = [], bids = [] }) {
  const PRICE_INDEX = 1;
  const items = [
    ...asks.filter(it => it[3]).map(it => [...it, ASKS]),
    ...bids.filter(it => it[3]).map(it => [...it, BIDS])
  ];

  let closestIndex = -1;
  let closestDistance = Number.MAX_VALUE;
  for (let i = 0; i < items.length; i++) {
    const dist = Math.abs(items[i][PRICE_INDEX] - price);
    if (dist < closestDistance) {
      closestIndex = i;
      closestDistance = dist;
    }
  }

  return closestIndex === -1 ? null : items[closestIndex];
}

function determineDrawParams(options) {
  const {
    sharedChartMargins,
    depthChart,
    marketDepth,
    marketMax,
    marketMin
  } = options;

  const chartDim = {
    ...sharedChartMargins, // top, bottom
    right: 0,
    left: 0,
    stick: 5,
    tickOffset: 10
  };

  const containerWidth = depthChart.clientWidth;
  const containerHeight = depthChart.clientHeight;
  const drawHeight = containerHeight - chartDim.top - chartDim.bottom;

  const xDomain = [marketMin.toNumber(), marketMax.toNumber()];
  const yDomain = [
    0,
    Object.keys(marketDepth)
      .reduce((p, side) => {
        if (marketDepth[side].length > 0) {
          const result = marketDepth[side][marketDepth[side].length - 1][0];
          if (result.gt(p)) return result;
        }
        return p;
        // '1.05' gives a 5% buffer on the top
      }, ZERO)
      .times(1.05)
      .toNumber()
  ];

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(xDomain))
    .range([chartDim.left, containerWidth - chartDim.right - 1]);

  const yScale = d3
    .scaleLinear()
    .clamp(true)
    .domain(d3.extent(yDomain))
    .range([containerHeight - chartDim.bottom, chartDim.top]);

  const newMarketDepth = {
    asks: [...marketDepth.asks],
    bids: [...marketDepth.bids]
  };

  if (newMarketDepth.asks.length > 0 && marketMax) {
    const askToCopy = newMarketDepth.asks[newMarketDepth.asks.length - 1];
    if (askToCopy[1] !== marketMax.toNumber()) {
      newMarketDepth.asks.push([
        askToCopy[0],
        marketMax.toNumber(),
        askToCopy[2],
        false
      ]);
    }
  }

  if (newMarketDepth.bids.length > 0 && marketMin) {
    const bidToCopy = newMarketDepth.bids[newMarketDepth.bids.length - 1];
    if (bidToCopy[1] !== marketMin.toNumber()) {
      newMarketDepth.bids.push([
        bidToCopy[0],
        marketMin.toNumber(),
        bidToCopy[2],
        false
      ]);
    }
  }

  return {
    containerWidth,
    containerHeight,
    drawHeight,
    chartDim,
    newMarketDepth,
    xDomain,
    yDomain,
    xScale,
    yScale
  };
}

function drawTicks(options) {
  const {
    drawParams,
    depthChart,
    orderBookKeys,
    pricePrecision,
    isMobile,
    marketMax,
    marketMin,
    hasOrders
  } = options;

  // Y Axis
  //  Chart Bounds
  depthChart
    .append("g")
    .attr("id", "depth_chart_bounds")
    .selectAll("line")
    .data(new Array(2))
    .enter()
    .append("line")
    .attr("class", "bounding-line")
    .attr("x1", 0)
    .attr("x2", drawParams.containerWidth)
    .attr(
      "y1",
      (d, i) => (drawParams.containerHeight - drawParams.chartDim.bottom) * i
    )
    .attr(
      "y2",
      (d, i) => (drawParams.containerHeight - drawParams.chartDim.bottom) * i
    );

  //  Midpoint Label
  if (!isMobile && hasOrders) {
    let midOffset = 5;
    const marketRangeMid = marketMax.minus(marketMin).dividedBy(2);
    if (orderBookKeys.mid.gt(marketRangeMid)) {
      midOffset = -70;
    }
    const quarter = drawParams.yDomain[1] * 0.8;
    depthChart
      .append("line")
      .attr("class", "tick-line--midpoint")
      .attr("x1", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y1", 0)
      .attr("x2", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y2", drawParams.containerHeight - drawParams.chartDim.bottom);
    depthChart
      .append("text")
      .attr("class", "tick-value-midpoint")
      .attr("x", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y", drawParams.yScale(quarter) - 15)
      .attr("dx", midOffset)
      .attr("dy", 0)
      .text(orderBookKeys.mid && "Mid Price");
    depthChart
      .append("text")
      .attr("class", "tick-value-midpoint")
      .attr("x", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y", drawParams.yScale(quarter))
      .attr("dx", midOffset)
      .attr("dy", 0)
      .text(
        orderBookKeys.mid && `${orderBookKeys.mid.toFixed(pricePrecision)} ETH`
      );
  }
  if (hasOrders) {
    const offsetTicks = Array.from(new Array(11), (val, index) =>
      createBigNumber(drawParams.yDomain[1].toString())
        .times(0.1)
        .times(index)
        .toNumber()
    ).slice(1, 11);

    const yTicks = depthChart.append("g").attr("id", "depth_y_ticks");

    yTicks
      .selectAll("text")
      .data(offsetTicks)
      .enter()
      .append("text")
      .attr("class", "tick-value")
      .attr("x", 0)
      .attr("y", d => drawParams.yScale(d))
      .attr("dx", 0)
      .attr("dy", drawParams.chartDim.tickOffset)
      .text(d => d.toFixed(pricePrecision));
  }

  // X Axis
  depthChart
    .append("g")
    .attr("id", "depth-x-axis")
    .attr(
      "transform",
      `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`
    )
    .call(d3.axisBottom(drawParams.xScale).ticks(5))
    .select("path")
    .remove();
}

function drawLines(options) {
  const { drawParams, depthChart, marketDepth, hasOrders } = options;

  // Defs
  const chartDefs = depthChart.append("defs");

  //  Fills
  const subtleGradientBid = chartDefs
    .append("linearGradient")
    .attr("id", "subtleGradientBid");

  subtleGradientBid
    .append("stop")
    .attr("class", "stop-top-bid")
    .attr("offset", "0%");

  subtleGradientBid
    .append("stop")
    .attr("class", "stop-bottom")
    .attr("offset", "100%");

  const subtleGradientAsk = chartDefs
    .append("linearGradient")
    .attr("id", "subtleGradientAsk");

  subtleGradientAsk
    .append("stop")
    .attr("class", "stop-bottom-ask")
    .attr("offset", "0%");

  subtleGradientAsk
    .append("stop")
    .attr("class", "stop-top-ask")
    .attr("offset", "100%");

  if (!hasOrders) return;

  // Depth Line
  const depthLine = d3
    .line()
    .curve(d3.curveStepBefore)
    .x(d => drawParams.xScale(d[1]))
    .y(d => drawParams.yScale(d[0]));

  Object.keys(marketDepth).forEach(side => {
    depthChart
      .append("path")
      .data([marketDepth[side].reverse()])
      .attr("class", `depth-line-${side} outcome-line-${side}`)
      .attr("d", depthLine);
  });

  const areaBid = d3
    .area()
    .curve(d3.curveStepBefore)
    .x0(d => drawParams.xScale(d[1]))
    .x1(d => drawParams.xScale(drawParams.xDomain[0]))
    .y(d => drawParams.yScale(d[0]));

  const areaAsk = d3
    .area()
    .curve(d3.curveStepBefore)
    .x0(d => drawParams.xScale(d[1]))
    .x1(d => drawParams.xScale(drawParams.xDomain[1]))
    .y(d => drawParams.yScale(d[0]));

  Object.keys(marketDepth).forEach(side => {
    depthChart
      .append("path")
      .data([marketDepth[side]])
      .classed(`filled-subtle-${side}`, true)
      .attr("d", side === BIDS ? areaBid : areaAsk);
  });
}

function setupCrosshairs(options) {
  const { depthChart } = options;

  depthChart.append("text").attr("id", "hovered_price_label");

  // create crosshairs
  const crosshair = depthChart
    .append("g")
    .attr("id", "crosshairs")
    .attr("class", "line")
    .style("display", "none");

  // X Crosshair
  crosshair
    .append("line")
    .attr("id", "crosshairX")
    .attr("class", "crosshair")
    .style("display", "none");

  // Y Crosshair
  crosshair
    .append("line")
    .attr("id", "crosshairY")
    .attr("class", "crosshair");
}

function attachHoverClickHandlers(options) {
  const {
    drawParams,
    depthChart,
    marketDepth,
    pricePrecision,
    marketMin,
    marketMax,
    updateHoveredPrice,
    updateSelectedOrderProperties
  } = options;

  depthChart
    .append("rect")
    .attr("class", "overlay")
    .attr("width", drawParams.containerWidth)
    .attr("height", drawParams.containerHeight)
    .on("mouseover", () => d3.select("#crosshairs").style("display", null))
    .on("mouseout", () => updateHoveredPrice(null))
    .on("mousemove", () => {
      const mouse = d3.mouse(d3.select("#depth_chart").node());

      // Determine closest order
      const hoveredPrice = drawParams.xScale
        .invert(mouse[0])
        .toFixed(pricePrecision);

      updateHoveredPrice(hoveredPrice);
    })
    .on("click", () => {
      const mouse = d3.mouse(d3.select("#depth_chart").node());
      const orderPrice = drawParams.xScale
        .invert(mouse[0])
        .toFixed(pricePrecision);
      const nearestFillingOrder = nearestCompletelyFillingOrder(
        orderPrice,
        marketDepth
      );

      if (
        nearestFillingOrder != null &&
        createBigNumber(orderPrice).gte(marketMin) &&
        createBigNumber(orderPrice).lte(marketMax)
      ) {
        updateSelectedOrderProperties({
          orderQuantity: nearestFillingOrder[0],
          orderPrice: nearestFillingOrder[1],
          selectedNav: nearestFillingOrder[4] === BIDS ? SELL : BUY
        });
      }
    });
}
