import React, { useEffect, useState, useMemo, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { createBigNumber } from 'utils/create-big-number';
import Styles from 'modules/common/charts.styles.less';
import classNames from 'classnames';
import { formatDai } from 'utils/format-number';
import { Checkbox } from 'modules/common/icons';

const HIGHLIGHTED_LINE_WIDTH = 2;
const NORMAL_LINE_WIDTH = 1;
const DEFAULT_SELECTED_ID = 1;
const ONE_HOUR_MS = 3600 * 1000;
const ONE_WEEK_MS = 24 * ONE_HOUR_MS * 7;
const DATE = new Date();
const END_TIME = DATE.getTime();
const START_TIME = END_TIME - ONE_WEEK_MS;
const MOCK_WEEK_IN_HOURS = (END_TIME - START_TIME) / ONE_HOUR_MS;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
interface HighcartsChart extends Highcharts.Chart {
  renderTo?: string | Element | React.ReactNode;
}

const getMockPriceTime = (market) => ({
  priceTimeArray: market.outcomes.map((outcome) => {
    const outcomePriceTime = [];
    let lastPrice = createBigNumber(outcome.lastPrice);
    let curTimestamp = END_TIME;
    while (outcomePriceTime.length < MOCK_WEEK_IN_HOURS) {
      const rand = getRandomInt(5);
      let priceVariance = getRandomInt(rand) * 0.1;
      let nextPrice = Boolean(Math.round(Math.random()))
        ? lastPrice.plus(priceVariance)
        : lastPrice.minus(priceVariance);
      if (nextPrice.gt(market.maxPriceBigNumber)) {
        nextPrice = market.maxPriceBigNumber;
      } else if (nextPrice.lt(market.minPriceBigNumber)) {
        nextPrice = market.minPriceBigNumber;
      }
      outcomePriceTime.push({
        price: nextPrice.toFixed(2),
        amount: 100,
        timestamp: curTimestamp,
        logIndex: 0,
      });
      curTimestamp = curTimestamp - ONE_HOUR_MS;
      lastPrice = nextPrice;
    }
    return outcomePriceTime;
  }),
});

export const PriceHistoryChart = ({ market, selectedOutcomes }) => {
  const container = useRef(null);
  // eslint-disable-next-line
  const [forceRender, setForceRender] = useState(false);
  const { maxPriceBigNumber: maxPrice, minPriceBigNumber: minPrice } = market;
  // const { priceTimeArray } = useMemo(() => getMockPriceTime(market), [market]);
  const { priceTimeArray } = getMockPriceTime(market);
  const options = useMemo(
    () =>
      getOptions({
        maxPrice,
        minPrice,
      }),
    [maxPrice, minPrice]
  );

  useMemo(() => {
    const chartContainer = container.current;
    if (chartContainer) {
      const chart: HighcartsChart = Highcharts.charts.find(
        (chart: HighcartsChart) => chart?.renderTo === chartContainer
      );
      const series =
        priceTimeArray.length === 0
          ? []
          : handleSeries(priceTimeArray, selectedOutcomes);
      if (!chart || chart?.renderTo !== chartContainer) {
        // @ts-ignore
        Highcharts.stockChart(chartContainer, { ...options, series });
      } else {
        series?.forEach((seriesObj, index) => {
          if (chart.series[index]) {
            chart.series[index].update(seriesObj, false);
          } else {
            chart.addSeries(seriesObj, false);
          }
        });
        chart.redraw();
      }
    }
    // eslint-disable-next-line
  }, [selectedOutcomes, options, priceTimeArray]);

  useEffect(() => {
    const chartContainer = container.current;
    NoDataToDisplay(Highcharts);
    const chart: HighcartsChart = Highcharts.charts.find(
      (chart: HighcartsChart) => chart?.renderTo === chartContainer
    );
    if (!chart || chart?.renderTo !== chartContainer) {
      // needs to be done because container ref is null on first load.
      setForceRender(true);
    }
    return () => {
      Highcharts.charts
        .find((chart: HighcartsChart) => chart?.renderTo === chartContainer)
        ?.destroy();
    };
  }, []);

  return <section className={Styles.PriceHistoryChart} ref={container} />;
};

export const SelectOutcomeButton = ({
  outcome,
  toggleSelected,
  isSelected,
}) => {
  return (
    <button
      className={classNames(Styles.SelectOutcomeButton, {
        [Styles.isSelected]: isSelected,
      })}
    >
      <span>{Checkbox}</span>
      {outcome.label}{' '}
      <b>{formatDai(createBigNumber(outcome.lastPrice)).full}</b>
    </button>
  );
};

export const SimpleChartSection = ({ market }) => {
  // eslint-disable-next-line
  const [selectedOutcomes, setSelectedOutcomes] = useState(
    market.outcomes.map((outcome) =>
      Boolean(outcome.id === DEFAULT_SELECTED_ID)
    )
  );

  const toggleOutcome = (id) => {
    const updates = selectedOutcomes;
    updates[id] = !updates[id];
    setSelectedOutcomes(updates);
  };

  return (
    <section className={Styles.SimpleChartSection}>
      <PriceHistoryChart market={market} selectedOutcomes={selectedOutcomes} />
      <ul>
        {market.outcomes.map((outcome) => (
          <li key={`${outcome.id}_${outcome.value}`}>
            <SelectOutcomeButton
              outcome={outcome}
              toggleSelected={toggleOutcome}
              isSelected={selectedOutcomes[outcome.id]}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SimpleChartSection;

// helper functions:
const handleSeries = (
  priceTimeArray,
  selectedOutcomes,
  mostRecentTradetime = 0
) => {
  const series = [];
  priceTimeArray.forEach((priceTimeData, index) => {
    const length = priceTimeData.length;
    const isSelected = selectedOutcomes[index];
    if (
      length > 0 &&
      priceTimeData[length - 1].timestamp > mostRecentTradetime
    ) {
      mostRecentTradetime = priceTimeData[length - 1].timestamp;
    }
    const data = priceTimeData.map((pts) => [
      pts.timestamp,
      createBigNumber(pts.price).toNumber(),
    ]);
    const baseSeriesOptions = {
      type: isSelected ? 'area' : 'line',
      lineWidth: isSelected ? HIGHLIGHTED_LINE_WIDTH : NORMAL_LINE_WIDTH,
      marker: {
        symbol: 'cicle',
      },
      fillColor: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: [
          [
            0,
            index === 1 ? 'rgba(5, 177, 105, 0.15)' : 'rgba(216, 17, 89, 0.15)',
          ], // start
          [1, '#F6F7F8'], // end
        ],
      },
      // @ts-ignore
      data,
      visible: isSelected,
    };

    series.push({ ...baseSeriesOptions });
  });
  series.forEach((seriesObject) => {
    const seriesData = seriesObject.data;
    // make sure we have a trade to fill chart
    if (
      seriesData.length > 0 &&
      seriesData[seriesData.length - 1][0] !== mostRecentTradetime
    ) {
      const mostRecentTrade = seriesData[seriesData.length - 1];
      seriesObject.data.push([mostRecentTradetime, mostRecentTrade[1]]);
    }
    seriesObject.data.sort((a, b) => a[0] - b[0]);
  });
  return series;
};

const getOptions = ({ maxPrice, minPrice }) => ({
  lang: {
    noData: 'Loading...',
  },
  title: {
    text: '',
  },
  chart: {
    backgroundColor: 'transparent',
    type: 'line',
    styledMode: false,
    animation: false,
    reflow: true,
    marginTop: 0,
    spacing: [20, 20, 20, 20],
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
        // units: [['minute', [1]]],
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
    showFirstLabel: false,
    showLastLabel: false,
    tickLength: 0,
    gridLineWidth: 0,
    gridLineColor: null,
    lineWidth: 0,
    labels: false,
    crosshair: {
      snap: true,
      label: {
        enabled: true,
        shape: 'square',
        padding: 2,
        format: '{value:%b %d %l:%M %p}',
      },
    },
  },
  yAxis: {
    showEmpty: true,
    opposite: false,
    max: maxPrice.toFixed(2),
    min: minPrice.toFixed(2),
    showFirstLabel: true,
    showLastLabel: true,
    gridLineWidth: 0,
    gridLineColor: null,
    offset: 2,
    labels: false,
    crosshair: {
      snap: true,
      label: {
        padding: 2,
        enabled: true,
        style: {},
        borderRadius: 5,
        shape: 'square',
        // eslint-disable-next-line
        format: '${value:.2f}',
      },
    },
  },
  tooltip: { enabled: false },
  rangeSelector: {
    enabled: false,
  },
});
