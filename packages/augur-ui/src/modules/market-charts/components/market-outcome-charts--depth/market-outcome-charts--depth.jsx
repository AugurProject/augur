import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import ReactFauxDOM from "react-faux-dom";

import { createBigNumber } from "utils/create-big-number";
import { isEqual } from "lodash";
import CustomPropTypes from "utils/custom-prop-types";
import { ASKS, BIDS, BUY, SELL, ZERO } from "modules/common-elements/constants";

import Styles from "modules/market-charts/components/market-outcome-charts--depth/market-outcome-charts--depth.styles";

export default class MarketOutcomeDepth extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object,
    marketDepth: PropTypes.object.isRequired,
    orderBookKeys: PropTypes.object.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateHoveredDepth: PropTypes.func.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    marketMin: CustomPropTypes.bigNumber.isRequired,
    marketMax: CustomPropTypes.bigNumber.isRequired,
    // hoveredDepth: PropTypes.array.isRequired,
    isMobile: PropTypes.bool,
    // headerHeight: PropTypes.number.isRequired,
    // ordersWidth: PropTypes.number.isRequired,
    hasOrders: PropTypes.bool.isRequired,
    hoveredPrice: PropTypes.any
  };

  static defaultProps = {
    hoveredPrice: null,
    isMobile: false,
    sharedChartMargins: {
      top: 0,
      bottom: 30
    }
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
  }

  componentWillUpdate(nextProps, nextState) {
    const {
      hoveredPrice,
      marketDepth,
      orderBookKeys,
      sharedChartMargins,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      isMobile
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
      isMobile !== nextProps.isMobile
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
      !isEqual(this.state.containerWidth, nextState.containerWidth)
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

      const depthChart = d3
        .select(depthContainer)
        .style("display", "flex")
        .append("svg")
        .attr("id", "depth_chart")
        .attr(
          "width",
          drawParams.containerWidth -
            drawParams.chartDim.left -
            drawParams.chartDim.right
        )
        .attr("height", drawParams.containerHeight)
        .style("margin", "0.75rem 0.5rem 0");

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

      drawLines({
        drawParams,
        depthChart,
        marketDepth: drawParams.newMarketDepth,
        isMobile,
        hasOrders,
        marketMin,
        marketMax
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
        marketMax
      } = options;

      if (hoveredPrice == null) {
        d3.select("#crosshairs").style("display", "none");
        d3.select("#hovered_tooltip_container").style("display", "none");
        updateHoveredDepth([]);
      } else {
        const nearestFillingOrder = nearestCompletelyFillingOrder(
          hoveredPrice,
          marketDepth,
          marketMin,
          marketMax
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

        d3.select("#crosshairY")
          .attr(
            "x1",
            nearestFillingOrder[4] === BIDS ? 0 : xScale(nearestFillingOrder[1])
          )
          .attr("y1", yScale(nearestFillingOrder[0]))
          .attr(
            "x2",
            nearestFillingOrder[4] === BIDS
              ? xScale(nearestFillingOrder[1])
              : containerWidth
          )
          .attr("y2", yScale(nearestFillingOrder[0]));

        d3.select("#crosshairDot")
          .attr("cx", xScale(nearestFillingOrder[1]))
          .attr("cy", yScale(nearestFillingOrder[0]));

        d3.select("#crosshairDotOutline")
          .attr("cx", xScale(nearestFillingOrder[1]))
          .attr("cy", yScale(nearestFillingOrder[0]));
      }
    }
  }

  render() {
    return (
      <div
        ref={depthChart => {
          this.depthChart = depthChart;
        }}
        className={Styles.MarketOutcomeDepth__container}
      >
        {this.state.depthContainer}
      </div>
    );
  }
}

export function nearestCompletelyFillingOrder(
  price,
  { asks = [], bids = [] },
  marketMin,
  marketMax
) {
  const marketRange = createBigNumber(marketMax).minus(marketMin);
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
  if (closestIndex !== -1) {
    let cost = createBigNumber(0);
    const type = items[closestIndex][4];
    for (let i = closestIndex; items[i] && items[i][4] === type; i--) {
      const scaledPrice = createBigNumber(items[i][1]).minus(marketMin);
      const long = createBigNumber(items[i][2]).times(scaledPrice);
      const tradeCost =
        type === ASKS
          ? long
          : marketRange.times(items[i][2].toString()).minus(long.toString());
      cost = cost.plus(tradeCost);
    }
    items[closestIndex].push(cost);
  } else {
    return null;
  }

  return items[closestIndex];
}

function determineDrawParams(options) {
  const {
    sharedChartMargins,
    depthChart,
    marketDepth,
    marketMax,
    marketMin,
    orderBookKeys
  } = options;

  const chartDim = {
    ...sharedChartMargins, // top, bottom
    right: 10,
    left: 10,
    stick: 5,
    tickOffset: 10
  };

  const containerWidth = depthChart.clientWidth;
  const containerHeight = depthChart.clientHeight - 12;
  const drawHeight = containerHeight - chartDim.top - chartDim.bottom;

  const midPrice = orderBookKeys.mid;
  const minDistance = midPrice.minus(marketMin);
  const maxDistance = marketMax.minus(midPrice);
  const maxDistanceGreater = maxDistance.gt(minDistance);
  const xDomainMin = maxDistanceGreater
    ? midPrice.minus(maxDistance)
    : midPrice.minus(minDistance);
  const xDomainMax = maxDistanceGreater
    ? midPrice.plus(maxDistance)
    : midPrice.plus(minDistance);

  const xDomain = [xDomainMin, xDomainMax];
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
    .range([
      chartDim.left + 8,
      containerWidth - chartDim.right - chartDim.left - 16
    ]);

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
    marketMax,
    marketMin,
    isMobile,
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
    .attr("x1", drawParams.chartDim.left)
    .attr(
      "x2",
      drawParams.containerWidth -
        drawParams.chartDim.right -
        drawParams.chartDim.left -
        16
    )
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
    const midOffset = -25;
    let quarter = drawParams.yScale(drawParams.yDomain[1] * 0.85);
    quarter = quarter < 40 ? 40 : quarter;

    const denominationWidth = 15;
    const priceWidth =
      orderBookKeys.mid.toFixed(pricePrecision).toString().length * 10 +
      denominationWidth;
    const pricePlacement = -1 * (priceWidth / 2);
    const denominationPlacement =
      pricePlacement + priceWidth - denominationWidth;

    depthChart
      .append("line")
      .attr("class", "tick-line--midpoint")
      .attr("x1", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y1", 0)
      .attr("x2", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr(
        "y2",
        drawParams.containerHeight - drawParams.chartDim.bottom - quarter
      )
      .attr("transform", `translate(0, ${quarter})`);
    depthChart
      .append("text")
      .attr("class", "tick-value-midpoint-text")
      .attr("x", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y", quarter - 30)
      .attr("dx", midOffset)
      .attr("dy", 0)
      .text(orderBookKeys.mid && "Mid Price");
    depthChart
      .append("text")
      .attr("class", "tick-value-midpoint")
      .attr("x", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y", quarter - 12)
      .attr("dx", pricePlacement)
      .attr("dy", 0)
      .text(
        orderBookKeys.mid && `${orderBookKeys.mid.toFixed(pricePrecision)}`
      );

    depthChart
      .append("text")
      .attr("class", "tick-value-denomination")
      .attr("x", drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr("y", quarter - 12)
      .attr("dx", denominationPlacement)
      .attr("dy", 0)
      .text("ETH");
  }

  const tickCount = 5;

  if (hasOrders) {
    const yTicks = depthChart.append("g").attr("id", "depth_y_ticks");

    yTicks
      .call(
        d3
          .axisRight(drawParams.yScale)
          .tickValues(drawParams.yScale.ticks(tickCount))
          .tickSize(9)
          .tickPadding(4)
      )
      .attr("transform", `translate(${drawParams.chartDim.left}, 0)`)
      .selectAll("text")
      .text(d => d)
      .select("path")
      .remove();
  }

  // X Axis
  let hasAddedMin = false;
  let hasAddedMax = false;
  const { length } = drawParams.xScale.ticks(tickCount);
  const xTicks = drawParams.xScale.ticks(tickCount).reduce((acc, tickValue) => {
    // min check
    if (marketMin.eq(tickValue) || (!hasAddedMin && marketMin.lt(tickValue))) {
      hasAddedMin = true;
      acc.push(marketMin.toNumber());
    }
    // max check
    if (marketMax.eq(tickValue) || (!hasAddedMax && marketMax.lt(tickValue))) {
      hasAddedMax = true;
      acc.push(marketMax.toNumber());
    }
    if (marketMin.lt(tickValue) && marketMax.gt(tickValue)) acc.push(tickValue);
    // final max check (make sure we add max if this is the last tickValue)
    if (acc.length === length && !hasAddedMax) {
      hasAddedMax = true;
      acc.push(marketMax.toNumber());
    }
    return acc;
  }, []);
  depthChart
    .append("g")
    .attr("id", "depth-x-axis")
    .attr(
      "transform",
      `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`
    )
    .call(
      d3
        .axisBottom(drawParams.xScale)
        .tickValues(xTicks)
        .tickSize(9)
        .tickPadding(4)
    )
    .selectAll("text")
    .text(d => `${d} ETH`)
    .select("path")
    .remove();
}

function drawLines(options) {
  const {
    drawParams,
    depthChart,
    marketDepth,
    hasOrders,
    marketMin,
    marketMax
  } = options;

  // Defs
  const chartDefs = depthChart.append("defs");
  //  Fills
  const subtleGradientBid = chartDefs
    .append("linearGradient")
    .attr("id", "subtleGradientBid")
    .attr("x1", 0)
    .attr("y1", 1)
    .attr("x2", 0)
    .attr("y2", 0);

  subtleGradientBid
    .append("stop")
    .attr("class", "stop-top-bid")
    .attr("offset", "0%");

  subtleGradientBid
    .append("stop")
    .attr("class", "stop-bottom-bid")
    .attr("offset", "80%");

  const subtleGradientAsk = chartDefs
    .append("linearGradient")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 1)
    .attr("id", "subtleGradientAsk");

  subtleGradientAsk
    .append("stop")
    .attr("class", "stop-bottom-ask")
    .attr("offset", "20%");

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
    .x1(d => drawParams.xScale(marketMin))
    .y(d => drawParams.yScale(d[0]));

  const areaAsk = d3
    .area()
    .curve(d3.curveStepBefore)
    .x0(d => drawParams.xScale(d[1]))
    .x1(d => drawParams.xScale(marketMax))
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
  // create tooltip
  const tooltip = depthChart
    .append("foreignObject")
    .attr("id", "hovered_tooltip_container")
    .style("display", "none");

  const tooltipDiv = tooltip
    .append("div")
    .attr("id", "hovered_tooltip")
    .attr("class", "hovered_tooltip_div");

  const labels = tooltipDiv
    .append("div")
    .attr("id", "hovered_tooltip_labels")
    .attr("class", "hovered_tooltip_labels");
  const values = tooltipDiv
    .append("div")
    .attr("id", "hovered_tooltip_values")
    .attr("class", "hovered_tooltip_values");

  labels
    .append("div")
    .attr("id", "price_label")
    .html("Price:");
  labels
    .append("div")
    .attr("id", "volume_label")
    .html("Volume:");
  labels
    .append("div")
    .attr("id", "cost_label")
    .html("Cost:");

  values.append("div").attr("id", "price_value");
  values.append("div").attr("id", "volume_value");
  values.append("div").attr("id", "cost_value");

  // create crosshairs
  const crosshair = depthChart
    .append("g")
    .attr("id", "crosshairs")
    .attr("class", "line")
    .style("display", "none");

  crosshair
    .append("svg:circle")
    .attr("id", "crosshairDot")
    .attr("r", 3)
    .attr("stroke", "white")
    .attr("fill", "white")
    .attr("class", "crosshairDot");

  crosshair
    .append("svg:circle")
    .attr("id", "crosshairDotOutline")
    .attr("r", 8)
    .attr("stroke", "white")
    .attr("fill", "white")
    .attr("class", "crosshairDotOutline");

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
    .attr(
      "width",
      drawParams.containerWidth -
        drawParams.chartDim.left -
        drawParams.chartDim.right
    )
    .attr("height", drawParams.containerHeight)
    .on("mouseover", () => d3.select("#crosshairs").style("display", null))
    .on("mouseout", () => {
      updateHoveredPrice(null);
      d3.select(".depth-line-bids").attr("stroke-width", 1);
      d3.select(".depth-line-asks").attr("stroke-width", 1);
      d3.select("#crosshairX").attr("class", "crosshair");
      d3.select("#crosshairY").attr("class", "crosshair");
    })
    .on("mousemove", () => {
      const mouse = d3.mouse(d3.select("#depth_chart").node());
      const asksDepthLine = ".depth-line-asks";
      const bidsDepthLine = ".depth-line-bids";
      // const highlightAsks = orderBookKeys.mid.lt(
      //   drawParams.xScale.invert(mouse[0]).toFixed(pricePrecision)
      // );
      // Determine closest order
      const hoveredPrice = drawParams.xScale
        .invert(mouse[0])
        .toFixed(pricePrecision);

      const nearestFillingOrder = nearestCompletelyFillingOrder(
        hoveredPrice,
        marketDepth,
        marketMin,
        marketMax
      );
      if (nearestFillingOrder === null) return;

      d3.select(bidsDepthLine).attr(
        "stroke-width",
        nearestFillingOrder[4] === ASKS ? 1 : 2
      );
      d3.select(asksDepthLine).attr(
        "stroke-width",
        nearestFillingOrder[4] === ASKS ? 2 : 1
      );
      d3.select("#crosshairX").attr(
        "class",
        `crosshair-${nearestFillingOrder[4]}`
      );
      d3.select("#crosshairY").attr(
        "class",
        `crosshair-${nearestFillingOrder[4]}`
      );

      updateHoveredPrice(hoveredPrice);
      const { xScale, yScale } = drawParams;
      d3.select("#price_label").attr("class", `${nearestFillingOrder[4]}`);
      d3.select("#volume_label").attr("class", `${nearestFillingOrder[4]}`);
      d3.select("#cost_label").attr("class", `${nearestFillingOrder[4]}`);
      d3.select("#price_value").html(
        `${createBigNumber(nearestFillingOrder[1]).toFixed(pricePrecision)}`
      );
      d3.select("#volume_value").html(
        `${createBigNumber(nearestFillingOrder[0]).toFixed(pricePrecision)}`
      );
      d3.select("#cost_value").html(
        `${nearestFillingOrder[5].toFixed(pricePrecision)} ETH`
      );

      // 27 comes from the padding/border/margins so 1rem total for horz
      // padding .5 rem for label/value seperation, + borderpx of 3 (2 on line
      // side, 1 on the other)
      // const defaultHeight = 51;
      // const defaultWidth = 113;
      const borderPadding = 2;
      const verticalSpacing = 24;
      const testWidth =
        d3.select("#hovered_tooltip_values").node().clientWidth +
        d3.select("#hovered_tooltip_labels").node().clientWidth +
        27 +
        borderPadding;
      const testHeight =
        d3.select("#hovered_tooltip").node().clientHeight + verticalSpacing;
      let quarterX = xScale(drawParams.xDomain[1] * 0.1);
      let quarterY = yScale(drawParams.yDomain[1] * 0.9);
      quarterX = quarterX > testWidth ? quarterX : testWidth;
      quarterY = quarterY > testHeight ? quarterY : testHeight;
      const flipX = quarterX > xScale(nearestFillingOrder[1]);
      const flipY = quarterY > yScale(nearestFillingOrder[0]);
      d3.select("#hovered_tooltip").attr(
        "class",
        `hovered_tooltip_div ${nearestFillingOrder[4]} ${flipX ? "flip" : ""}`
      );
      const offset = {
        hoverToolTipX: flipX ? 0 : testWidth * -1,
        hoverToolTipY: flipY ? verticalSpacing : testHeight * -1
      };
      const tooltip = d3
        .select("#hovered_tooltip_container")
        .style("display", "flex")
        .style("height", testHeight)
        .style("width", testWidth);
      tooltip
        .attr("x", xScale(nearestFillingOrder[1]) + offset.hoverToolTipX)
        .attr("y", yScale(nearestFillingOrder[0]) + offset.hoverToolTipY);
    })
    .on("click", () => {
      const mouse = d3.mouse(d3.select("#depth_chart").node());
      const orderPrice = drawParams.xScale
        .invert(mouse[0])
        .toFixed(pricePrecision);
      const nearestFillingOrder = nearestCompletelyFillingOrder(
        orderPrice,
        marketDepth,
        marketMin,
        marketMax
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
