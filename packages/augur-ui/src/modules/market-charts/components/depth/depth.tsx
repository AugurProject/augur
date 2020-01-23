import React, { Component } from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';
import memoize from 'memoizee';
import { createBigNumber } from 'utils/create-big-number';
import { ASKS, BIDS, BUY, SELL, ZERO } from 'modules/common/constants';

import Styles from 'modules/market-charts/components/depth/depth.styles.less';
import { MarketDepth } from 'modules/markets/helpers/order-for-market-depth';
import { ZoomOutIcon, ZoomInIcon } from 'modules/common/icons';

interface DepthChartProps {
  marketDepth: MarketDepth;
  orderBookKeys: { max: BigNumber; min: BigNumber; mid: BigNumber };
  pricePrecision: number;
  updateHoveredPrice: Function;
  updateHoveredDepth: Function;
  updateSelectedOrderProperties: Function;
  marketMin: BigNumber;
  marketMax: BigNumber;
  hasOrders: boolean;
  hoveredPrice?: any;
}

interface DepthChartState {
  zoom: number;
}

const ZOOM_LEVELS = [1, 0.8, 0.6, 0.4, 0.2];
const ZOOM_MAX = ZOOM_LEVELS.length - 1;
// this is important to make sure we don't infinitely redraw the chart / have the container keep growing
const MARGIN_OF_ERROR = 50;
const CHART_DIM = {
  top: 10,
  bottom: 20,
  right: 10,
  left: 10,
  stick: 5,
  tickOffset: 0,
};

const checkResize = memoize(
  (clientWidth, clientHeight, containerWidth, containerHeight) =>
    Math.abs(clientWidth + clientHeight - (containerWidth + containerHeight)) >
    MARGIN_OF_ERROR
);
function determineInitialZoom(props) {
  const { orderBookKeys, marketMin, marketMax } = props;

  const midPrice = orderBookKeys.mid;
  const minDistance = midPrice.minus(marketMin);
  const maxDistance = marketMax.minus(midPrice);
  const maxDistanceGreater = maxDistance.gt(minDistance);
  const ZoomLevelArray = ZOOM_LEVELS.map(zoomLevel => {
    const xDomainMin = maxDistanceGreater
      ? midPrice.minus(maxDistance * zoomLevel)
      : midPrice.minus(minDistance * zoomLevel);
    const xDomainMax = maxDistanceGreater
      ? midPrice.plus(maxDistance * zoomLevel)
      : midPrice.plus(minDistance * zoomLevel);
    return [xDomainMin, xDomainMax];
  });
  const zoom = ZoomLevelArray.findIndex(
    ele => ele[0].gte(marketMin) && ele[1].lte(marketMax)
  );

  return zoom === -1 ? ZOOM_MAX : zoom;
}

export default class DepthChart extends Component<
  DepthChartProps,
  DepthChartState
