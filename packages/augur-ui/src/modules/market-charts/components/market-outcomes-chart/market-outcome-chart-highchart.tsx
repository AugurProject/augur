import React, { Component } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/market-outcomes-chart/market-outcomes-chart.styles.less';

NoDataToDisplay(Highcharts);

const HIGHLIGHTED_LINE_WIDTH = 2;
const NORMAL_LINE_WIDTH = 1;
const NUM_DAYS_TO_USE_DAY_TIMEFRAME = 2;

interface MarketOutcomeChartsHighchartsProps {
  maxPrice: number;
  minPrice: number;
  bucketedPriceTimeSeries: object;
  isScalar: boolean;
  scalarDenomination: string;
  selectedOutcomeId: number;
  pricePrecision: number;
  daysPassed: number;
}

interface MarketOutcomeChartsHighchartsState {
  options: any;
}

export default class MarketOutcomesChartHighchart extends Component<
  MarketOutcomeChartsHighchartsProps,
  MarketOutcomeChartsHighchartsState
> {
  static defaultProps = {
    isScalar: false,
    daysPassed: 0,
    scalarDenomination: '',
  };

  container: any;
  chart: Highcharts.Chart;

  constructor(props) {
    super(props);
    this.state = {
      options: {
        lang: {
          noData: 'No Completed Trades',
        },
        title: {
          text: '',
        },
        chart: {
          type: 'line',
          styledMode: false,
          animation: false,
          reflow: true,
          marginTop: 20,
          spacing: [0, 8, 10, 0],
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          area: {
            threshold: null,
          },
          line: {
            dataGrouping: {
              forced: true,
              units: [['day', [1]]],
            },
          },
          series: {
            marker: {
              enabled: false,
            },
          },
        },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        xAxis: {
          ordinal: false,
          showFirstLabel: true,
          showLastLabel: true,
          tickLength: 7,
          gridLineWidth: 1,
          gridLineColor: null,
          labels: {
            format: '{value:%b %d}',
            style: { fontSize: '9px' },
          },
          crosshair: {
            label: {
              enabled: true,
              format: '{value:%b %d}',
            },
          },
        },
        yAxis: {
          showEmpty: true,
          opposite: true,
          max: createBigNumber(props.maxPrice).toFixed(props.pricePrecision),
          min: createBigNumber(props.minPrice).toFixed(props.pricePrecision),
          showFirstLabel: false,
          showLastLabel: true,
          offset: 2,
          labels: {
            format: props.isScalar ? '{value:.4f}' : '${value:.2f}',
            style: null,
            reserveSpace: true,
            y: 16,
          },
          crosshair: {
            label: {
              padding: 2,
              enabled: true,
              style: null,
              borderRadius: 5,
              shape: 'square',
              format: props.isScalar ? '{value:.4f}' : '${value:.2f}',
            },
          },
        },
        tooltip: { enabled: false },
        rangeSelector: {
          enabled: false,
        },
      },
    };
    this.buidOptions = this.buidOptions.bind(this);
  }

  componentDidMount() {
    const {
      bucketedPriceTimeSeries,
      selectedOutcomeId,
      daysPassed,
    } = this.props;
    this.buidOptions(
      daysPassed,
      bucketedPriceTimeSeries,
      selectedOutcomeId
    );
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const {
      bucketedPriceTimeSeries,
      daysPassed,
      selectedOutcomeId,
    } = this.props;
    if (
      JSON.stringify(bucketedPriceTimeSeries) !==
        JSON.stringify(nextProps.bucketedPriceTimeSeries) ||
      daysPassed !== nextProps.daysPassed ||
      selectedOutcomeId !== nextProps.selectedOutcomeId
    ) {
      this.buidOptions(
        nextProps.daysPassed,
        nextProps.bucketedPriceTimeSeries,
        nextProps.selectedOutcomeId
      );
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  getxAxisProperties = (daysPassed, useTickInterval) => {
    const hours = '{value:%H:%M}';
    const days = '{value:%b %d}';
    const mmSecondsInHour = createBigNumber(3600 * 1000);
    const mmSecondsInDay = createBigNumber(24).times(mmSecondsInHour);
    const mmSecondsInWeek = createBigNumber(7).times(mmSecondsInDay);
    let interval = daysPassed <= 7 ? mmSecondsInHour : mmSecondsInDay;
    interval = daysPassed >= 60 ? mmSecondsInWeek : interval;
    return {
      labels: {
        format: interval.isEqualTo(mmSecondsInHour) ? hours : days,
        style: null,
      },
      crosshair: {
        snap: true,
        label: {
          enabled: true,
          shape: 'square',
          padding: 4,
        },
      },
    };
  };

  buidOptions(
    daysPassed,
    bucketedPriceTimeSeries,
    selectedOutcomeId,
  ) {
    const { options } = this.state;
    const { isScalar, scalarDenomination } = this.props;
    const { priceTimeSeries } = bucketedPriceTimeSeries;

    const highestLength = Object.keys(priceTimeSeries).reduce(
      (p, id) =>
        priceTimeSeries[id].length > p ? priceTimeSeries[id].length : p,
      0
    );
    const timeIncrement =
      daysPassed > NUM_DAYS_TO_USE_DAY_TIMEFRAME ? 'day' : 'hour';

    const xAxisProperties = this.getxAxisProperties(
      daysPassed,
      highestLength > 1 // don't use tickInterval if there is only 1 data point
    );
    if (Array.isArray(options.xAxis)) {
      options.xAxis = Object.assign(options.xAxis[0], xAxisProperties);
    } else {
      options.xAxis = Object.assign(options.xAxis, xAxisProperties);
    }

    options.chart = {
      ...options.chart,
    };

    const hasData =
      priceTimeSeries &&
      Object.keys(priceTimeSeries) &&
      Object.keys(priceTimeSeries).filter(
        key => priceTimeSeries[key].length > 0
      ).length;

    const series = [];

    let mostRecentTradetime = 0;
    Object.keys(priceTimeSeries).forEach(id => {
      const isSelected = selectedOutcomeId && selectedOutcomeId == id;
      const length = priceTimeSeries[id].length;
      if (length > 0 && priceTimeSeries[id][length -1].timestamp > mostRecentTradetime) {
        mostRecentTradetime = priceTimeSeries[id][length - 1].timestamp;
      }
      const data = priceTimeSeries[id].map(pts => [
        pts.timestamp,
        createBigNumber(pts.price).toNumber(),
      ]);
      const baseSeriesOptions = {
        type: isSelected ? 'area' : 'line',
        lineWidth: isSelected ? HIGHLIGHTED_LINE_WIDTH : NORMAL_LINE_WIDTH,
        marker: {
          symbol: 'cicle',
        },
        // @ts-ignore
        data,
      };

      series.push({
        ...baseSeriesOptions,
      });
    });
    series.forEach(seriesObject => {
      const seriesData = seriesObject.data;
      // make sure we have a trade to fill chart
      if (
        seriesData.length > 0 &&
        seriesData[seriesData.length - 1][0] != mostRecentTradetime
      ) {
        const mostRecentTrade = seriesData[seriesData.length - 1];
        seriesObject.data.push([mostRecentTradetime, mostRecentTrade[1]]);
      }
      seriesObject.data.sort((a,b) => a[0] - b[0]);
    });

    if (isScalar && hasData) {
      options.title.text = scalarDenomination;
    }
    options.plotOptions.line.dataGrouping = {
      ...options.plotOptions.line.dataGrouping,
      forced: true,
      units: [[timeIncrement, [1]]],
    };

    const newOptions = Object.assign(options, { series });

    this.setState({ options: newOptions });

    // initial load
    if (!this.chart || !hasData) {
      this.chart = Highcharts.stockChart(this.container, newOptions);
      return;
    }
    // rebuild chart when we get chart data, afterwards just update
    if (this.chart && hasData && this.chart.xAxis[0].series.length === 0) {
      this.chart = Highcharts.stockChart(this.container, newOptions);
    } else if (this.chart && hasData) {
      this.chart.update(newOptions);
    }
  }

  render() {
    return (
      <div
        className={Styles.MarketOutcomeChartsHighcharts}
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}
