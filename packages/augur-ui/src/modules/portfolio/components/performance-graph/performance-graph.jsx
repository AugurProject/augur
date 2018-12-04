import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

import Dropdown from "modules/common/components/dropdown/dropdown";
import { formatEther } from "utils/format-number";
import Styles from "modules/portfolio/components/performance-graph/performance-graph.styles";

class PerformanceGraph extends Component {
  static propTypes = {
    universe: PropTypes.string.isRequired,
    currentAugurTimestamp: PropTypes.number.isRequired,
    getProfitLoss: PropTypes.func.isRequired,
    isAnimating: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.periodIntervals = {
      HOUR: 3600,
      HALF_DAY: 43200,
      DAY: 86400,
      WEEK: 604800,
      MONTH: 2592000,
      YEAR: 39030400
    };
    const { currentAugurTimestamp } = props;
    this.timeFrames = {
      DAY: currentAugurTimestamp - this.periodIntervals.DAY,
      WEEK: currentAugurTimestamp - this.periodIntervals.WEEK,
      MONTH: currentAugurTimestamp - this.periodIntervals.MONTH,
      ALL: 0
    };

    this.state = {
      graphType: "total",
      graphTypeOptions: [
        { label: "Total", value: "total" },
        { label: "Total Realized", value: "realized" },
        { label: "Total Unrealized", value: "unrealized" }
      ],
      graphTypeDefault: "total",
      graphPeriod: "DAY",
      graphPeriodOptions: [
        { label: "Past 24hrs", value: "DAY", format: "%a %d %I:%M %p" },
        { label: "Past Week", value: "WEEK", format: "%a %d %I:%M %p" },
        { label: "Past Month", value: "MONTH", format: "%m/%d %I:%M %p" },
        { label: "All", value: "ALL", format: "%x %I:%M %p" }
      ],
      graphPeriodDefault: "DAY",
      startTime: this.timeFrames.DAY,
      endTime: currentAugurTimestamp,
      selectedSeriesData: [],
      performanceData: []
    };
    this.textWidth = 3.75;
    this.margin = { top: 10, right: 10, bottom: 20, left: 60 };

    this.changeDropdown = this.changeDropdown.bind(this);
    this.updateChart = this.updateChart.bind(this);
    this.updatePerformanceData = this.updatePerformanceData.bind(this);
    this.parsePerformanceData = this.parsePerformanceData.bind(this);
    this.chartSetup = this.chartSetup.bind(this);
    this.chartFullRefresh = this.chartFullRefresh.bind(this);
  }

