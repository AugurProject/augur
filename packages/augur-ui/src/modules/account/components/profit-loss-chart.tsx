import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock';
import Styles from 'modules/account/components/overview-chart.styles.less';
import { formatEther } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';

const HIGHLIGHTED_LINE_WIDTH = 1;

interface ChartProps {
  data: number[][];
  width: number;
}

interface ChartState {
  options: Highcharts.Options | {};
}

const getPointRangeInfo = data => {
  return {
    hasPositivePoints: data.filter(point => point[1] > 0).length,
    hasNegativePoints: data.filter(point => point[1] < 0).length,
  };
};

const positiveColor = '#00F1C4';
const negativeColor = '#FF7D5E';

const getGradientColor = data => {
  const { hasPositivePoints, hasNegativePoints } = getPointRangeInfo(data);

  if (hasNegativePoints && !hasPositivePoints) {
    return [[0, negativeColor], [1, 'transparent']];
  }

  return [[0, positiveColor], [1, 'transparent']];
};

const getLineColor = data => {
  const { hasPositivePoints, hasNegativePoints } = getPointRangeInfo(data);

  if (hasNegativePoints && !hasPositivePoints) {
    return negativeColor;
  }
  return positiveColor;
};

const getNegativeColor = data => {
  const { hasPositivePoints, hasNegativePoints } = getPointRangeInfo(data);

  if (hasPositivePoints && !hasNegativePoints) {
    return positiveColor;
  }
  return negativeColor;
};

export default class ProfitLossChart extends Component<ChartProps, ChartState> {
  state: ChartState = {
    options: {},
  };

  public container = null;
  public chart: Highcharts.Chart = null;

  componentDidMount() {
    const { data } = this.props;
    this.buidOptions(data);
  }

  UNSAFE_componentWillUpdate(nextProps: ChartProps) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
      this.buidOptions(nextProps.data);
    }
  }

  componentWillUnmount() {
    if (this.chart && this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  getDefaultOptions(data) {
    const defaultOptions = {
      title: {
        text: '',
      },
      chart: {
        type: 'areaspline',
        height: 120,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        areaspline: {
          threshold: null,
          dataGrouping: {
            units: [['hour', [1]], ['day', [1]]],
          },
          marker: false,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: getGradientColor(data),
          },
        },
      },
      scrollbar: { enabled: false },
      navigator: { enabled: false },
      xAxis: {
        showFirstLabel: true,
        showLastLabel: true,
        endOnTick: false,
        startOnTick: false,
        tickLength: 4,
        labels: {
          style: null,
          format: '{value:%b %d}',
          formatter() {
            if (this.isLast) return 'Today';
            if (this.isFirst) {
              return Highcharts.dateFormat('%d %b %Y', this.value);
            }
          },
        },
        crosshair: false,
      },
      yAxis: {
        opposite: false,
        showFirstLabel: true,
        showLastLabel: true,
        startOnTick: false,
        endOnTick: false,
        labels: {
          style: null,
          format: '${value:.2f}',
          formatter() {
            if (this.value === 0) return '$0';
            return this.axis.defaultLabelFormatter.call(this);
          },
          align: 'left',
          x: 0,
          y: -2,
        },
        resize: {
          enabled: false,
        },
        crosshair: false,
      },
      rangeSelector: {
        enabled: false,
      },
    };

    return defaultOptions;
  }

  calculateTickInterval = (data: number[][]) => {
    const values = data.map(d => d[1]);

    const bnMin = createBigNumber(
      values.reduce(
        (a, b) => (createBigNumber(a).lte(createBigNumber(b)) ? a : b),
        0
      )
    );
    const bnMax = createBigNumber(
      values.reduce(
        (a, b) => (createBigNumber(a).gte(createBigNumber(b)) ? a : b),
        0
      )
    );

    const max = formatEther(bnMax.gt(0) ? bnMax.times(1.05) : bnMax, {
      decimalsRounded: 4,
    }).formattedValue;
    const min = formatEther(bnMin.lt(0) ? bnMin.times(1.05) : bnMin, {
      decimalsRounded: 4,
    }).formattedValue;
    const intervalDivision = bnMin.eq(0) || bnMax.eq(0) ? 1.99 : 3;
    const tickInterval = formatEther(
      bnMax
        .abs()
        .plus(bnMin.abs())
        .div(intervalDivision),
      { decimalsRounded: 4 }
    ).formattedValue;

    return {
      tickInterval,
      max,
      min,
    };
  };

  buidOptions(data: number[][]) {
    const { width } = this.props;

    const options = this.getDefaultOptions(data);
    const intervalInfo = this.calculateTickInterval(data);
    const tickPositions = [data[0][0], data[data.length - 1][0]];

    options.chart = {
      ...options.chart,
      width: width - 10,
    };

    if (Array.isArray(options.xAxis)) {
      options.xAxis[0] = {
        ...options.xAxis[0],
        tickPositions,
      };
    } else {
      options.xAxis = {
        ...options.xAxis,
        tickPositions,
      };
    }

    if (Array.isArray(options.yAxis)) {
      options.yAxis[0] = {
        ...options.yAxis[0],
        ...intervalInfo,
      };
    } else {
      options.yAxis = {
        ...options.yAxis,
        ...intervalInfo,
      };
    }

    const series = [
      {
        type: 'areaspline',
        lineWidth: HIGHLIGHTED_LINE_WIDTH,
        data,
        color: getLineColor(data),
        negativeColor: getNegativeColor(data),
      },
    ];

    const newOptions: Highcharts.Options = Object.assign(options, {
      series,
    }) as Highcharts.Options;

    this.setState({ options: newOptions });

    // initial load
    this.chart = Highcharts.stockChart(this.container, newOptions);
  }

  render() {
    return (
      <div
        className={Styles.ProfitLossChart}
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}
