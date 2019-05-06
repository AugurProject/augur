import React, { Component } from "react";

import Highcharts from "highcharts/highstock";
import { createBigNumber } from "utils/create-big-number";
import Styles from "modules/account/components/account-overview-chart/account-overview-chart.styles";
import { UserTimeRangeData } from "modules/account/components/account-overview-chart/account-overview-chart";
import { isEqual } from "lodash";
import { formatEther } from "utils/format-number";

const HIGHLIGHTED_LINE_WIDTH = 2;

interface PlotData {
  timestamp: number;
  total: number;
}

interface ChartProps {
  data: Array<PlotData>;
  width: number;
}

interface ChartState {
  options: any;
}

export default class AccountProfitLossChart extends Component<
  ChartProps,
  ChartState
> {
  state: ChartState = {
    options: {
      title: {
        text: ""
      },
      chart: {
        type: "areaspline",
        height: 100
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        areaspline: {
          threshold: null,
          color: "#09CFE1",
          dataGrouping: {
            units: [["hour", [1]], ["day", [1]]]
          },
          marker: false,
          // remove these values when migrating to styleMode
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [[0, "#09CFE1"], [1, "#211A32"]]
          }
        }
      },
      scrollbar: { enabled: false },
      navigator: { enabled: false },
      xAxis: {
        showFirstLabel: true,
        showLastLabel: true,
        endOnTick: false,
        startOnTick: false,
        labels: {
          style: Styles.AccountOverviewChart_chart_labels,
          format: "{value:%b %d}",
          formatter() {
            if (this.isLast) return "Today";
            if (this.isFirst) {
              return Highcharts.dateFormat("%d %b %Y", this.value);
            }
          }
        },
        crosshair: false
      },
      yAxis: {
        opposite: false,
        showFirstLabel: true,
        showLastLabel: true,
        startOnTick: false,
        endOnTick: false,
        labels: {
          format: "{value:.4f} <span class='eth-label'>ETH</span>",
          formatter() {
            if (this.value === 0) return "0 <span class='eth-label'>ETH</span>";
            return this.axis.defaultLabelFormatter.call(this);
          },
          align: "left",
          x: 0,
          y: -2
        },
        resize: {
          enabled: false
        },
        crosshair: false
      },
      tooltip: { enabled: false },
      rangeSelector: {
        enabled: false
      }
    }
  };

  componentDidMount() {
    const { data } = this.props;
    this.buidOptions(data);
  }

  componentWillUpdate(nextProps: ChartProps) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.buidOptions(nextProps.data);
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  container: HTMLDivElement | null = null;
  chart: Object | null = null;

  calculateTickInterval = (data: UserTimeRangeData) => {
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
      min
    };
  };

  buidOptions(data: UserTimeRangeData) {
    const { options } = this.state;
    const { width } = this.props;

    const intervalInfo = this.calculateTickInterval(data);
    const tickPositions = [data[0][0], data[data.length - 1][0]];

    options.chart = {
      ...options.chart,
      width: width - 10
    };

    if (Array.isArray(options.xAxis)) {
      options.xAxis[0] = {
        ...options.xAxis[0],
        tickPositions
      };
    } else {
      options.xAxis = {
        ...options.xAxis,
        tickPositions
      };
    }

    if (Array.isArray(options.yAxis)) {
      options.yAxis[0] = {
        ...options.yAxis[0],
        ...intervalInfo
      };
    } else {
      options.yAxis = {
        ...options.yAxis,
        ...intervalInfo
      };
    }

    const series = [
      {
        type: "areaspline",
        lineWidth: HIGHLIGHTED_LINE_WIDTH,
        data
      }
    ];

    const newOptions = Object.assign(options, { series });

    this.setState({ options: newOptions });

    // initial load
    this.chart = Highcharts.stockChart(this.container, newOptions);
  }

  render() {
    return (
      <div
        className={Styles.AccountOverviewChart_chart}
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}
