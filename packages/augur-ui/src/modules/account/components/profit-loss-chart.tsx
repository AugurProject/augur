import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import Styles from 'modules/account/components/overview-chart.styles.less';
import { formatDaiPrice, formatDai } from 'utils/format-number';
import { createBigNumber } from 'utils/create-big-number';

const HIGHLIGHTED_LINE_WIDTH = 1;

interface ChartProps {
  data: number[][];
  width: number;
}

const getPointRangeInfo = data => {
  return {
    hasPositivePoints: data.filter(point => point[1] >= 0).length,
    hasNegativePoints: data.filter(point => point[1] < 0).length,
  };
};

const positiveColor = '#00F1C4';
const negativeColor = '#FF7D5E';

const getGradientColor = (data: number[][]) => {
  if (data[data.length - 1][1] < 0) {
    return [[0, negativeColor], [1, 'transparent']];
  }
  return [[0, positiveColor], [1, 'transparent']];
};

const getOptions = () => ({
  title: {
    text: '',
  },
  chart: {
    type: 'areaspline',
    spacing: [10, 14, 0, 14],
    height: 245,
    width: null,
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
        return formatDai(this.value, { removeComma: true }).full;
      },
      align: 'left',
      x: 0,
      y: -2,
    },
    tickPositioner: (min, max) => {
      let arr = []
      if(min !== 0) {
        arr.push(min);
      }
      arr.push(0);
      if (max !== 0) {
        arr.push(max);
      }
      return arr;
    },
    resize: {
      enabled: true,
    },
    crosshair: false,
  },
  rangeSelector: {
    enabled: false,
  },
});

interface AxisData {
  type: string;
  lineWidth: number;
  data: number[][];
  color: string;
  fillColor: any;
  negativeColor: string;
}

const getAreaSpline = (data: number[][]): AxisData => {
  return {
    type: 'areaspline',
    lineWidth: HIGHLIGHTED_LINE_WIDTH,
    data,
    color:
      data[0][1] > 0 || data[data.length - 1][1] > 0
        ? positiveColor
        : negativeColor,
    fillColor: {
      linearGradient: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1,
      },
      stops: getGradientColor(data),
    },
    negativeColor: !!getPointRangeInfo(data).hasNegativePoints
      ? negativeColor
      : positiveColor,
  };
};

const ProfitLossChart = ({ width, data }: ChartProps) => {
  const container = useRef(null);
  useEffect(() => {
    const options = getOptions();
    const intervalInfo = calculateTickInterval(data);
    const tickPositions = [data[0][0], data[data.length - 1][0]];
    options.chart = {
      ...options.chart,
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
    interface dataObject {
      arr: number[][];
    }
    // break up data based on crossing 0 x axis.
    const series = data.reduce(
      (p, d): dataObject[] => {
        if (p.length === 0) {
          return [{ arr: [d] }];
        }
        const last = p[p.length - 1];
        const lastArrValue = last.arr[last.arr.length - 1];
        const lastValueIsPositive = lastArrValue[1] > 0;
        const currentValueIsPositive = d[1] > 0;
        if (
          (lastValueIsPositive && currentValueIsPositive) ||
          (!lastValueIsPositive && !currentValueIsPositive)
        ) {
          // add to existing
          last.arr.push(d);
          return p;
        }

        // create new array
        return [...p, { arr: [lastArrValue, d] }];
      },
      [] as dataObject[]
    )
    .map((d: dataObject) => getAreaSpline(d.arr));

    const newOptions: Highcharts.Options = Object.assign(options, {
      series,
    }) as Highcharts.Options;
    Highcharts.stockChart(container.current, newOptions);
  }, [data]);

  const calculateTickInterval = (data: number[][]) => {
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

    const max = formatDai(bnMax)
      .formattedValue;
    const min = formatDai(bnMin)
      .formattedValue;
    const intervalDivision = bnMin.eq(0) || bnMax.eq(0) ? 1.99 : 3;
    const tickInterval = formatDai(
      bnMax
        .abs()
        .plus(bnMin.abs())
        .div(intervalDivision)
    ).formattedValue;

    return {
      tickInterval,
      max,
      min,
    };
  };

  return <div className={Styles.ProfitLossChart} ref={container} />;
};

export default ProfitLossChart;
