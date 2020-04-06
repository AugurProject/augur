import React, { Component } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/candlestick/candlestick.styles.less';
import { PERIOD_RANGES, DAI } from 'modules/common/constants';
import { PriceTimeSeriesData } from 'modules/types';

NoDataToDisplay(Highcharts);

interface HighChartsWrapperProps {
  priceTimeSeries: PriceTimeSeriesData[];
  selectedPeriod: number;
  pricePrecision: number;
  updateHoveredPeriod: Function;
  marketMax: BigNumber;
  marketMin: BigNumber;
  volumeType: string;
  currentTimeInSeconds: number;
  isArchived?: boolean;
}

const GROUPING_UNITS = [
  ['minute', [1]],
  ['hour', [1]],
  ['day', [1]],
  ['week', [1]],
  ['month', [1]],
  ['year', [1]],
];

export default class CandlestickHighchart extends Component<
  HighChartsWrapperProps,
  {}
> {
  chart: Highcharts.Chart;
  container: HTMLDivElement;
  xMin: Number;
  xMax: Number;
  xMinCurrent: Number;

  constructor(props) {
    super(props);

    this.displayCandleInfoAndPlotViz = this.displayCandleInfoAndPlotViz.bind(
      this
    );
    this.clearCandleInfoAndPlotViz = this.clearCandleInfoAndPlotViz.bind(this);
    this.mouseWheelHandler = this.mouseWheelHandler.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      priceTimeSeries,
      selectedPeriod,
      volumeType,
    } = this.props;
    if (
      JSON.stringify(priceTimeSeries) !==
        JSON.stringify(nextProps.priceTimeSeries) ||
      selectedPeriod !== nextProps.selectedPeriod ||
      volumeType !== nextProps.volumeType
    ) {
      this.buildOptions(
        nextProps.priceTimeSeries,
        nextProps.selectedPeriod,
        nextProps.volumeType
      );
    }
  }

  componentDidMount() {
    const { priceTimeSeries, selectedPeriod, volumeType } = this.props;
    if (priceTimeSeries) {
      this.buildOptions(priceTimeSeries, selectedPeriod, volumeType);
    }
    this.container.addEventListener("mousewheel", this.mouseWheelHandler, false);
  }

  mouseWheelHandler(e) {
    e.preventDefault();
    const spinAmount = Math.ceil(e.wheelDelta / 100);
    const changeRate = spinAmount * this.chart.xAxis[0].minRange;
    const { dataMax } = this.chart.xAxis[0].getExtremes();
    const newMin = this.xMinCurrent + changeRate;
    const maxMin = dataMax - this.chart.xAxis[0].minRange;
    this.xMinCurrent = newMin < this.xMin ? this.xMin : newMin;
    if (isNaN(newMin)) this.xMinCurrent = this.xMin;
    if (this.xMinCurrent > maxMin) this.xMinCurrent = maxMin;

    this.chart.xAxis[0].setExtremes(this.xMinCurrent, dataMax, false);
    this.chart.yAxis[0].setExtremes(this.chart.yAxis[0].dataMin * 0.95, this.chart.yAxis[0].dataMax * 1.05);
  }

  buildOptions(
    priceTimeSeries: PriceTimeSeriesData[],
    selectedPeriod: number,
    volumeType: string
  ) {
    const { marketMax, marketMin, pricePrecision, currentTimeInSeconds, isArchived } = this.props;
    const candlestick = [];
    const volume = [];
    const priceBuckets = [];
    this.xMin = priceTimeSeries[0] && priceTimeSeries[0].period || 0;
    this.xMinCurrent = this.xMin;
    this.xMax = priceTimeSeries[0] && priceTimeSeries[priceTimeSeries.length -1].period || 0;
    const start = priceTimeSeries.length >= 1 && priceTimeSeries[0].period ? priceTimeSeries[0].period : 0;
    const end = currentTimeInSeconds * 1000;
    const fullRange = end - start;
    const period = selectedPeriod * 1000;
    if (fullRange > 0 && priceTimeSeries.length > 0 && currentTimeInSeconds > 1000) {
      const num = (fullRange / period);
      for (let i = 0; i <= num; i++) {
        priceBuckets.push(start + (i * period));
      }
      // use the first found trade to indicate -
      let lastPrice = priceTimeSeries[0].open;
      priceBuckets.forEach(timestamp => {
        const index = priceTimeSeries.findIndex(item => item.period === timestamp);
        if (index >= 0) {
          const price = priceTimeSeries[index];
          lastPrice = price.close;
          const { open, high, low, close, period, volume: daiVolume, shareVolume } = price;
          candlestick.push({x: period, open, high, low, close });
          const volumeValue = volumeType === DAI ? daiVolume : shareVolume;
          volume.push([period, volumeValue]);
        } else {
          candlestick.push({
            x: timestamp, 
            open: lastPrice, 
            high: lastPrice, 
            low: lastPrice, 
            close: lastPrice,
            colorIndex: 3
          });
          volume.push([timestamp, 0]);
        }
      })
    } else {
      priceTimeSeries.forEach(price => {
        const { open, high, low, close, period, volume: daiVolume, shareVolume } = price;
        candlestick.push({x: period, open, high, low, close });
        const volumeValue = volumeType === DAI ? daiVolume : shareVolume;
        volume.push([period, volumeValue]);
      });
    }
       
    const { range, format, crosshair } = PERIOD_RANGES[selectedPeriod];
    this.xMinCurrent = this.xMax - range;
    const options = {
      lang: {
        noData: isArchived ? 'Data Archived' : 'No Completed Trades',
      },
      credits: { enabled: false },
      tooltip: { enabled: false },
      scrollbar: { enabled: false },
      navigator: { enabled: false },
      rangeSelector: { enabled: false },
      plotOptions: {
        candlestick: {
          borderRadius: 5,
        },
        series: {
          point: {
            events: {
              mouseOver: evt => this.displayCandleInfoAndPlotViz(evt),
              mouseOut: evt => this.clearCandleInfoAndPlotViz(evt),
            },
          },
        },
      },
      chart: {
        type: 'candlestick',
        followTouchMove: true,
        panning: true,
        animation: false,
        spacing: [10, 8, 10, 0],
      },
      xAxis: {
        ordinal: false,
        tickLength: 7,
        gridLineWidth: 1,
        gridLineColor: null,
        labels: {
          format,
          align: 'center',
        },
        range,
        crosshair: {
          width: 0,
          className: Styles.Candlestick_display_none,
          label: {
            enabled: true,
            format: crosshair,
            shape: 'square',
            padding: 2,
          },
        },
      },
      yAxis: [
        // OHCL
        {
          showEmpty: true,
          max: marketMax.toFixed(pricePrecision),
          min: marketMin.toFixed(pricePrecision),
          showFirstLabel: false,
          showLastLabel: true,
          offset: 2,
          labels: {
            format: '${value:.2f}',
            style: Styles.Candlestick_display_yLables,
            reserveSpace: true,
            y: 16,
          },
          crosshair: {
            snap: false,
            label: {
              enabled: true,
              format: '${value:.2f}',
              borderRadius: 5,
              shape: 'square',
              padding: 2,
            },
          },
        },
        // VOLUME
        {
          min: 0,
          top: '85%',
          height: '15%',
          opposite: true,
          className: Styles.Candlestick_display_none, // Hide Volume Y-axis Scale
          labels: {
            enabled: false,
          },
        },
      ],

      series: [
        {
          // OHLC
          type: 'candlestick',
          name: 'ohlc',
          data: candlestick,
          yAxis: 0,
          zIndex: 1,
          dataGrouping: {
            units: GROUPING_UNITS,
          },
          maxPointWidth: 20,
          minPointWidth: 10,
        },
        // VOLUME
        {
          type: 'column',
          name: 'volume',
          data: volume,
          yAxis: 1,
          maxPointWidth: 20,
          minPointWidth: 10,
          dataGrouping: {
            units: GROUPING_UNITS,
          },
        },
      ],
    };

    this.chart = Highcharts.stockChart(this.container, options);
    this.chart.yAxis[0].setExtremes(this.chart.yAxis[0].dataMin * 0.95, this.chart.yAxis[0].dataMax * 1.05);
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.container.removeEventListener("mousewheel", this.mouseWheelHandler, false);
  }

  displayCandleInfoAndPlotViz(evt) {
    const { updateHoveredPeriod, priceTimeSeries, volumeType, selectedPeriod } = this.props;
    const period = selectedPeriod * 1000;
    const { x: timestamp } = evt.target;
    const pts = priceTimeSeries.find(p => p.period === timestamp);
    if (pts) {
      const { open, close, high, low } = pts;

      updateHoveredPeriod({
        open: open ? createBigNumber(open) : '',
        close: close ? createBigNumber(close) : '',
        high: high ? createBigNumber(high) : '',
        low: low ? createBigNumber(low) : '',
        volume: pts
          ? createBigNumber(volumeType === DAI ? pts.volume : pts.shareVolume)
          : '',
      });

      const mid = this.chart.xAxis[0].toPixels(timestamp, true);
      const scaledFrom = this.chart.xAxis[0].toPixels(timestamp - (period * .25), true);
      const scaledTo = this.chart.xAxis[0].toPixels(timestamp + (period * .25), true);
      // const maxFrom = mid - 10;
      // const maxTo = mid + 10;
      const scaledRange = scaledTo - scaledFrom;
      // make sure to never draw larger than 20 px as that's the max size of bars.
      const from = this.chart.xAxis[0].toValue(scaledRange < 20 ? scaledFrom : (mid - 10), true);
      const to = this.chart.xAxis[0].toValue(scaledRange < 20 ? scaledTo : (mid + 10), true);

      const plotBand = {
        id: 'new-plot-band',
        from,
        to,
      };
  
      this.chart.xAxis[0].addPlotBand(plotBand);
      this.updateVolumeBar(true, timestamp);
    }
  }

  clearCandleInfoAndPlotViz(evt) {
    const { updateHoveredPeriod } = this.props;
    const { x: timestamp } = evt.target;

    updateHoveredPeriod({
      open: '',
      close: '',
      high: '',
      low: '',
      volume: '',
    });

    if (this.chart.xAxis[0] && !this.chart.xAxis[0].isDirty) {
      this.chart.xAxis[0].removePlotBand('new-plot-band');
      this.updateVolumeBar(false, timestamp);
    }
  }

  updateVolumeBar(isHover, timestamp) {
    const groupData = this.chart.yAxis[1].series[0].groupedData;
    const isGroupedData = groupData && groupData.length > 0;
    const data = !isGroupedData
      ? this.chart.yAxis[1].series[0].data
      : groupData;

    const bar = data.find(d => d && d.x === timestamp);

    const color = isHover ? '#0E0E0F' : '#3C3B43';

    if (isGroupedData) {
      const index = data.indexOf(bar);
      if (groupData[index]) {
        groupData[index].graphic.css({
          color,
        });
      }
    } else if (bar) {
      const currentColor = bar.color;
      if (currentColor !== color) {
        bar.update({
          color,
        });
      }
    }
  }

  render() {
    return (
      <div
        className={Styles.Candlestick}
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}
