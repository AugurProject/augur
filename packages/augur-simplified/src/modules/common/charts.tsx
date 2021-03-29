import React, { useEffect, useState, useMemo, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from './charts.styles.less';
import classNames from 'classnames';
import { MarketInfo } from '../types';
import {
  createBigNumber,
  Formatter,
  Icons,
  SelectionComps,
} from '@augurproject/augur-comps';

const { MultiButtonSelection } = SelectionComps;
const { formatCashPrice } = Formatter;
const { Checkbox } = Icons;

const HIGHLIGHTED_LINE_WIDTH = 2;
const NORMAL_LINE_WIDTH = 2;
const DEFAULT_SELECTED_ID = 2;
const ONE_MIN_MS = 60000;
const FIFTEEN_MIN_MS = 900000;
const ONE_HOUR_MS = 3600 * 1000;
const ONE_QUARTER_DAY = ONE_HOUR_MS * 6;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;
const ONE_WEEK_MS = ONE_DAY_MS * 7;
const ONE_MONTH_MS = ONE_DAY_MS * 30;
const DATE = new Date();
const END_TIME = DATE.getTime();

const RANGE_OPTIONS = [
  {
    id: 0,
    label: '24hr',
    tick: FIFTEEN_MIN_MS,
    startTime: END_TIME - ONE_DAY_MS,
  },
  {
    id: 1,
    label: '7d',
    tick: ONE_HOUR_MS,
    startTime: END_TIME - ONE_WEEK_MS,
  },
  {
    id: 2,
    label: '30d',
    tick: ONE_QUARTER_DAY,
    startTime: END_TIME - ONE_MONTH_MS,
  },
  {
    id: 3,
    label: 'All time',
    tick: ONE_DAY_MS,
    startTime: END_TIME - ONE_MONTH_MS * 6,
  },
];

const SERIES_COLORS = [
  '#58586B',
  '#FF7D5E',
  '#05B169',
  '#73D2DE',
  '#218380',
  '#FFBC42',
  '#D81159',
  '#1F71B5',
];
const SERIES_GRADIENTS = [
  [
    [0, 'rgba(88, 88, 107, .15)'],
    [1, 'rgba(88, 88, 107, 0)'],
  ],
  [
    [0, 'rgba(255, 125, 94, .15)'],
    [1, 'rgba(255, 125, 94, 0)'],
  ],
  [
    [0, 'rgba(5, 177, 105, .15)'],
    [1, 'rgba(5, 177, 105, 0)'],
  ],
  [
    [0, 'rgba(​115, ​210, ​222, 0.15)'],
    [1, 'rgba(​115, ​210, ​222, 0)'],
  ],
  [
    [0, 'rgba(​33, ​131, 128, 0.15)'],
    [1, 'rgba(​33, ​131, 128, 0)'],
  ],
  [
    [0, 'rgba(​255, ​188, ​66, 0.15)'],
    [1, 'rgba(​255, ​188, ​66, 0)'],
  ],
  [
    [0, 'rgba(​216, 17, 89, 0.15)'],
    [1, 'rgba(​216, 17, 89, 0)'],
  ],
  [
    [0, 'rgba(​31, 113, ​181, 0.15)'],
    [1, 'rgba(​31, 113, ​181, 0)'],
  ],
];

interface HighcartsChart extends Highcharts.Chart {
  renderTo?: string | Element | React.ReactNode;
}

const calculateRangeSelection = (rangeSelection, market) => {
  const marketStart = market.creationTimestamp * 1000;
  let { startTime, tick } = RANGE_OPTIONS[rangeSelection];
  if (rangeSelection === 3) {
    // allTime:
    const timespan = (END_TIME - marketStart);
    const numHoursRd = Math.round(timespan / ONE_HOUR_MS);
    tick = ONE_MIN_MS;
    if (numHoursRd <= 12) {
      tick = ONE_MIN_MS * 5;
    } else if (numHoursRd <= 24) {
      tick = ONE_MIN_MS * 10;
    } else if (numHoursRd <= 48) {
      tick = FIFTEEN_MIN_MS;
    } else if (numHoursRd <= (24 * 7)) {
      tick = ONE_HOUR_MS;
    } else if (numHoursRd <= (24 * 30)) {
      tick = ONE_QUARTER_DAY;
    } else {
      tick = ONE_DAY_MS;
    }
    startTime = marketStart - tick;
  }
  const totalTicks = (END_TIME - startTime) / tick;
  return { totalTicks, startTime, tick };
};

const determineLastPrice = (sortedOutcomeTrades, startTime) => {
  let lastPrice = 0;
  const index = sortedOutcomeTrades
    .sort((a, b) => b.timestamp - a.timestamp)
    .findIndex((t) => startTime > t.timestamp * 1000);
  const sortTS = sortedOutcomeTrades[index]?.timestamp * 1000;
  if (!isNaN(sortTS)) {
    lastPrice = sortedOutcomeTrades[index].price;
  }
  return createBigNumber(lastPrice).toFixed(4);
};

const processPriceTimeData = (formattedOutcomes, market, rangeSelection) => ({
  priceTimeArray: formattedOutcomes.map((outcome) => {
    const { startTime, tick, totalTicks } = calculateRangeSelection(
      rangeSelection,
      market
    );
    const newArray = [];
    const sortedOutcomeTrades = market.amm.trades[outcome.id].sort(
      (a, b) => a.timestamp - b.timestamp
    );
    let newLastPrice = determineLastPrice(sortedOutcomeTrades, startTime);
    for (let i = 0; i < totalTicks; i++) {
      const curTick = startTime + tick * i;
      const nextTick = curTick + tick;
      const matchingTrades = sortedOutcomeTrades.filter((trade) => {
        const tradeTime = trade.timestamp * 1000;
        return tradeTime > curTick && nextTick > tradeTime;
      });
      let priceToUse = newLastPrice;
      let amountToUse = 0;
      if (matchingTrades.length > 0) {
        const FinalTradeOfPeriod = matchingTrades[matchingTrades.length - 1];
        priceToUse = FinalTradeOfPeriod.price;
        amountToUse = FinalTradeOfPeriod.amount;
      }
      const nextPrice = createBigNumber(priceToUse).toFixed(4);
      newArray.push({
        price: nextPrice,
        amount: amountToUse,
        timestamp: curTick,
      });
      newLastPrice = nextPrice;
    }
    return newArray;
  }),
});

export const PriceHistoryChart = ({
  formattedOutcomes,
  market,
  selectedOutcomes,
  rangeSelection,
  cash,
}) => {
  const container = useRef(null);
  // eslint-disable-next-line
  const { maxPriceBigNumber: maxPrice, minPriceBigNumber: minPrice } = market;
  const { priceTimeArray } = processPriceTimeData(
    formattedOutcomes,
    market,
    rangeSelection
  );
  const options = useMemo(
    () =>
      getOptions({
        maxPrice,
        minPrice,
        cash,
      }),
    [maxPrice, minPrice]
  );

  useMemo(() => {
    const chartContainer = container.current;
    if (chartContainer) {
      const chart: HighcartsChart = Highcharts.charts.find(
        (chart: HighcartsChart) => chart?.renderTo === chartContainer
      );
      const formattedOutcomes = getFormattedOutcomes({ market });
      const series =
        priceTimeArray.length === 0
          ? []
          : handleSeries(priceTimeArray, selectedOutcomes, formattedOutcomes);
      if (!chart || chart?.renderTo !== chartContainer) {
        // @ts-ignore
        Highcharts.stockChart(chartContainer, { ...options, series });
      } else {
        series?.forEach((seriesObj, index) => {
          if (chart.series[index]) {
            chart.series[index].update(seriesObj, true);
          } else {
            chart.addSeries(seriesObj, true);
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
    return () => {
      Highcharts.charts
        .find((chart: HighcartsChart) => chart?.renderTo === chartContainer)
        ?.destroy();
    };
  }, []);

  return <section className={Styles.PriceHistoryChart} ref={container} />;
};

export const SelectOutcomeButton = ({
  outcome: { outcomeIdx, label, lastPrice },
  toggleSelected,
  isSelected,
  cash,
}) => {
  return (
    <button
      className={classNames(Styles.SelectOutcomeButton, {
        [Styles[`isSelected_${outcomeIdx}`]]: isSelected,
      })}
      onClick={() => toggleSelected(outcomeIdx)}
    >
      <span>{Checkbox}</span>
      {label}
      <b>{formatCashPrice(createBigNumber(lastPrice), cash?.name).full}</b>
    </button>
  );
};

export const SimpleChartSection = ({ market, cash }) => {
  const formattedOutcomes = getFormattedOutcomes({ market });
  // eslint-disable-next-line
  const [selectedOutcomes, setSelectedOutcomes] = useState(
    formattedOutcomes.map(({ outcomeIdx }) =>
      Boolean(outcomeIdx === DEFAULT_SELECTED_ID)
    )
  );
  const [rangeSelection, setRangeSelection] = useState(3);

  const toggleOutcome = (id) => {
    const updates = [].concat(selectedOutcomes);
    updates[id] = !updates[id];
    setSelectedOutcomes(updates);
  };

  return (
    <section className={Styles.SimpleChartSection}>
      <MultiButtonSelection
        options={RANGE_OPTIONS}
        selection={rangeSelection}
        setSelection={(id) => setRangeSelection(id)}
      />
      <PriceHistoryChart
        {...{
          market,
          formattedOutcomes,
          selectedOutcomes,
          rangeSelection,
          cash,
        }}
      />
      <div>
        {formattedOutcomes.map((outcome) => (
          <SelectOutcomeButton
            key={`${outcome.id}_${outcome.name}`}
            cash={cash}
            outcome={outcome}
            toggleSelected={toggleOutcome}
            isSelected={selectedOutcomes[outcome.outcomeIdx]}
          />
        ))}
      </div>
    </section>
  );
};

export default SimpleChartSection;

// helper functions:
const handleSeries = (
  priceTimeArray,
  selectedOutcomes,
  formattedOutcomes,
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
      name: formattedOutcomes[index].label,
      type: 'areaspline',
      linecap: 'round',
      lineWidth: isSelected ? HIGHLIGHTED_LINE_WIDTH : NORMAL_LINE_WIDTH,
      animation: false,
      states: {
        hover: {
          lineWidth: isSelected ? HIGHLIGHTED_LINE_WIDTH : NORMAL_LINE_WIDTH,
        },
      },
      color: SERIES_COLORS[index],
      fillColor: {
        linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
        stops: SERIES_GRADIENTS[index],
      },
      marker: {
        enabled: false,
        symbol: 'circle',
        states: {
          hover: {
            enabled: true,
            symbol: 'circle',
            radius: 4,
          },
        },
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

const getOptions = ({
  maxPrice = createBigNumber(1),
  minPrice = createBigNumber(0),
  cash,
}) => ({
  lang: {
    noData: 'Select an outcome below',
  },
  title: {
    text: '',
  },
  chart: {
    alignTicks: false,
    backgroundColor: 'transparent',
    type: 'areaspline',
    styledMode: false,
    animation: true,
    reflow: true,
    spacing: [8, 0, 8, 0],
    panning: { enabled: false },
    zoomType: undefined,
    pinchType: undefined,
    panKey: undefined,
    zoomKey: undefined,
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    areaspline: {
      threshold: null,
      animation: true,
    },
  },
  scrollbar: { enabled: false },
  navigator: { enabled: false },
  xAxis: {
    ordinal: false,
    tickLength: 0,
    gridLineWidth: 0,
    gridLineColor: null,
    lineWidth: 0,
    labels: false,
  },
  yAxis: {
    showEmpty: true,
    opposite: false,
    max: maxPrice.toFixed(2),
    min: minPrice.toFixed(2),
    gridLineWidth: 0,
    gridLineColor: null,
    labels: false,
  },
  tooltip: {
    enabled: true,
    shape: 'square',
    shared: true,
    split: false,
    useHTML: true,
    formatter() {
      let out = `<h5>${Highcharts.dateFormat(
        '%b %e %l:%M %p',
        this.x
      )}</h5><ul>`;
      this.points.forEach((point) => {
        out += `<li><span style="color:${point.color}">&#9679;</span><b>${
          point.series.name
        }</b><span>${
          formatCashPrice(createBigNumber(point.y), cash?.name).full
        }</span></li>`;
      });
      out += '</ul>';
      return out;
    },
  },
  rangeSelector: {
    enabled: false,
  },
});

export const getFormattedOutcomes = ({
  market: { amm, outcomes },
}: {
  market: MarketInfo;
}) => {
  return outcomes.map((outcome, outcomeIdx) => ({
    ...outcome,
    outcomeIdx,
    label: (outcome?.name).toLowerCase(),
    lastPrice: !amm ? '0.5' : outcomeIdx === 1 ? amm.priceNo : amm.priceYes,
  }));
};
