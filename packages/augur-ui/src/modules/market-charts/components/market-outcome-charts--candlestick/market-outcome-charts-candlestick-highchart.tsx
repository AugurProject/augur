import React, { Component } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/market-outcome-charts--candlestick/candlestick.styles.less';
import { PERIOD_RANGES, DAI } from 'modules/common/constants';
import { PriceTimeSeriesData } from 'modules/types';

NoDataToDisplay(Highcharts);

const HIGH_CHART_CONFIG = {
  ShowNavigator: 350,
  YLableXposition: -15,
  YLableYposition: -8,
  MobileMargin: [30, 0, 0, 0],
};

interface HighChartsWrapperProps {
  priceTimeSeries: PriceTimeSeriesData[];
  selectedPeriod: number;
  pricePrecision: number;
  updateHoveredPeriod: Function;
  marketMax: BigNumber;
  marketMin: BigNumber;
  volumeType: string;
  containerHeight: number;
  isMobile: boolean;
  currentTimeInSeconds: number;
}

interface HighChartsWrapperState {
  options: object;
}

export default class MarketOutcomeChartsCandlestickHighchart extends Component<
  HighChartsWrapperProps,
  HighChartsWrapperState
> {
  static defaultProps = {
    isMobile: false,
  };

  chart: Highcharts.Chart;
  container: HTMLDivElement;

  constructor(props) {
    super(props);
    this.state = {
      options: {
        lang: {
          noData: 'No Completed Trades',
        },
      },
    };

    this.displayCandleInfoAndPlotViz = this.displayCandleInfoAndPlotViz.bind(
      this
    );
    this.clearCandleInfoAndPlotViz = this.clearCandleInfoAndPlotViz.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      priceTimeSeries,
      selectedPeriod,
      volumeType,
      containerHeight,
    } = this.props;
    if (
      JSON.stringify(priceTimeSeries) !==
        JSON.stringify(nextProps.priceTimeSeries) ||
      selectedPeriod !== nextProps.selectedPeriod ||
      volumeType !== nextProps.volumeType ||
      containerHeight !== nextProps.containerHeight
    ) {
      this.buildOptions(
        nextProps.priceTimeSeries,
        nextProps.selectedPeriod,
        nextProps.containerHeight
      );
    }
  }

  componentDidMount() {
    if (this.props.priceTimeSeries) {
      this.buildOptions(
        this.props.priceTimeSeries,
        this.props.selectedPeriod,
        this.props.containerHeight
      );
    }
  }

  buildOptions(
    priceTimeSeries: PriceTimeSeriesData[],
    selectedPeriod: number,
    containerHeight: number
  ) {
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
      height: containerHeight,
      credits: { enabled: false },
      tooltip: { enabled: false },
      scrollbar: { enabled: false },
      navigator: { enabled: true },
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
        panning: this.props.isMobile,
        styledMode: false,
        animation: false,
        margin: this.props.isMobile
          ? HIGH_CHART_CONFIG.MobileMargin
          : [20, 10, 40, 10],
      },
      xAxis: {
        ordinal: false,
        labels: {
          format,
          align: 'center',
          reserveSpace: true,
        },
        range,
        crosshair: {
          width: 0,
          snap: true,
          className: Styles.Candlestick_display_none,
          label: {
            enabled: true,
            format: crosshair,
            align: 'center',
            y: 0,
            x: -5,
          },
        },
      },
      yAxis: [
        // OHCL
        {
          showEmpty: true,
          max: this.props.marketMax.toFixed(this.props.pricePrecision),
          min: this.props.marketMin.toFixed(this.props.pricePrecision),
          tickInterval: this.props.marketMax
            .minus(this.props.marketMin)
            .dividedBy(2)
            .toNumber(),
          showFirstLabel: true,
          showLastLabel: true,
          labels: {
            format: '{value:.2f}',
            style: Styles.Candlestick_display_yLables,
            align: 'center',
            x: HIGH_CHART_CONFIG.YLableXposition,
            y: HIGH_CHART_CONFIG.YLableYposition,
          },
          crosshair: {
            snap: false,
            label: {
              enabled: true,
              format: '{value:.2f}',
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
          color: '#161022',
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

    const fullOptions = Object.assign(this.state.options, options);
    this.chart = Highcharts.stockChart(this.container, fullOptions);
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

    const color = isHover ? '#665789' : '#161022';

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