  componentDidMount() {
    this.chartFullRefresh(true);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.graphPeriod !== this.state.graphPeriod) {
      this.updatePerformanceData();
    } else if (prevState.graphType !== this.state.graphType) {
      // update chart based on data we have in state, no fetch
      this.parsePerformanceData();
    } else if (
      prevProps.isAnimating !== this.props.isAnimating &&
      this.state.selectedSeriesData[0]
    ) {
      this.updateChart();
    }
  }

  chartFullRefresh(forceUpdate = false) {
    this.chartSetup(() => {
      if (forceUpdate && this.componentWrapper) this.updatePerformanceData();
    });
  }

  chartSetup(callback = () => {}) {
    if (!this.chart)
      this.chart = d3
        .select(this.drawContainer)
        .append("svg")
        .attr("id", "performance_chart")
        .attr("height", 240)
        .attr("width", "100%");

    callback();
  }

  changeDropdown(value) {
    let { graphType, graphPeriod, startTime } = this.state;

    this.state.graphTypeOptions.forEach((type, ind) => {
      if (type.value === value) {
        graphType = value;
      }
    });

    this.state.graphPeriodOptions.forEach((period, ind) => {
      if (period.value === value) {
        graphPeriod = value;
      }
    });

    if (graphPeriod !== this.state.graphPeriod) {
      startTime = this.timeFrames[graphPeriod];
    }

    if (this.componentWrapper)
      this.setState({ graphType, graphPeriod, startTime });
  }

  parsePerformanceData() {
    const { performanceData, graphType } = this.state;
    const selectedSeriesData = [
      {
        name: graphType,
        color: "#553580"
      }
    ];
    const seriesData = [];
    performanceData.forEach((object, index) => {
      const plotPoint = [];
      const { profitLoss } = object;
      plotPoint.push(object.timestamp * 1000);
      if (profitLoss && profitLoss[graphType]) {
        plotPoint.push(formatEther(profitLoss[graphType]).formattedValue);
      } else {
        plotPoint.push(0);
      }
      seriesData.push(plotPoint);
    });
    selectedSeriesData[0].data = seriesData;
    if (this.componentWrapper)
      this.setState({ selectedSeriesData }, () => {
        if (this.componentWrapper) this.updateChart();
      });
  }

  updatePerformanceData() {
    const { universe, getProfitLoss } = this.props;
    const { startTime, endTime } = this.state;

    getProfitLoss(
      universe,
      startTime,
      endTime,
      null,
      (err, rawPerformanceData) => {
        if (err) return console.error(err);
        // make the first entry into the data a 0 value to make sure we start from 0 PL
        const { aggregate } = rawPerformanceData;
        const interval = aggregate[1].timestamp - aggregate[0].timestamp;
        let performanceData = [
          {
            timestamp: aggregate[0].timestamp - interval,
            profitLoss: { unrealized: "0", realized: "0", total: "0" }
          }
        ];
        performanceData = performanceData.concat(aggregate);
        if (this.componentWrapper)
          this.setState({ performanceData }, () => {
            if (this.componentWrapper) this.parsePerformanceData();
          });
      }
    );
  }

  updateChart() {
    const { selectedSeriesData, graphPeriod, graphPeriodOptions } = this.state;
    const { margin } = this;
    const timeFormat = graphPeriodOptions.reduce((a, e) => {
      let newFormat = a;
      if (e.value === graphPeriod) newFormat = e.format;
      return newFormat;
    }, "");
    // first remove all drawn lines in SVG to switch the chart info
    d3.select(this.drawContainer)
      .select("svg")
      .selectAll("*")
      .remove();

    const chartHeight = this.drawContainer.clientHeight;
    const chartWidth = this.drawContainer.clientWidth;

    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const dateFormat = d3.timeFormat(timeFormat);

    const chart = d3
      .select("#performance_chart")
      .append("g")
      .attr("id", "performance_chart_canvas")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    // this.margin = { top: 10, right: 10, bottom: 20, left: 60 };
    console.log("cwh/wh:", chartWidth, chartHeight, width, height);
    const x = d3.scaleTime().rangeRound([0, width]);
    const y = d3
      .scaleLinear()
      .clamp(true)
      .range([height, 0]);
    const line = d3
      .line()
      .x(d => x(d[0]))
      .y(d => y(d[1]));
    const yDomainBounds = selectedSeriesData[0].data.reduce(
      (a, e) => {
        const newA = a;
        if (newA.low > e[1]) {
          newA.low = e[1];
        }
        if (newA.high < e[1]) {
          newA.high = e[1];
        }
        return newA;
      },
      {
        low: 0,
        high: 0
      }
    );
    yDomainBounds.range = yDomainBounds.high - yDomainBounds.low;
    yDomainBounds.buffer =
      yDomainBounds.range !== 0 ? yDomainBounds.range * 0.05 : 1;
    yDomainBounds.calcedHigh = yDomainBounds.high + yDomainBounds.buffer;
    yDomainBounds.calcedLow = yDomainBounds.low - yDomainBounds.buffer;

    const yDomainData = [[0, yDomainBounds.calcedLow]]
      .concat(selectedSeriesData[0].data)
      .concat([[0, yDomainBounds.calcedHigh]]);
    x.domain(d3.extent(selectedSeriesData[0].data, d => d[0]));
    y.domain(d3.extent(yDomainData, d => d[1]));
    // x axis
    chart
      .append("g")
      .attr("fill", "#fff")
      .attr("stroke", "#fff")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(dateFormat))
      .attr("stroke", "#fff")
      .select(".domain")
      .attr("stroke", "#fff");
    // y axis
    chart
      .append("g")
      .attr("stroke", "#fff")
      .call(
        d3.axisLeft(y).tickFormat(v => `${formatEther(v).formattedValue} ETH`)
      )
      .attr("stroke", "#fff")
      .select(".domain")
      .attr("stroke", "#fff")
      .append("text")
      .attr("fill", "#fff")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("ETH");

    chart
      .append("path")
      .datum(selectedSeriesData[0].data)
      .attr("fill", "none")
      .attr("stroke", `${selectedSeriesData[0].color}`)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", line);
    chart
      .selectAll("g")
      .selectAll(".tick line")
      .attr("stroke", "#fff");

    const focus = this.chart
      .append("g")
      .attr("stroke", "#fff")
      .attr("color", "#fff")
      .attr("fill", "#fff")
      .style("display", "none");

    focus.append("circle").attr("r", 4.5);
    focus.append("text").attr("id", "crosshair_text_eth");
    focus.append("text").attr("id", "crosshair_text_date");

    this.chart
      .append("rect")
      .attr("id", "performance_chart_overlay")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", chartWidth - margin.left)
      .attr("height", height)
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", mousemove);

    function mousemove() {
      const { data } = selectedSeriesData[0];
      const v2 = x.invert(d3.mouse(this)[0]);
      const biSect = d3.bisector(d => d[0]).left;
      let i = biSect(data, v2, 0);
      if (i === data.length) i -= 1;
      const actualWidth = d3.select("#performance_chart").node().clientWidth;
      const widthThreshold = actualWidth * 0.9;
      const actualHeight = d3.select("#performance_chart").node().clientHeight;
      const heightThreshold = (actualHeight - margin.top) * 0.8;

      const tests = [
        x(data[i][0]) + margin.left > widthThreshold,
        y(data[i][1]) - margin.top > heightThreshold
      ];
      focus.attr(
        "transform",
        `translate(${x(data[i][0]) + margin.left},${y(data[i][1]) +
          margin.top})`
      );
      d3.select("#crosshair_text_eth").text(
        `${formatEther(data[i][1]).formatted} ETH`
      );
      d3.select("#crosshair_text_date").text(`${dateFormat(v2)}`);
      let ethWidth = d3.select("#crosshair_text_eth").node().clientWidth;
      let dateWidth = d3.select("#crosshair_text_date").node().clientWidth;
      if (ethWidth === 0 && tests[0]) {
        focus.style("display", "none");
        focus.selectAll("text").attr("x", "1rem");
        ethWidth = d3.select("#crosshair_text_eth").node().clientWidth;
        dateWidth = d3.select("#crosshair_text_date").node().clientWidth;
        focus.style("display", null);
      }
      const ethTextDY = tests[1] ? "-0.5rem" : "1.2rem";
      const dateTextDY = tests[1] ? "-1.5rem" : "2.5rem";

      if (!tests[0]) {
        focus.selectAll("text").attr("x", "1rem");
      } else {
        focus
          .select("#crosshair_text_eth")
          .attr("x", `${(ethWidth - 24) * -1}px`);
        focus
          .select("#crosshair_text_date")
          .attr("x", `${(dateWidth - 24) * -1}px`);
      }
      focus.select("#crosshair_text_eth").attr("dy", `${ethTextDY}`);
      focus.select("#crosshair_text_date").attr("dy", `${dateTextDY}`);
    }
  }

  render() {
    const s = this.state;

    return (
      <section
        className={Styles.PerformanceGraph}
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <div className={Styles.PerformanceGraph__SortBar}>
          <div className={Styles["PerformanceGraph__SortBar-title"]}>
            Profits/losses
          </div>
          <div className={Styles["PerformanceGraph__SortBar-dropdowns"]}>
            <Dropdown
              default={s.graphTypeDefault}
              options={s.graphTypeOptions}
              onChange={this.changeDropdown}
            />
            <Dropdown
              default={s.graphPeriodDefault}
              options={s.graphPeriodOptions}
              onChange={this.changeDropdown}
            />
          </div>
        </div>
        <div
          className={Styles.PerformanceGraph__drawContainer}
          id="performance_graph_chart"
          ref={drawContainer => {
            this.drawContainer = drawContainer;
          }}
        />
      </section>
    );
  }
}

export default PerformanceGraph;