> {
  static defaultProps = {
    hoveredPrice: null,
  };

  depthChart: any;
  depthContainer: any;
  drawParams: any;
  xScale: number = 0;
  yScale: number = 0;
  containerHeight: number = 0;
  containerWidth: number = 0;

  constructor(props) {
    super(props);

    this.state = {
      zoom: determineInitialZoom(props),
    };

    this.drawDepth = this.drawDepth.bind(this);
    this.drawCrosshairs = this.drawCrosshairs.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.determineDrawParams = this.determineDrawParams.bind(this);
  }

  componentDidMount() {
    const {
      pricePrecision,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      hasOrders,
    } = this.props;
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      pricePrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      hasOrders,
      zoom: this.state.zoom,
    });
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    const { hoveredPrice, marketDepth, orderBookKeys } = this.props;
    const oldZoom = this.state.zoom;
    const { zoom } = nextState;
    const curMarketDepth = JSON.stringify(marketDepth);
    const nextMarketDepth = JSON.stringify(nextProps.marketDepth);
    const handleChartDraw = () => this.drawDepth({
      marketDepth: nextProps.marketDepth,
      orderBookKeys: nextProps.orderBookKeys,
      pricePrecision: nextProps.pricePrecision,
      marketMin: nextProps.marketMin,
      marketMax: nextProps.marketMax,
      updateHoveredPrice: nextProps.updateHoveredPrice,
      updateSelectedOrderProperties: nextProps.updateSelectedOrderProperties,
      hasOrders: nextProps.hasOrders,
      zoom,
    });
    if (
      curMarketDepth !== nextMarketDepth ||
      JSON.stringify(orderBookKeys) !==
        JSON.stringify(nextProps.orderBookKeys) ||
      oldZoom !== zoom
    ) {
      handleChartDraw();
    } else if (
      checkResize(
        this.depthChart.clientWidth,
        this.depthChart.clientHeight,
        this.containerWidth,
        this.containerHeight
      )
    ) {
      handleChartDraw();
    }

    if (
      hoveredPrice !== nextProps.hoveredPrice ||
      curMarketDepth !== nextMarketDepth
    ) {
      this.drawCrosshairs({
        hoveredPrice: nextProps.hoveredPrice,
        pricePrecision: nextProps.pricePrecision,
        marketDepth: nextProps.marketDepth,
        marketMin: nextProps.marketMin,
        marketMax: nextProps.marketMax,
        drawParams: this.drawParams,
      });
    }
  }

  determineDrawParams(options) {
    const {
      depthChart,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      zoom,
    } = options;

    const containerHeight = this.containerHeight
      ? this.containerHeight
      : this.depthChart.clientHeight;
    const containerWidth = this.depthChart.clientWidth;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    const drawHeight = containerHeight - CHART_DIM.bottom;
    const midPrice = orderBookKeys.mid;
    const minDistance = midPrice.minus(marketMin);
    const maxDistance = marketMax.minus(midPrice);
    const maxDistanceGreater = maxDistance.gt(minDistance);
    const zoomLevel = ZOOM_LEVELS[zoom];
    const scaledMaxDistance = maxDistance.times(zoomLevel);
    const scaledMinDistance = minDistance.times(zoomLevel);
    const xDomainMin = maxDistanceGreater
      ? midPrice.minus(scaledMaxDistance)
      : midPrice.minus(scaledMinDistance);
    const xDomainMax = maxDistanceGreater
      ? midPrice.plus(scaledMaxDistance)
      : midPrice.plus(scaledMinDistance);

    const yDomainMax = Object.keys(marketDepth)
      .reduce((p, side) => {
        const book = marketDepth[side];
        if (book.length > 0) {
          let firstFailingIndex = null;
          let price = null;
          if (side === BIDS) {
            price = xDomainMin;
            firstFailingIndex = book.findIndex(
              ele => ele[3] && price.gte(createBigNumber(ele[1]))
            );
          } else {
            price = xDomainMax;
            firstFailingIndex = book.findIndex(
              ele => ele[3] && price.lte(createBigNumber(ele[1]))
            );
          }
          const LargestShareAmount = createBigNumber(
            (book[firstFailingIndex - 1] && book[firstFailingIndex - 1][0]) ||
              book[book.length - 1][0] ||
              0
          );
          if (LargestShareAmount.gt(p)) return LargestShareAmount;
        }
        return p;
      }, ZERO)
      // .times(1.05)
      .toNumber();

    const xDomain = [xDomainMin.toNumber(), xDomainMax.toNumber()];
    const yDomain = [0, yDomainMax];
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(xDomain))
      .range([CHART_DIM.left, containerWidth - CHART_DIM.right]);

    const yScale = d3
      .scaleLinear()
      .clamp(true)
      .domain(d3.extent(yDomain))
      .range([drawHeight, CHART_DIM.top]);

    const newMarketDepth = {
      asks: [...marketDepth.asks],
      bids: [...marketDepth.bids],
    };

    if (newMarketDepth.asks.length > 0 && marketMax) {
      const askToCopy = newMarketDepth.asks[newMarketDepth.asks.length - 1];
      if (askToCopy[1] !== marketMax.toNumber()) {
        newMarketDepth.asks.push([
          askToCopy[0],
          marketMax.toNumber(),
          askToCopy[2],
          false,
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
          false,
        ]);
      }
    }
    return {
      containerWidth,
      containerHeight,
      drawHeight,
      newMarketDepth,
      xDomain,
      yDomain,
      xScale,
      yScale,
    };
  }

  drawDepth(options, cb = null) {
    if (this.depthChart) {
      const {
        marketDepth,
        orderBookKeys,
        pricePrecision,
        marketMin,
        marketMax,
        updateHoveredPrice,
        updateSelectedOrderProperties,
        hasOrders,
        zoom,
      } = options;

      const drawParams = this.determineDrawParams({
        marketDepth,
        orderBookKeys,
        pricePrecision,
        marketMax,
        marketMin,
        zoom,
      });

      this.xScale = drawParams.xScale;
      this.yScale = drawParams.yScale;
      this.drawParams = drawParams;

      const depthContainer = new ReactFauxDOM.Element('div');

      const depthChart = d3
        .select(depthContainer)
        .style('display', 'flex')
        .append('svg')
        .attr('id', 'depth_chart')
        .attr('width', drawParams.containerWidth)
        .attr('height', drawParams.containerHeight);

      drawTicks({
        drawParams,
        depthChart,
        orderBookKeys,
        pricePrecision,
        marketMax,
        marketMin,
        hasOrders,
        marketDepth: drawParams.newMarketDepth,
      });

      drawLines({
        drawParams,
        depthChart,
        marketDepth: drawParams.newMarketDepth,
        hasOrders,
        marketMin,
        marketMax,
      });

      setupCrosshairs({
        drawParams,
        depthChart,
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
        updateSelectedOrderProperties,
      });

      this.drawCrosshairs({
        hoveredPrice: this.props.hoveredPrice,
        pricePrecision,
        marketDepth,
        marketMin,
        marketMax,
        drawParams,
      });

      this.depthContainer = depthContainer.toReact();
      if (cb) cb();
    }
  }

  drawCrosshairs(options) {
    const { updateHoveredDepth } = this.props;
    if (this.depthChart) {
      const {
        hoveredPrice,
        marketDepth,
        marketMin,
        marketMax,
        drawParams,
      } = options;

      const { xScale, yScale, containerHeight, containerWidth } = this;

      if (hoveredPrice == null) {
        d3.select('#crosshairs').style('display', 'none');
        d3.select('#hovered_tooltip_container').style('display', 'none');
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

        d3.select('#crosshairs').style('display', null);

        if (
          createBigNumber(hoveredPrice).gte(marketMin) &&
          createBigNumber(hoveredPrice).lte(marketMax)
        ) {
          d3.select('#crosshairX')
            .attr('x1', xScale(nearestFillingOrder[1]))
            .attr('y1', 0)
            .attr('x2', xScale(nearestFillingOrder[1]))
            // @ts-ignore
            .attr('y2', containerHeight - CHART_DIM.bottom)
            .style('display', null);
        } else {
          d3.select('#crosshairX').style('display', 'none');
        }

        d3.select('#crosshairY')
          .attr(
            'x1',
            nearestFillingOrder[4] === BIDS ? 0 : xScale(nearestFillingOrder[1])
          )
          .attr('y1', yScale(nearestFillingOrder[0]))
          .attr(
            'x2',
            nearestFillingOrder[4] === BIDS
              ? xScale(nearestFillingOrder[1])
              : containerWidth
          )
          .attr('y2', yScale(nearestFillingOrder[0]));

        d3.select('#crosshairDot')
          .attr('cx', xScale(nearestFillingOrder[1]))
          .attr('cy', yScale(nearestFillingOrder[0]));

        d3.select('#crosshairDotOutline')
          .attr('cx', xScale(nearestFillingOrder[1]))
          .attr('cy', yScale(nearestFillingOrder[0]));
      }
    }
  }

  handleZoom(direction: number) {
    const { zoom } = this.state;
    const newZoom = ZOOM_LEVELS[zoom + direction]
      ? ZOOM_LEVELS[zoom + direction]
      : ZOOM_LEVELS[zoom];
    if (ZOOM_LEVELS[zoom] !== newZoom) {
      this.setState({
        zoom: zoom + direction,
      });
    }
  }

  handleResize() {
    const {
      pricePrecision,
      marketDepth,
      marketMax,
      marketMin,
      orderBookKeys,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      hasOrders,
    } = this.props;
    this.drawDepth({
      marketDepth,
      orderBookKeys,
      pricePrecision,
      marketMin,
      marketMax,
      updateHoveredPrice,
      updateSelectedOrderProperties,
      hasOrders,
      zoom: this.state.zoom,
    });
  }

  render() {
    const { zoom } = this.state;
    return (
      <div
        ref={depthChart => {
          this.depthChart = depthChart;
        }}
        className={Styles.MarketOutcomeDepth__container}
      >
        <button onClick={() => this.handleZoom(-1)} disabled={zoom === 0}>
          {ZoomOutIcon}
        </button>
        <span>mid price</span>
        <span>{`$${this.props.orderBookKeys.mid.toFixed()}`}</span>
        <button onClick={() => this.handleZoom(1)} disabled={zoom === ZOOM_MAX}>
          {ZoomInIcon}
        </button>
        {this.depthContainer}
      </div>
    );
  }
}

