import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import * as d3 from "d3";
import ReactFauxDOM from "react-faux-dom";

import { createBigNumber } from "utils/create-big-number";

import Styles from "modules/market-charts/components/market-outcomes-chart/market-outcomes-chart.styles";

export default class MarketOutcomesChart extends Component {
  static propTypes = {
    creationTime: PropTypes.number.isRequired,
    currentTimestamp: PropTypes.number.isRequired,
    estimatedInitialPrice: PropTypes.number.isRequired,
    maxPrice: PropTypes.number.isRequired,
    minPrice: PropTypes.number.isRequired,
    outcomes: PropTypes.array.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    hasPriceHistory: PropTypes.bool.isRequired,
    bucketedPriceTimeSeries: PropTypes.object.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    isMobileSmall: PropTypes.bool
  };

  static defaultProps = {
    isMobileSmall: false
  };

  constructor(props) {
    super(props);

    this.state = {
      chart: null,
      hoveredOutcome: null,
      drawParams: {},
      hoveredLocation: []
    };

    this.drawChart = this.drawChart.bind(this);
    this.onResize = this.onResize.bind(this);
    this.updateHoveredLocation = this.updateHoveredLocation.bind(this);
  }

  componentDidMount() {
    this.drawChart(this.props);
    window.addEventListener("resize", this.onResize);
  }

