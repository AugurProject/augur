import React, { Component } from "react";
import PropTypes from "prop-types";
import { createBigNumber } from "utils/create-big-number";
import Highcharts from "highcharts/highstock";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import Styles from "modules/market-charts/components/market-outcomes-chart/market-outcomes-chart.styles";
import { isEqual } from "lodash";

NoDataToDisplay(Highcharts);

const HIGHLIGHTED_LINE_WIDTH = 2;
const NORMAL_LINE_WIDTH = 1;
const NUM_DAYS_TO_USE_DAY_TIMEFRAME = 2;

export default class MarketOutcomesChartHighchart extends Component {
  static propTypes = {
    maxPrice: PropTypes.number.isRequired,
    minPrice: PropTypes.number.isRequired,
    bucketedPriceTimeSeries: PropTypes.object.isRequired,
    isScalar: PropTypes.bool,
    scalarDenomination: PropTypes.string,
    selectedOutcome: PropTypes.string.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    daysPassed: PropTypes.number
  };

  static defaultProps = {
    isScalar: false,
    daysPassed: 0,
    scalarDenomination: ""
  };

  constructor(props) {
    super(props);
    this.ethLabel = null;
    this.state = {
      containerHeight: 0,
      containerWidth: 0,
      options: {
        title: {
          text: "",
          y: 5
        },
        lang: {
          noData: "No Completed Trades"
        },
        chart: {
          type: "line",
          styledMode: false,
          animation: false,
          marginTop: 40,
          events: {
            load() {
              const { width } = this.renderer;
              this.ethLabel = this.renderer.label("ETH", width - 35, 0).add();
            },
            redraw() {
              const { width } = this.renderer;
              this.ethLabel.destroy();
              this.ethLabel = this.renderer.label("ETH", width - 35, 0).add();
            }
          }
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          area: {
            threshold: null
          },
          line: {
            dataGrouping: {
              forced: true,
              units: [["day", [1]]]
            }
          },
          series: {
            marker: {
              enabled: true
            }
          }
        },
        scrollbar: { enabled: false },
        navigator: { enabled: false },
        xAxis: {
          ordinal: false,
          showFirstLabel: true,
          showLastLabel: true,
          labels: {
            format: "{value:%b %d}"
          },
          crosshair: {
            snap: true,
            label: {
              enabled: true,
              format: "{value:%b %d}"
            }
          }
        },
        yAxis: {
          showEmpty: true,
          opposite: true,
          max: createBigNumber(props.maxPrice).toFixed(props.pricePrecision),
          min: createBigNumber(props.minPrice).toFixed(props.pricePrecision),
          showFirstLabel: true,
          showLastLabel: true,
          labels: {
            format: "{value:.4f}",
            style: Styles.MarketOutcomeChartsHighcharts__yLabels,
            x: 0,
            y: -2
          },
          title: {
            text: ""
          },
          height: "100%",
          resize: {
            enabled: true
          },
          crosshair: {
            snap: true,
            label: {
              enabled: true,
              format: "{value:.4f} <span class='eth-label'>ETH</span>"
            }
          }
        },
        tooltip: { enabled: false },
        rangeSelector: {
          enabled: false
        }
      }
    };
    this.buidOptions = this.buidOptions.bind(this);
  }

  componentDidMount() {
    const { bucketedPriceTimeSeries, selectedOutcome, daysPassed } = this.props;
    const { containerHeight } = this.state;
    this.buidOptions(
      daysPassed,
      bucketedPriceTimeSeries,
      selectedOutcome,
      containerHeight
    );
  }

  componentWillUpdate(nextProps) {
    if (
      !isEqual(
        this.props.bucketedPriceTimeSeries,
        nextProps.bucketedPriceTimeSeries
      ) ||
      !isEqual(this.props.daysPassed, nextProps.daysPassed) ||
      !isEqual(this.props.selectedOutcome, nextProps.selectedOutcome) ||
      !isEqual(this.state.containerHeight, this.container.clientHeight) ||
      !isEqual(this.state.containerWidth, this.container.clientWidth)
    ) {
      this.onResize();
      this.buidOptions(
        nextProps.daysPassed,
        nextProps.bucketedPriceTimeSeries,
        nextProps.selectedOutcome
      );
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  onResize = () => {
    if (
      this.container.clientHeight !== this.state.containerHeight ||
      this.container.clientWidth !== this.state.containerWidth
    ) {
      this.setState({
        containerHeight: this.container.clientHeight,
        containerWidth: this.container.clientWidth
      });

      const {
        bucketedPriceTimeSeries,
        selectedOutcome,
        daysPassed
      } = this.props;
      this.buidOptions(daysPassed, bucketedPriceTimeSeries, selectedOutcome);
    }
  };

  getxAxisProperties = (daysPassed, useTickInterval) => {
    const hours = "{value:%H:%M}";
    const days = "{value:%b %d}";
    const mmSecondsInHour = createBigNumber(3600 * 1000);
    const mmSecondsInDay = createBigNumber(24).times(mmSecondsInHour);
    const mmSecondsInWeek = createBigNumber(7).times(mmSecondsInDay);
    let interval = daysPassed <= 7 ? mmSecondsInHour : mmSecondsInDay;
    interval = daysPassed >= 60 ? mmSecondsInWeek : interval;

    return {
      tickInterval: useTickInterval ? interval.toNumber() : 0,
      labels: {
        format: interval.isEqualTo(mmSecondsInHour) ? hours : days,
        style: {
          color: "#ffffff" // remove this when adding custom css and turning on styleMode
        }
      },
      crosshair: {
        snap: true,
        label: {
          enabled: true
        }
      }
    };
  };

  buidOptions(daysPassed, bucketedPriceTimeSeries, selectedOutcome) {
    const { options } = this.state;
    const { isScalar, scalarDenomination } = this.props;
    const { priceTimeSeries } = bucketedPriceTimeSeries;

    const highestLength = Object.keys(priceTimeSeries).reduce(
      (p, id) =>
        priceTimeSeries[id].length > p ? priceTimeSeries[id].length : p,
      0
    );
    const timeIncrement =
      daysPassed > NUM_DAYS_TO_USE_DAY_TIMEFRAME ? "day" : "hour";

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
      height: this.container.clientHeight - 10, // need margin as to not perma grow container
      width: this.container.clientWidth - 10
    };

    const useArea =
      priceTimeSeries && Object.keys(priceTimeSeries).length === 1;
    const hasData =
      priceTimeSeries &&
      Object.keys(priceTimeSeries) &&
      Object.keys(priceTimeSeries).filter(
        key => priceTimeSeries[key].length > 0
      ).length;

    const series = [];
    Object.keys(priceTimeSeries).forEach(id => {
      series.push({
        type: useArea ? "area" : "line",
        lineWidth:
          selectedOutcome && selectedOutcome === id.toString()
            ? HIGHLIGHTED_LINE_WIDTH
            : NORMAL_LINE_WIDTH,
        data: priceTimeSeries[id].map(pts => [
          pts.timestamp,
          createBigNumber(pts.price).toNumber()
        ])
      });
    });

    if (isScalar && hasData) {
      options.title.text = scalarDenomination;
    }
    options.plotOptions.line.dataGrouping = {
      ...options.plotOptions.line.dataGrouping,
      forced: true,
      units: [[timeIncrement, [1]]]
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