function nearestCompletelyFillingOrder(
  price,
  { asks = [], bids = [] },
  marketMin,
  marketMax,
  drawParams
) {
  const marketRange = createBigNumber(marketMax).minus(marketMin);
  // const { xDomain } = drawParams;
  const PRICE_INDEX = 1;
  const items = [
    ...asks.filter(it => it[3]).map(it => [...it, ASKS]),
    ...bids.filter(it => it[3]).map(it => [...it, BIDS]),
  ];

  let closestIndex = -1;
  let closestDistance = Number.MAX_VALUE;
  for (let i = 0; i < items.length; i++) {
    // @ts-ignore
    const dist = Math.abs(items[i][PRICE_INDEX] - price);
    if (dist < closestDistance) {
      closestIndex = i;
      closestDistance = dist;
    }
  }
  if (closestIndex !== -1) {
    let cost = ZERO;
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
    // @ts-ignore
    items[closestIndex].push(cost);
  } else {
    return null;
  }

  // final check to make sure not to snap to invisible prices
  if (drawParams) {
    const { xDomain } = drawParams;
    const price = Number(items[closestIndex][1]);
    if (items[closestIndex][4] === BIDS && price < xDomain[0]) {
      return null;
    } else if (items[closestIndex][4] === ASKS && price > xDomain[1]) {
      return null;
    }
  }

  return items[closestIndex];
}