  componentWillUpdate(nextProps, nextState) {
    const { outcomes, pricePrecision } = this.props;

    if (!isEqual(outcomes, nextProps.outcomes)) this.drawChart(nextProps);

    if (
      !isEqual(this.state.hoveredLocation, nextState.hoveredLocation) ||
      !isEqual(this.state.drawParams, nextState.drawParams)
    ) {
      updateHoveredLocationCrosshair({
        hoveredLocation: nextState.hoveredLocation,
        drawParams: nextState.drawParams,
        pricePrecision
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  onResize() {
    const {
      creationTime,
      currentTimestamp,
      estimatedInitialPrice,
      fixedPrecision,
      maxPrice,
      minPrice,
      outcomes,
      hasPriceHistory,
      bucketedPriceTimeSeries,
      isMobileSmall
    } = this.props;
    // this is stupid but done for prop-type validation.
    this.drawChart({
      creationTime,
      currentTimestamp,
      estimatedInitialPrice,
      fixedPrecision,
      maxPrice,
      minPrice,
      outcomes,
      hasPriceHistory,
      bucketedPriceTimeSeries,
      isMobileSmall
    });
  }

  drawChart({
    creationTime,
    currentTimestamp,
    estimatedInitialPrice,
    maxPrice,
    minPrice,
    outcomes,
    hasPriceHistory,
    bucketedPriceTimeSeries,
    pricePrecision,
    isMobileSmall
  }) {
    if (this.outcomesChart) {
      const drawParams = determineDrawParams({
        creationTime,
        currentTimestamp,
        estimatedInitialPrice,
        drawContainer: this.outcomesChart,
        maxPrice,
        minPrice,
        outcomes,
        hasPriceHistory,
        bucketedPriceTimeSeries,
        isMobileSmall
      });
      const fauxDiv = new ReactFauxDOM.Element("div");
      const chart = d3
        .select(fauxDiv)
        .append("svg")
        .attr("id", "priceTimeSeries_chart")
        .attr("width", drawParams.width)
        .attr("height", drawParams.height);

      drawTicks({
        drawParams,
        chart,
        pricePrecision
      });

      drawXAxisLabels({
        drawParams,
        chart
      });

      drawSeries({
        chart,
        creationTime,
        estimatedInitialPrice,
        outcomes,
        drawParams,
        bucketedPriceTimeSeries
      });

      drawCrosshairs({
        chart
      });

      attachHoverHandler({
        drawParams,
        chart,
        updateHoveredLocation: this.updateHoveredLocation
      });

      if (!hasPriceHistory) {
        drawNullState({
          drawParams,
          chart
        });
      }

      this.setState({
        chart: fauxDiv.toReact(),
        drawParams
      });
    }
  }

  updateHoveredLocation(hoveredLocation) {
    this.setState({
      hoveredLocation
    });
  }

  render() {
    const { pricePrecision } = this.props;
    const s = this.state;

    return (
      <div className={Styles.MarketOutcomesChart}>
        <h3>price (eth) of each outcome</h3>
        <div className={Styles[`MarketOutcomesChart__chart-header`]}>
          <span className={Styles.MarketOutcomesChart__details}>
            {s.hoveredOutcome === null ? (
              "select an outcome to begin placing an order"
            ) : (
              <span>
                <span className={Styles.MarketOutcomesChart__name}>
                  {s.hoveredOutcome.name}
                </span>
                <span className={Styles.MarketOutcomesChart__price}>
                  last: {s.hoveredOutcome.price.toFixed(pricePrecision)} eth
                </span>
                <span className={Styles.MarketOutcomesChart__instruction}>
                  click to view more information about this outcome
                </span>
              </span>
            )}
          </span>
          <div />
        </div>
        <div
          ref={outcomesChart => {
            this.outcomesChart = outcomesChart;
          }}
          className={Styles.MarketOutcomesChart__chart}
        >
          {s.chart}
        </div>
      </div>
    );
  }
}

function determineDrawParams(options) {
  const {
    drawContainer,
    maxPrice,
    minPrice,
    bucketedPriceTimeSeries,
    isMobileSmall
  } = options;

  const chartDim = {
    top: 20,
    right: 0,
    bottom: 30,
    left: isMobileSmall ? 10 : 50,
    tickOffset: 10
  };

  const containerWidth = drawContainer.clientWidth;
  const containerHeight = drawContainer.clientHeight;
  const xDomain = bucketedPriceTimeSeries.timeBuckets;
  const yDomain = [minPrice, maxPrice];

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(xDomain))
    .range([chartDim.left, containerWidth - chartDim.right - 1]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yDomain))
    .range([containerHeight - chartDim.bottom, chartDim.top]);

  return {
    chartDim,
    containerWidth,
    containerHeight,
    xDomain,
    yDomain,
    xScale,
    yScale
  };
}

function drawTicks(options) {
  const { drawParams, chart, pricePrecision } = options;

  // Y axis
  //  Bounds
  //    Top
  chart
    .append("line")
    .attr("class", Styles["MarketOutcomesChart__bounding-line"])
    .attr("x1", 0)
    .attr("x2", drawParams.containerWidth)
    .attr("y1", drawParams.chartDim.top)
    .attr("y2", drawParams.chartDim.top);
  //    Bottom
  chart
    .append("line")
    .attr("class", Styles["MarketOutcomesChart__bounding-line"])
    .attr("x1", 0)
    .attr("x2", drawParams.containerWidth)
    .attr("y1", drawParams.containerHeight - drawParams.chartDim.bottom)
    .attr("y2", drawParams.containerHeight - drawParams.chartDim.bottom);

  const numberOfTicks = 5; // NOTE -- excludes bounds
  const yDomainExtent = d3.extent(drawParams.yDomain);
  const range = Math.abs(yDomainExtent[1] - yDomainExtent[0]);
  const interval = range / numberOfTicks;

  const ticks = [...new Array(5)].map((_item, i) => {
    if (i === 0) return yDomainExtent[0] + interval;
    return yDomainExtent[0] + (i + 1) * interval;
  });

  chart
    .append("g")
    .selectAll("line")
    .data(ticks)
    .enter()
    .append("line")
    .classed(Styles["MarketOutcomesChart__tick-line"], true)
    .classed(
      Styles["MarketOutcomesChart__tick-line--excluded"],
      (d, i) => i + 1 === ticks.length
    )
    .attr("x1", 0)
    .attr("x2", drawParams.containerWidth)
    .attr("y1", d => drawParams.yScale(d))
    .attr("y2", d => drawParams.yScale(d));

  chart
    .append("g")
    .selectAll("text")
    .data(ticks)
    .enter()
    .append("text")
    .classed(Styles["MarketOutcomesChart__tick-value"], true)
    .attr("x", 0)
    .attr("y", d => drawParams.yScale(d))
    .attr("dx", 0)
    .attr("dy", drawParams.chartDim.tickOffset)
    .text(d => d.toFixed(pricePrecision));
}

function drawXAxisLabels(options) {
  const { chart, drawParams } = options;

  chart
    .append("g")
    .attr("class", Styles["MarketOutcomesChart__outcomes-axis"])
    .attr(
      "transform",
      `translate(0, ${drawParams.containerHeight - drawParams.chartDim.bottom})`
    )
    .call(d3.axisBottom(drawParams.xScale));
}

function drawSeries(options) {
  const {
    creationTime,
    drawParams,
    estimatedInitialPrice,
    outcomes,
    chart,
    bucketedPriceTimeSeries
  } = options;

  const initialPoint = {
    price: estimatedInitialPrice.toString(),
    timestamp: creationTime
  };

  const outcomeLine = d3
    .line()
    .x(d => drawParams.xScale(d.timestamp))
    .y(d => drawParams.yScale(createBigNumber(d.price).toNumber()));

  outcomes.forEach((outcome, i) => {
    chart
      .append("path")
      .data([
        [initialPoint, ...bucketedPriceTimeSeries.priceTimeSeries[outcome.id]]
      ])
      .classed(`${Styles["MarketOutcomesChart__outcome-line"]}`, true)
      .classed(`${Styles[`MarketOutcomesChart__outcome-line--${i + 1}`]}`, true)
      .attr("d", outcomeLine);
  });
}

function drawCrosshairs(options) {
  const { chart } = options;

  chart
    .append("text")
    .attr("id", "hovered_priceTimeSeries_price_label")
    .attr("class", Styles["MarketOutcomesChart__price-label"]);

  const crosshair = chart
    .append("g")
    .attr("id", "priceTimeSeries_crosshairs")
    .style("display", "none");

  crosshair
    .append("line")
    .attr("id", "priceTimeSeries_crosshairY")
    .attr("class", Styles.MarketOutcomesChart__crosshair);

  crosshair
    .append("line")
    .attr("id", "priceTimeSeries_crosshairX")
    .attr("class", Styles.MarketOutcomesChart__crosshair);
}

function attachHoverHandler(options) {
  const { updateHoveredLocation, chart, drawParams } = options;

  chart
    .append("rect")
    .attr("class", Styles["MarketOutcomesChart__hover-overlay"])
    .attr("width", drawParams.containerWidth)
    .attr("height", drawParams.containerHeight)
    .on("mousemove", () => {
      updateHoveredLocation([
        drawParams.xScale.invert(
          d3.mouse(d3.select("#priceTimeSeries_chart").node())[0]
        ), // X
        drawParams.yScale.invert(
          d3.mouse(d3.select("#priceTimeSeries_chart").node())[1]
        ) // Y
      ]);
    })
    .on("mouseout", () => updateHoveredLocation([]));
}

function updateHoveredLocationCrosshair(options) {
  const { drawParams, hoveredLocation, pricePrecision } = options;

  if (hoveredLocation.length === 0) {
    d3.select("#priceTimeSeries_crosshairs").style("display", "none");
    d3.select("#hovered_priceTimeSeries_price_label").text("");
  } else {
    d3.select("#priceTimeSeries_crosshairs").style("display", null);
    d3.select("#priceTimeSeries_crosshairY")
      .attr("x1", 0)
      .attr("y1", drawParams.yScale(hoveredLocation[1]))
      .attr("x2", drawParams.containerWidth)
      .attr("y2", drawParams.yScale(hoveredLocation[1]));
    d3.select("#priceTimeSeries_crosshairX")
      .attr("x1", drawParams.xScale(hoveredLocation[0]))
      .attr("y1", drawParams.chartDim.top)
      .attr("x2", drawParams.xScale(hoveredLocation[0]))
      .attr("y2", drawParams.containerHeight - drawParams.chartDim.bottom);
    d3.select("#hovered_priceTimeSeries_price_label")
      .attr("x", 0)
      .attr("y", drawParams.yScale(hoveredLocation[1]) + 12)
      .text(hoveredLocation[1].toFixed(pricePrecision));
  }
}

function drawNullState(options) {
  const { drawParams, chart } = options;

  chart
    .append("text")
    .attr("class", Styles["MarketOutcomesChart__null-message"])
    .attr("x", drawParams.containerWidth / 2)
    .attr("y", drawParams.containerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .text("No Completed Trades");
}
