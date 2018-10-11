import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "utils/custom-prop-types";
import * as d3 from "d3";
import ReactFauxDOM from "react-faux-dom";

import { map } from "lodash/fp";
import { sortBy } from "lodash";

import findPeriodSeriesBounds from "modules/markets/helpers/find-period-series-bounds";
import MarketOutcomeChartsHeaderCandlestick from "modules/market-charts/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick";

import { BUY, SELL } from "modules/transactions/constants/types";

import Styles from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles";
import { createBigNumber } from "utils/create-big-number";
import { getTickIntervalForRange } from "modules/markets/helpers/range";

class MarketOutcomeCandlestick extends React.Component {
  static propTypes = {
    currentTimeInSeconds: PropTypes.number,
    fixedPrecision: PropTypes.number.isRequired,
    isMobile: PropTypes.bool.isRequired,
    marketMax: CustomPropTypes.bigNumber,
    marketMin: CustomPropTypes.bigNumber,
    orderBookKeys: PropTypes.object.isRequired,
    outcomeName: PropTypes.string,
    priceTimeSeries: PropTypes.array.isRequired,
    selectedPeriod: PropTypes.number.isRequired,
    selectedRange: PropTypes.number.isRequired,
    sharedChartMargins: PropTypes.object.isRequired,
    updateSelectedPeriod: PropTypes.func.isRequired,
    updateSelectedRange: PropTypes.func.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    pricePrecision: PropTypes.number.isRequired
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      currentTimeInSeconds,
      pricePrecision,
      marketMax,
      marketMin,
      orderBookKeys,
      priceTimeSeries,
      selectedPeriod,
      selectedRange,
      sharedChartMargins
    } = nextProps;

    const { candleDim, containerHeight, containerWidth } = prevState;

    const outcomeBounds = findPeriodSeriesBounds(
      priceTimeSeries,
      marketMin,
      marketMax
    );
    const drawParams = determineDrawParams({
      candleDim,
      containerHeight,
      containerWidth,
      currentTimeInSeconds,
      pricePrecision,
      marketMax,
      marketMin,
      orderBookKeys,
      outcomeBounds,
      priceTimeSeries,
      selectedPeriod,
      selectedRange,
      sharedChartMargins
    });