function drawTicks(options) {
  const {
    drawParams,
    depthChart,
    orderBookKeys,
    marketMax,
    marketMin,
    hasOrders,
    marketDepth,
  } = options;
  //  Chart Bounds
  depthChart
    .append('g')
    .attr('id', 'depth_chart_bounds')
    .selectAll('line')
    .data(new Array(2))
    .enter()
    .append('line')
    .attr('class', 'bounding-line')
    .attr('x1', 0)
    .attr('x2', drawParams.containerWidth)
    .attr('y1', (d, i) => (drawParams.containerHeight - CHART_DIM.bottom) * i)
    .attr('y2', (d, i) => (drawParams.containerHeight - CHART_DIM.bottom) * i);

  //  Midpoint line
  if (hasOrders && marketDepth.bids.length > 0 && marketDepth.asks.length > 0) {
    depthChart
      .append('line')
      .attr('class', 'tick-line--midpoint')
      .attr('x1', drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr('y1', 0)
      .attr('x2', drawParams.xScale(orderBookKeys.mid.toNumber()))
      .attr('y2', drawParams.containerHeight - CHART_DIM.bottom);
  }

  const tickCount = 5;

  // Draw LeftSide yAxis
  if (hasOrders) {
    const yTicks = depthChart.append('g').attr('id', 'depth_y_ticks');

    yTicks
      .call(
        d3
          .axisRight(drawParams.yScale)
          .tickValues(drawParams.yScale.ticks(tickCount))
          .tickSize(9)
          .tickPadding(4)
      )
      .attr('transform', `translate(-${CHART_DIM.left}, 6)`)
      .selectAll('text')
      .text(d => d)
      .select('path')
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
    .append('g')
    .attr('id', 'depth-x-axis')
    .attr(
      'transform',
      `translate( 0, ${drawParams.containerHeight - CHART_DIM.bottom})`
    )
    .call(
      d3
        .axisBottom(drawParams.xScale)
        .tickValues(xTicks)
        .tickSize(9)
        .tickPadding(4)
    )
    .selectAll('text')
    .text(d => `$${d}`)
    .select('path')
    .remove();

  // Draw xAxis lines
  drawParams.xScale.ticks(tickCount).forEach((tick: number) => {
    if (tick === drawParams.xScale.ticks(tickCount)[0]) {
      return;
    }
    depthChart
      .append('line')
      .attr('class', 'vertical-lines')
      .attr('x1', drawParams.xScale(tick))
      .attr('y1', CHART_DIM.tickOffset)
      .attr('x2', drawParams.xScale(tick))
      .attr('y2', drawParams.containerHeight - CHART_DIM.bottom);
  });

  // Draw yAxis Lines
  drawParams.yScale.ticks(tickCount).forEach((tick: number) => {
    if (tick === drawParams.yScale.ticks(tickCount)[0]) {
      return;
    }
    depthChart
      .append('line')
      .attr('class', 'horizontal-lines')
      .attr('x1', CHART_DIM.tickOffset)
      .attr('y1', drawParams.yScale(tick))
      .attr('x2', drawParams.containerWidth - CHART_DIM.right)
      .attr('y2', drawParams.yScale(tick));
  });

  // Draw RightSide yAxis
  if (hasOrders) {
    const yTicks2 = depthChart.append('g').attr('id', 'depth_y_ticks');

    yTicks2
      .call(
        d3
          .axisLeft(drawParams.yScale)
          .tickValues(drawParams.yScale.ticks(tickCount))
          .tickSize(9)
          .tickPadding(4)
      )
      .attr(
        'transform',
        `translate(${drawParams.containerWidth + CHART_DIM.right}, 6)`
      )
      .selectAll('text')
      .text(d => d)
      .select('path')
      .remove();
  }
}

function drawLines(options) {
  const {
    drawParams,
    depthChart,
    marketDepth,
    hasOrders,
    marketMin,
    marketMax,
  } = options;

  // Defs
  const chartDefs = depthChart.append('defs');
  //  Fills
  const subtleGradientBid = chartDefs
    .append('linearGradient')
    .attr('id', 'subtleGradientBid')
    .attr('x1', 0)
    .attr('y1', 1)
    .attr('x2', 0)
    .attr('y2', 0);

  subtleGradientBid
    .append('stop')
    .attr('class', 'stop-top-bid')
    .attr('offset', '0');

  subtleGradientBid
    .append('stop')
    .attr('class', 'stop-bottom-bid')
    .attr('offset', '1');

  const subtleGradientAsk = chartDefs
    .append('linearGradient')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 0)
    .attr('y2', 1)
    .attr('id', 'subtleGradientAsk');

  subtleGradientAsk
    .append('stop')
    .attr('class', 'stop-bottom-ask')
    .attr('offset', '0');

  subtleGradientAsk
    .append('stop')
    .attr('class', 'stop-top-ask')
    .attr('offset', '10');

  if (!hasOrders) return;

  // Depth Line
  const depthLine = d3
    .line()
    .curve(d3.curveStepBefore)
    .x(d => drawParams.xScale(d[1]))
    .y(d => drawParams.yScale(d[0]));

  Object.keys(marketDepth).forEach(side => {
    depthChart
      .append('path')
      .data([marketDepth[side].reverse()])
      .attr('class', `depth-line-${side} outcome-line-${side}`)
      .attr('d', depthLine);
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
      .append('path')
      .data([marketDepth[side]])
      .classed(`filled-subtle-${side}`, true)
      .attr('d', side === BIDS ? areaBid : areaAsk);
  });
}

function setupCrosshairs(options) {
  const { depthChart } = options;
  // create tooltip
  const tooltip = depthChart
    .append('foreignObject')
    .attr('id', 'hovered_tooltip_container')
    .style('display', 'none');

  const tooltipDiv = tooltip
    .append('div')
    .attr('id', 'hovered_tooltip')
    .attr('class', 'hovered_tooltip_div');

  const labels = tooltipDiv
    .append('div')
    .attr('id', 'hovered_tooltip_labels')
    .attr('class', 'hovered_tooltip_labels');
  const values = tooltipDiv
    .append('div')
    .attr('id', 'hovered_tooltip_values')
    .attr('class', 'hovered_tooltip_values');

  labels
    .append('div')
    .attr('id', 'price_label')
    .html('Price');
  labels
    .append('div')
    .attr('id', 'volume_label')
    .html('Volume');
  labels
    .append('div')
    .attr('id', 'cost_label')
    .html('Cost');

  values.append('div').attr('id', 'price_value');
  values.append('div').attr('id', 'volume_value');
  values.append('div').attr('id', 'cost_value');

  // create crosshairs
  const crosshair = depthChart
    .append('g')
    .attr('id', 'crosshairs')
    .attr('class', 'line')
    .style('display', 'none');

  crosshair
    .append('svg:circle')
    .attr('id', 'crosshairDot')
    .attr('r', 3)
    .attr('stroke', '#E9E5F2')
    .attr('fill', '#E9E5F2')
    .attr('class', 'crosshairDot');

  crosshair
    .append('svg:circle')
    .attr('id', 'crosshairDotOutline')
    .attr('r', 8)
    .attr('stroke', '#E9E5F2')
    .attr('fill', '#E9E5F2')
    .attr('class', 'crosshairDotOutline');

  // X Crosshair
  crosshair
    .append('line')
    .attr('id', 'crosshairX')
    .attr('class', 'crosshair')
    .style('display', 'none');

  // Y Crosshair
  crosshair
    .append('line')
    .attr('id', 'crosshairY')
    .attr('class', 'crosshair');
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
    updateSelectedOrderProperties,
  } = options;

  depthChart
    .append('rect')
    .attr('class', 'overlay')
    .attr('width', drawParams.containerWidth)
    .attr('height', drawParams.containerHeight)
    .on('mouseover', () => d3.select('#crosshairs').style('display', null))
    .on('mouseout', () => {
      updateHoveredPrice(null);
      d3.select('.depth-line-bids').attr('stroke-width', 1);
      d3.select('.depth-line-asks').attr('stroke-width', 1);
      d3.select('#crosshairX').attr('class', 'crosshair');
      d3.select('#crosshairY').attr('class', 'crosshair');
    })
    .on('mousemove', () => {
      const mouse = d3.mouse(d3.select('#depth_chart').node());
      const asksDepthLine = '.depth-line-asks';
      const bidsDepthLine = '.depth-line-bids';
      // Determine closest order
      const hoveredPrice = drawParams.xScale
        .invert(mouse[0])
        .toFixed(pricePrecision);

      const nearestFillingOrder = nearestCompletelyFillingOrder(
        hoveredPrice,
        marketDepth,
        marketMin,
        marketMax,
        drawParams
      );
      if (nearestFillingOrder === null) return;

      d3.select(bidsDepthLine).attr(
        'stroke-width',
        nearestFillingOrder[4] === ASKS ? 1 : 2
      );
      d3.select(asksDepthLine).attr(
        'stroke-width',
        nearestFillingOrder[4] === ASKS ? 2 : 1
      );
      d3.select('#crosshairX').attr(
        'class',
        `crosshair-${nearestFillingOrder[4]}`
      );
      d3.select('#crosshairY').attr(
        'class',
        `crosshair-${nearestFillingOrder[4]}`
      );

      updateHoveredPrice(hoveredPrice);
      const { xScale, yScale } = drawParams;
      d3.select('#price_label').attr('class', `${nearestFillingOrder[4]}`);
      d3.select('#volume_label').attr('class', `${nearestFillingOrder[4]}`);
      d3.select('#cost_label').attr('class', `${nearestFillingOrder[4]}`);
      d3.select('#price_value').html(
        `$${createBigNumber(nearestFillingOrder[1]).toFixed(pricePrecision)}`
      );
      d3.select('#volume_value').html(
        `${createBigNumber(nearestFillingOrder[0]).toFixed(pricePrecision)}`
      );
      d3.select('#cost_value').html(
        // @ts-ignore
        `$${nearestFillingOrder[5].toFixed(pricePrecision)}`
      );

      // 27 comes from the padding/border/margins so 1rem total for horz
      // padding .5 rem for label/value seperation, + borderpx of 3 (2 on line
      // side, 1 on the other)
      // const defaultHeight = 51;
      // const defaultWidth = 113;
      const borderPadding = 2;
      const verticalSpacing = 24;
      const testWidth =
        d3.select('#hovered_tooltip_values').node().clientWidth +
        d3.select('#hovered_tooltip_labels').node().clientWidth +
        27 +
        borderPadding;
      const testHeight =
        d3.select('#hovered_tooltip').node().clientHeight + verticalSpacing;
      let quarterX = xScale(drawParams.xDomain[1] * 0.1);
      let quarterY = yScale(drawParams.yDomain[1] * 0.9);
      quarterX = quarterX > testWidth ? quarterX : testWidth;
      quarterY = quarterY > testHeight ? quarterY : testHeight;
      const flipX = quarterX > xScale(nearestFillingOrder[1]);
      const flipY = quarterY > yScale(nearestFillingOrder[0]);
      d3.select('#hovered_tooltip').attr(
        'class',
        `hovered_tooltip_div ${nearestFillingOrder[4]} ${flipX ? 'flip' : ''}`
      );
      const offset = {
        hoverToolTipX: flipX ? 0 : testWidth * -1,
        hoverToolTipY: flipY ? verticalSpacing : testHeight * -1,
      };
      const tooltip = d3
        .select('#hovered_tooltip_container')
        .style('display', 'flex')
        .style('height', testHeight)
        .style('width', testWidth);
      tooltip
        .attr('x', xScale(nearestFillingOrder[1]) + offset.hoverToolTipX)
        .attr('y', yScale(nearestFillingOrder[0]) + offset.hoverToolTipY);
    })
    .on('click', () => {
      const mouse = d3.mouse(d3.select('#depth_chart').node());
      const orderPrice = drawParams.xScale
        .invert(mouse[0])
        .toFixed(pricePrecision);
      const nearestFillingOrder = nearestCompletelyFillingOrder(
        orderPrice,
        marketDepth,
        marketMin,
        marketMax,
        drawParams
      );

      if (
        nearestFillingOrder != null &&
        createBigNumber(orderPrice).gte(marketMin) &&
        createBigNumber(orderPrice).lte(marketMax)
      ) {
        updateSelectedOrderProperties({
          orderQuantity: nearestFillingOrder[0],
          orderPrice: nearestFillingOrder[1],
          selectedNav: nearestFillingOrder[4] === BIDS ? SELL : BUY,
        });
      }
    });
}
