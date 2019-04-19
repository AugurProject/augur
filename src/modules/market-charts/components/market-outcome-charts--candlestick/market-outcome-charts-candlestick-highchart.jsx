import React, { Component } from "react";
import PropTypes from "prop-types";
import { createBigNumber } from "utils/create-big-number";
import CustomPropTypes from "utils/custom-prop-types";
import Highcharts from "highcharts/highstock";
import NoDataToDisplay from "highcharts/modules/no-data-to-display";
import Styles from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts-candlestick-highchart.styles";
import { each, isEqual, cloneDeep } from "lodash";
import { PERIOD_RANGES, ETH } from "modules/common-elements/constants";

NoDataToDisplay(Highcharts);

const ShowNavigator = 350;

export default class MarketOutcomeChartsCandlestickHighchart extends Component {
  static propTypes = {
    priceTimeSeries: PropTypes.array.isRequired,
    selectedPeriod: PropTypes.number.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    updateHoveredPeriod: PropTypes.func.isRequired,
    marketMax: CustomPropTypes.bigNumber.isRequired,
    marketMin: CustomPropTypes.bigNumber.isRequired,
    volumeType: PropTypes.string.isRequired,
    containerHeight: PropTypes.number.isRequired,
    currentTimeInSeconds: PropTypes.number.isRequired,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    isMobile: false
  };