    return {
      ...prevState,
      ...drawParams
    };
  }

  constructor(props) {
    super(props);

    this.state = MarketOutcomeCandlestick.getDerivedStateFromProps(props, {
      chartDim: {
        right: 0,
        left: 50,
        stick: 5,
        tickOffset: 10
      },
      candleDim: {
        width: 6,
        gap: 9
      },
      containerHeight: 0,
      containerWidth: 0,
      yScale: null,
      hoveredPrice: null,
      hoveredPeriod: {}
    });

    this.getContainerWidths = this.getContainerWidths.bind(this);
    this.updateContainerWidths = this.updateContainerWidths.bind(this);
    this.updateHoveredPrice = this.updateHoveredPrice.bind(this);
    this.updateHoveredPeriod = this.updateHoveredPeriod.bind(this);
    this.clearCrosshairs = this.clearCrosshairs.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateContainerWidths);

    this.drawContainer.addEventListener("mouseout", this.clearCrosshairs);
  }

  componentWillReceiveProps(nextProps) {
    const containerWidths = this.getContainerWidths();
    const drawParams = MarketOutcomeCandlestick.getDerivedStateFromProps(
      nextProps,
      {
        ...this.state,
        ...containerWidths
      }
    );

    this.setState({
      ...drawParams
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateContainerWidths);
    this.drawContainer.removeEventListener("mouseout", this.clearCrosshairs);
  }

  getContainerWidths() {
    return {
      containerWidth: this.drawContainer.clientWidth,
      containerHeight: this.drawContainer.clientHeight
    };
  }

  updateContainerWidths() {
    this.setState(this.getContainerWidths());
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice
    });
  }

  updateHoveredPeriod(hoveredPeriod) {
    this.setState({
      hoveredPeriod
    });
  }

  clearCrosshairs() {
    this.updateHoveredPrice(null);
    this.updateHoveredPeriod({});
    updateHoveredPriceCrosshair(null);
  }

  render() {
    const {
      currentTimeInSeconds,
      fixedPrecision,
      pricePrecision,
      isMobile,
      orderBookKeys,
      outcomeName,
      priceTimeSeries,
      selectedPeriod,
      selectedRange,
      updateSelectedPeriod,
      updateSelectedRange,
      updateSelectedOrderProperties
    } = this.props;

    const {
      boundDiff,
      candleDim,
      chartDim,
      containerHeight,
      containerWidth,
      drawableWidth,
      marketMax,
      marketMin,
      xScale,
      yDomain,
      yScale,
      hoveredPrice,
      hoveredPeriod
    } = this.state;

    const candleChartContainer = ReactFauxDOM.createElement("div");
    const candleTicksContainer = ReactFauxDOM.createElement("div");

    // Faux DOM
    //  Tick Element (Fixed)
    candleTicksContainer.setAttribute(
      "class",
      `${Styles["MarketOutcomeCandlestick__ticks-container"]}`
    );
    candleTicksContainer.setAttribute("key", "candlestick_ticks_container");

    //  Chart Element (Scrollable)
    candleChartContainer.setAttribute("key", "candlestick_chart_container");
    candleChartContainer.setAttribute("id", "candlestick_chart_container");
    candleChartContainer.setAttribute(
      "class",
      `${Styles["MarketOutcomeCandlestick__chart-container"]}`
    );
    candleChartContainer.setAttribute("style", {
      width: `${containerWidth - chartDim.left}px`,
      left: chartDim.left
    });

    if (containerHeight > 0 && containerWidth > 0 && currentTimeInSeconds) {
      const candleTicks = d3
        .select(candleTicksContainer)
        .append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight);
      const candleChart = d3
        .select(candleChartContainer)
        .append("svg")
        .attr("id", "candlestick_chart")
        .attr("height", containerHeight)
        .attr("width", drawableWidth);

      drawTicks({
        boundDiff,
        candleChart,
        candleDim,
        candleTicks,
        chartDim,
        containerHeight,
        containerWidth,
        pricePrecision,
        marketMax,
        marketMin,
        orderBookKeys,
        priceTimeSeries,
        xScale,
        yDomain,
        yScale
      });

      drawCandles({
        boundDiff,
        candleChart,
        candleDim,
        chartDim,
        containerHeight,
        containerWidth,
        priceTimeSeries,
        xScale,
        yDomain,
        yScale
      });

      drawVolume({
        boundDiff,
        candleChart,
        candleDim,
        chartDim,
        containerHeight,
        containerWidth,
        priceTimeSeries,
        xScale,
        yDomain
      });

      const tickInterval = getTickIntervalForRange(selectedRange);

      drawXAxisLabels({
        priceTimeSeries,
        candleChart,
        containerWidth,
        containerHeight,
        chartDim,
        candleDim,
        boundDiff,
        tickInterval,
        yDomain,
        xScale
      });

      drawCrosshairs({
        candleTicks
      });

      attachHoverClickHandlers({
        candleChart,
        candleDim,
        chartDim,
        containerHeight,
        containerWidth,
        pricePrecision,
        marketMax,
        marketMin,
        orderBookKeys,
        priceTimeSeries,
        updateHoveredPeriod: this.updateHoveredPeriod,
        updateHoveredPrice: this.updateHoveredPrice,
        updateSelectedOrderProperties,
        yScale,
        xScale,
        clearCrosshairs: this.clearCrosshairs
      });

      updateHoveredPriceCrosshair(
        hoveredPrice,
        yScale,
        containerWidth,
        pricePrecision
      );
    }

    return (
      <section className={Styles.MarketOutcomeCandlestick}>
        <MarketOutcomeChartsHeaderCandlestick
          outcomeName={outcomeName}
          isMobile={isMobile}
          volume={hoveredPeriod.volume}
          open={hoveredPeriod.open}
          high={hoveredPeriod.high}
          low={hoveredPeriod.low}
          close={hoveredPeriod.close}
          priceTimeSeries={priceTimeSeries}
          fixedPrecision={fixedPrecision}
          pricePrecision={pricePrecision}
          selectedPeriod={selectedPeriod}
          selectedRange={selectedRange}
          updateSelectedPeriod={updateSelectedPeriod}
          updateSelectedRange={updateSelectedRange}
        />
        <div
          ref={drawContainer => {
            this.drawContainer = drawContainer;
          }}
          className={Styles.MarketOutcomeCandlestick__container}
        >
          {candleTicksContainer.toReact()}
          {candleChartContainer.toReact()}
        </div>
      </section>
    );
  }
}

