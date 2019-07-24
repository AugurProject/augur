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

const negativeColor = '#FF7D5E';
const positiveColor = '#09CFE1';

const getGradientColor = data => {
  const { hasPositivePoints, hasNegativePoints } = getPointRangeInfo(data);

  if (hasNegativePoints && !hasPositivePoints) {
    return [[0, negativeColor], [1, '#211A32']];
  }

  return [[0, positiveColor], [1, '#211A32']];
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

  componentWillUpdate(nextProps: ChartProps) {
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
        height: 100,
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
        labels: {
          style: Styles.Labels,
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
          format: "{value:.4f} <span class='dai-label'>DAI</span>",
          formatter() {
            if (this.value === 0) return "0 <span class='dai-label'>DAI</span>";
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

    const max = formatEther(bnMax, { decimalsRounded: 4 }).formattedValue;
    const min = formatEther(bnMin, { decimalsRounded: 4 }).formattedValue;
    const tickInterval = bnMax.abs().gt(bnMin.abs())
      ? formatEther(bnMax.abs()).formattedValue
      : formatEther(bnMin.abs()).formattedValue;

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
