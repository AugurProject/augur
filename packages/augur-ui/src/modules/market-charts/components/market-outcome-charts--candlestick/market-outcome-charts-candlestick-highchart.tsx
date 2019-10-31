import React, { Component } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/market-outcome-charts--candlestick/candlestick.styles.less';
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
  isMobile: boolean;
  currentTimeInSeconds: number;
}

export default class MarketOutcomeChartsCandlestickHighchart extends Component<
  HighChartsWrapperProps,
  {}
> {
  static defaultProps = {
    isMobile: false,
  };

  chart: Highcharts.Chart;
  container: HTMLDivElement;

  constructor(props) {
    super(props);

    this.displayCandleInfoAndPlotViz = this.displayCandleInfoAndPlotViz.bind(
      this
    );
    this.clearCandleInfoAndPlotViz = this.clearCandleInfoAndPlotViz.bind(this);
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
      );
    }
  }

  componentDidMount() {
    const { priceTimeSeries, selectedPeriod } = this.props;
    if (priceTimeSeries) {
      this.buildOptions(priceTimeSeries, selectedPeriod);
    }
  }

  buildOptions(
    priceTimeSeries: PriceTimeSeriesData[],
    selectedPeriod: number
  ) {
    const { isMobile, marketMax, marketMin, pricePrecision } = this.props;
    const candlestick = priceTimeSeries.map(price => {
      return [price.period, price.open, price.high, price.low, price.close];
    });

    const volume = priceTimeSeries.map(price => {
      return [price.period, price.volume];
    });

    // Add space Buffer to edge of chart for yAxis
    if (priceTimeSeries.length > 0) {
      const now = Number(new Date());
      volume.push([Math.round(now), 0]);
    }

    const groupingUnits = [
      ['minute', [1]],
      ['hour', [1]],
      ['day', [1]],
      ['week', [1]],
      ['month', [1]],
      ['year', [1]],
    ];

    const { range, format, crosshair } = PERIOD_RANGES[selectedPeriod];

    const options = {
      lang: {
        noData: 'No Completed Trades',
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
        followTouchMove: false,
        panning: isMobile,
        styledMode: false,
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
            units: groupingUnits,
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
            units: groupingUnits,
          },
        },
      ],
    };

    this.chart = Highcharts.stockChart(this.container, options);
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  displayCandleInfoAndPlotViz(evt) {
    const { updateHoveredPeriod, priceTimeSeries, volumeType } = this.props;
    const { x: timestamp } = evt.target;
    const xRangeTo = this.chart.xAxis[0].toValue(20, true);
    const xRangeFrom = this.chart.xAxis[0].toValue(0, true);
    const range = Math.abs((xRangeFrom - xRangeTo) * 0.6);
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
    }

    const plotBand = {
      id: 'new-plot-band',
      from: timestamp - range,
      to: timestamp + range,
    };

    this.chart.xAxis[0].addPlotBand(plotBand);
    this.updateVolumeBar(true, timestamp);
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