function determineDrawParams({
  containerHeight,
  containerWidth,
  currentTimeInSeconds,
  marketMax,
  marketMin,
  priceTimeSeries,
  selectedRange,
  sharedChartMargins
}) {
  // Dimensions/Positioning
  const chartDim = {
    ...sharedChartMargins,
    right: 0,
    left: 50,
    stick: 5,
    tickOffset: 10
  };

  // Domain
  //  X
  const xDomain = [
    new Date((currentTimeInSeconds - selectedRange) * 1000),
    new Date(currentTimeInSeconds * 1000)
  ];

  const drawableWidth = containerWidth;

  //  Y
  const highValues = sortBy(priceTimeSeries, ["high"]);
  const lowValues = sortBy(priceTimeSeries, ["low"]);
  const max = highValues.length
    ? highValues[highValues.length - 1].high
    : marketMax.toNumber();
  const min = lowValues.length ? lowValues[0].low : marketMin.toNumber();

  const bnMax = createBigNumber(max);
  const bnMin = createBigNumber(min);
  const buffer = bnMax.minus(bnMin).times(".10");

  const maxPrice = bnMax.plus(buffer).toNumber();
  const minPrice = bnMin.minus(buffer).toNumber();

  let yDomain = [
    maxPrice > marketMax ? max : maxPrice,
    minPrice < marketMin ? min : minPrice
  ];
  // common case with low volume
  if (yDomain[0] === yDomain[1]) {
    if (yDomain[0] === 0) {
      yDomain = [marketMax.toNumber(), marketMin.toNumber()];
    } else {
      yDomain = [
        createBigNumber(yDomain[0])
          .times(1.5)
          .toNumber(),
        createBigNumber(yDomain[0])
          .times(0.5)
          .toNumber()
      ];
    }
  }
  // sigment y into 10 to show prices
  const boundDiff = createBigNumber(yDomain[0])
    .minus(createBigNumber(yDomain[1]))
    .dividedBy(2);

  // Scale
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(xDomain))
    .range([chartDim.left, drawableWidth - chartDim.left - chartDim.right]);

  const yScale = d3
    .scaleLinear()
    .clamp(true)
    .domain(d3.extent(yDomain))
    .range([containerHeight - chartDim.bottom, chartDim.top]);

  return {
    chartDim,
    drawableWidth,
    boundDiff,
    yDomain,
    xScale,
    yScale
  };
}

function drawTicks({
  boundDiff,
  candleTicks,
  chartDim,
  containerWidth,
  pricePrecision,
  yDomain,
  yScale
}) {
  //  Ticks
  const offsetTicks = [
    yDomain[0],
    yDomain[1],
    createBigNumber(yDomain[1])
      .plus(boundDiff)
      .toNumber(),
    createBigNumber(yDomain[0])
      .minus(boundDiff.dividedBy(2))
      .toNumber(),
    createBigNumber(yDomain[1])
      .plus(boundDiff.dividedBy(2))
      .toNumber()
  ];

  const yTicks = candleTicks.append("g").attr("id", "depth_y_ticks");

  yTicks
    .selectAll("line")
    .data(offsetTicks)
    .enter()
    .append("line")
    .attr("class", "tick-line")
    .attr("x1", 0)
    .attr("x2", containerWidth)
    .attr("y1", d => yScale(d))
    .attr("y2", d => yScale(d))
    .text(d => d.toFixed(pricePrecision));

  yTicks
    .selectAll("text")
    .data(offsetTicks)
    .enter()
    .append("text")
    .attr("class", "tick-value")
    .attr("x", 0)
    .attr("y", d => yScale(d))
    .attr("dx", 0)
    .attr("dy", chartDim.tickOffset)
    .text(d => d.toFixed(pricePrecision));
}

function drawCandles({
  priceTimeSeries,
  candleChart,
  containerWidth,
  containerHeight,
  candleDim,
  xScale,
  yScale
}) {
  if (priceTimeSeries.length === 0) {
    drawNullState({ candleChart, containerWidth, containerHeight });
  } else {
    candleChart
      .selectAll("rect.candle")
      .data(priceTimeSeries)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.period))
      .attr("y", d => yScale(d3.max([d.open, d.close])))
      .attr("height", d =>
        Math.max(Math.abs(yScale(d.open) - yScale(d.close)), 1)
      )
      .attr("width", candleDim.width)
      .attr("class", d => (d.close > d.open ? "up-period" : "down-period")); // eslint-disable-line no-confusing-arrow

    candleChart
      .selectAll("line.stem")
      .data(priceTimeSeries)
      .enter()
      .append("line")
      .attr("class", "stem")
      .attr("x1", d => xScale(d.period) + candleDim.width / 2)
      .attr("x2", d => xScale(d.period) + candleDim.width / 2)
      .attr("y1", d => yScale(d.high))
      .attr("y2", d => yScale(d.low))
      .attr("class", d => (d.close > d.open ? "up-period" : "down-period")); // eslint-disable-line no-confusing-arrow
  }
}
function drawVolume({
  priceTimeSeries,
  candleChart,
  containerHeight,
  chartDim,
  candleDim,
  xScale
}) {
  const yVolumeDomain = [0, ...map("volume")(priceTimeSeries)];

  const yVolumeScale = d3
    .scaleLinear()
    .domain(d3.extent(yVolumeDomain))
    .range([
      containerHeight - chartDim.bottom,
      chartDim.top + (containerHeight - chartDim.bottom) * 0.66
    ]);

  candleChart
    .selectAll("rect.volume")
    .data(priceTimeSeries)
    .enter()
    .append("rect")
    .attr("x", d => xScale(d.period))
    .attr("y", d => yVolumeScale(d.volume))
    .attr(
      "height",
      d => containerHeight - chartDim.bottom - yVolumeScale(d.volume)
    )
    .attr("width", d => candleDim.width)
    .attr("class", "period-volume");
}