  constructor(props) {
    super(props);
    this.state = {
      options: {
        title: {
          text: ""
        },
        lang: {
          noData: "No Completed Trades"
        },
        plotOptions: {
          series: {
            point: {
              events: {
                mouseOver: evt => this.displayCandleInfoAndPlotViz(evt),
                mouseOut: evt => this.clearCandleInfoAndPlotViz(evt)
              }
            }
          }
        },
        chart: {
          type: "candlestick",
          panning: props.isMobile,
          styledMode: false,
          animation: false,
          marginTop: props.isMobile ? 30 : 40,
          marginBottom: 0,
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
        height: props.containerHeight,
        scrollbar: { enabled: false },
        navigator: { enabled: true, margin: 40 },
        xAxis: {
          ordinal: false,
          labels: {
            format: "{value:%b %d}",
            align: "center",
            reserveSpace: true
          },
          range: 24 * 3600 * 1000, // day
          crosshair: {
            width: 0,
            snap: true,
            label: {
              enabled: true,
              format: "{value:%b %d, %H:%M}",
              align: "center",
              y: 0,
              x: 0
            }
          },
          plotBands: []
        },
        yAxis: [
          {
            showEmpty: true,
            max: props.marketMax.toFixed(props.pricePrecision),
            min: props.marketMin.toFixed(props.pricePrecision),
            tickInterval: props.isMobile
              ? props.marketMax
                  .minus(props.marketMin)
                  .dividedBy(2)
                  .toNumber()
              : undefined,
            showFirstLabel: true,
            showLastLabel: true,
            labels: {
              format: "{value:.4f}",
              style: Styles.MarketOutcomeCharts__highcharts_display_yLables,
              align: "center",
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
              snap: false,
              label: {
                enabled: true,
                format: "{value:.4f} <span class='eth-label'>ETH</span>"
              }
            }
          },
          {
            min: 0,
            top: "85%",
            height: "15%",
            opposite: true,
            className: Styles.MarketOutcomeCharts__highcharts_display_none,
            labels: {
              enabled: false
            }
          }
        ],
        tooltip: { enabled: false },
        rangeSelector: {
          enabled: false
        }
      }
    };
    this.buidOptions = this.buidOptions.bind(this);
    this.displayCandleInfoAndPlotViz = this.displayCandleInfoAndPlotViz.bind(
      this
    );
    this.clearCandleInfoAndPlotViz = this.clearCandleInfoAndPlotViz.bind(this);
  }

  componentDidMount() {
    const {
      priceTimeSeries,
      selectedPeriod,
      volumeType,
      containerHeight
    } = this.props;
    this.buidOptions(
      priceTimeSeries,
      selectedPeriod,
      volumeType,
      containerHeight,
      options => {
        this.chart = Highcharts.stockChart(this.container, options);
      }
    );
  }

  componentWillUpdate(nextProps) {
    if (
      !isEqual(this.props.priceTimeSeries, nextProps.priceTimeSeries) ||
      !isEqual(this.props.selectedPeriod, nextProps.selectedPeriod) ||
      !isEqual(this.props.volumeType, nextProps.volumeType) ||
      !isEqual(this.props.containerHeight, nextProps.containerHeight)
    ) {
      this.buidOptions(
        nextProps.priceTimeSeries,
        nextProps.selectedPeriod,
        nextProps.volumeType,
        nextProps.containerHeight
      );
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  displayCandleInfoAndPlotViz(evt) {
    const { updateHoveredPeriod, priceTimeSeries, volumeType } = this.props;
    const { x: timestamp, open, close, high, low } = evt.target;
    const xRangeTo = this.chart.xAxis[0].toValue(20, true);
    const xRangeFrom = this.chart.xAxis[0].toValue(0, true);
    const range = Math.abs((xRangeFrom - xRangeTo) * 0.6);
    const pts = priceTimeSeries.find(p => p.period === timestamp);

    updateHoveredPeriod({
      open: open ? createBigNumber(open) : "",
      close: close ? createBigNumber(close) : "",
      high: high ? createBigNumber(high) : "",
      low: low ? createBigNumber(low) : "",
      volume: pts
        ? createBigNumber(volumeType === ETH ? pts.volume : pts.shareVolume)
        : ""
    });

    const plotBand = {
      id: "new-plot-band",
      from: timestamp - range,
      to: timestamp + range
    };

    this.chart.xAxis[0].addPlotBand(plotBand);
    this.updateVolumeBar(true, timestamp);
  }

  clearCandleInfoAndPlotViz(evt) {
    const { updateHoveredPeriod } = this.props;
    const { x: timestamp } = evt.target;

    updateHoveredPeriod({
      open: "",
      close: "",
      high: "",
      low: "",
      volume: ""
    });

    this.chart.xAxis[0].removePlotBand("new-plot-band");
    this.updateVolumeBar(false, timestamp);
  }

  updateVolumeBar(isHover, timestamp) {
    const bar = this.chart.yAxis[1].series[0].data.find(
      d => d && d.x === timestamp
    );
    if (bar) {
      const currentColor = bar.color;
      const color = isHover ? "#665789" : "#161022";
      if (currentColor !== color) {
        bar.update({
          color
        });
      }
    }
  }

  buidOptions(
    priceTimeSeries,
    selectedPeriod,
    volumeType,
    containerHeight,
    callback
  ) {
    const { currentTimeInSeconds } = this.props;
    const { options } = this.state;
    const groupingUnits = [
      ["minute", [1]],
      ["hour", [1]],
      ["day", [1]],
      ["week", [1]],
      ["month", [1]],
      ["year", [1]]
    ];
    const ohlc = [];
    const volume = [];
    each(priceTimeSeries, item => {
      const { period } = item;
      ohlc.push([period, item.open, item.high, item.low, item.close]);
      volume.push([
        period,
        volumeType === ETH ? item.volume : item.shareVolume
      ]);
    });

    // add buffer so candlesticks aren't stuck to beginning of chart
    if (priceTimeSeries.length > 0) {
      volume.push([currentTimeInSeconds * 1000, 0]);
    }

    options.height = containerHeight;
    if (containerHeight > 0) {
      options.navigator.enabled = containerHeight > ShowNavigator;
    }

    const { range, format, step, crosshair } = PERIOD_RANGES[selectedPeriod];
    options.xAxis.labels = {
      ...options.xAxis.labels,
      format,
      step
    };

    if (options.xAxis.length > 0) {
      options.xAxis[0].crosshair.label = {
        ...options.xAxis[0].crosshair.label,
        format: crosshair
      };
    }

    const newOptions = Object.assign(options, {
      series: [
        {
          type: "candlestick",
          name: "ohlc",
          data: ohlc,
          yAxis: 0,
          dataGrouping: {
            units: groupingUnits
          },
          maxPointWidth: 20,
          minPointWidth: 10,
          range
        },
        {
          type: "column",
          name: "volume",
          color: "#161022",
          data: volume,
          yAxis: 1,
          dataGrouping: {
            units: groupingUnits
          },
          maxPointWidth: 20,
          minPointWidth: 10,
          range
        }
      ]
    });

    const updatedObjects = cloneDeep(newOptions);
    this.setState({ options: updatedObjects });
    if (this.chart) {
      this.chart.update(updatedObjects);
    }
    if (callback) callback(updatedObjects);
  }

  render() {
    return (
      <div
        className={Styles.MarketOutcomeChartsCandlestickHighcharts}
        ref={container => {
          this.container = container;
        }}
      />
    );
  }
}