function drawXAxisLabels({
  candleChart,
  containerHeight,
  chartDim,
  tickInterval,
  xScale
}) {
  candleChart
    .append("g")
    .attr("id", "candlestick-x-axis")
    .attr("transform", `translate(0, ${containerHeight - chartDim.bottom})`)
    .call(tickInterval(d3.axisBottom(xScale)))
    .select("path")
    .remove();
}

function drawCrosshairs({ candleTicks }) {
  candleTicks.append("text").attr("id", "hovered_candlestick_price_label");

  const crosshair = candleTicks
    .append("g")
    .attr("id", "candlestick_crosshairs")
    .attr("class", "line")
    .style("display", "none");

  crosshair
    .append("line")
    .attr("id", "candlestick_crosshairY")
    .attr("class", "crosshair");
}

function attachHoverClickHandlers({
  candleChart,
  candleDim,
  chartDim,
  containerHeight,
  drawableWidth,
  pricePrecision,
  marketMax,
  marketMin,
  orderBookKeys,
  priceTimeSeries,
  updateHoveredPeriod,
  updateHoveredPrice,
  updateSelectedOrderProperties,
  yScale,
  xScale,
  clearCrosshairs
}) {
  candleChart
    .append("rect")
    .attr("class", "overlay")
    .attr("width", drawableWidth)
    .attr("height", containerHeight)
    .on("mousemove", () =>
      updateHoveredPrice(
        yScale
          .invert(d3.mouse(d3.select("#candlestick_chart").node())[1])
          .toFixed(pricePrecision)
      )
    )
    .on("mouseout", clearCrosshairs)
    .on("click", () => {
      const mouse = d3.mouse(d3.select("#candlestick_chart").node());
      const orderPrice = yScale.invert(mouse[1]).toFixed(pricePrecision);

      if (orderPrice > marketMin && orderPrice < marketMax) {
        updateSelectedOrderProperties({
          selectedNav: orderPrice > orderBookKeys.mid ? BUY : SELL,
          orderPrice
        });
      }
    });

  candleChart
    .selectAll("rect.hover")
    .data(priceTimeSeries)
    .enter()
    .append("rect")
    .attr("id", "testing")
    .attr("x", d => xScale(d.period) - candleDim.gap * 0.5)
    .attr("y", 0)
    .attr("height", containerHeight - chartDim.bottom)
    .attr("width", candleDim.width + candleDim.gap)
    .attr("class", "period-hover")
    .on("mouseover", d => updateHoveredPeriod(d))
    .on("mousemove", () =>
      updateHoveredPrice(
        yScale
          .invert(d3.mouse(d3.select("#candlestick_chart").node())[1])
          .toFixed(pricePrecision)
      )
    )
    .on("mouseout", clearCrosshairs);

  candleChart.on("mouseout", clearCrosshairs);
}

function updateHoveredPriceCrosshair(
  hoveredPrice,
  yScale,
  chartWidth,
  pricePrecision
) {
  if (hoveredPrice == null) {
    d3.select("#candlestick_crosshairs").style("display", "none");
    d3.select("#hovered_candlestick_price_label").text("");
  } else {
    const yPosition = yScale(hoveredPrice);
    const clampedHoveredPrice = yScale.invert(yPosition);
    d3.select("#candlestick_crosshairs").style("display", null);
    d3.select("#candlestick_crosshairY")
      .attr("x1", 0)
      .attr("y1", yPosition)
      .attr("x2", chartWidth)
      .attr("y2", yPosition);
    d3.select("#hovered_candlestick_price_label")
      .attr("x", 0)
      .attr("y", yScale(hoveredPrice) + 12)
      .text(clampedHoveredPrice.toFixed(pricePrecision));
  }
}

function drawNullState(options) {
  const { containerWidth, containerHeight, candleChart } = options;

  candleChart
    .append("text")
    .attr("class", Styles["MarketOutcomeCandlestick__null-message"])
    .attr("x", containerWidth / 2)
    .attr("y", containerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text("No Completed Trades");
}

export default MarketOutcomeCandlestick;
