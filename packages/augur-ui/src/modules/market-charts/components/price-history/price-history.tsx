import React, { useEffect, useRef, useMemo, useState } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/price-history/price-history.styles.less';
import {
  SCALAR,
  TRADING_TUTORIAL,
  THEMES,
  TIME_FORMATS,
} from 'modules/common/constants';
import { getBucketedPriceTimeSeries } from 'modules/markets/selectors/select-bucketed-price-time-series';
import { MarketData } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';

const HIGHLIGHTED_LINE_WIDTH = 2;
const NORMAL_LINE_WIDTH = 1;

interface PriceTimeDataPoint {
  price: string;
  amount: string;
  timestamp: number;
  logIndex: number;
}

interface PriceTimeSeriesObject {
  0?: Array<PriceTimeDataPoint>;
  1?: Array<PriceTimeDataPoint>;
  2?: Array<PriceTimeDataPoint>;
  3?: Array<PriceTimeDataPoint>;
  4?: Array<PriceTimeDataPoint>;
  5?: Array<PriceTimeDataPoint>;
  6?: Array<PriceTimeDataPoint>;
  7?: Array<PriceTimeDataPoint>;
}

interface BucketedPriceTimeSeries {
  priceTimeArray: Array<Array<PriceTimeDataPoint>>;
}

interface PriceHistoryProps {
  marketId: string;
  market: MarketData;
  selectedOutcomeId?: number;
  isArchived?: boolean;
  rangeValue?: number;
}

const pricePrecision = 4;

const PriceHistory = ({
  selectedOutcomeId = 9,
  isArchived,
  marketId,
  market,
  rangeValue = 0,
}: PriceHistoryProps) => {
  const { theme, timeFormat } = useAppStatusStore();
  const container = useRef(null);
  const [forceRender, setForceRender] = useState(false);
  const is24hr = timeFormat === TIME_FORMATS.TWENTY_FOUR;
  const isTrading = theme === THEMES.TRADING;
  const isTradingTutorial = marketId === TRADING_TUTORIAL;
  const {
    maxPriceBigNumber: maxPrice,
    minPriceBigNumber: minPrice,
    marketType,
    scalarDenomination,
  } = market;
  const isScalar = marketType === SCALAR;
  const { priceTimeArray }: BucketedPriceTimeSeries = !isTradingTutorial
    ? getBucketedPriceTimeSeries(marketId, rangeValue)
    : { priceTimeArray: [] };

  const options = useMemo(
    () =>
      getOptions({
        maxPrice,
        minPrice,
        isScalar,
        pricePrecision,
        isArchived,
        isTrading,
        is24hr,
        scalarDenomination,
      }),
    [
      maxPrice,
      minPrice,
      isScalar,
      pricePrecision,
      isArchived,
      isTrading,
      is24hr,
      scalarDenomination,
    ]
  );
  useMemo(() => {
    if (container.current) {
      const chart = Highcharts.charts.find(
        chart => chart?.renderTo === container.current
      );
      const series =
        (priceTimeArray.length === 0 || isArchived)
          ? []
          : handleSeries(priceTimeArray, selectedOutcomeId, 0, isTrading);
      if (!chart || chart?.renderTo !== container.current) {
        Highcharts.stockChart(container.current, { ...options, series });
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
  }, [
    priceTimeArray.flat().length,
    isArchived,
    selectedOutcomeId,
    isTrading,
    container.current,
  ]);

  useEffect(() => {
    NoDataToDisplay(Highcharts);
    const chart = Highcharts.charts.find(
      chart => chart?.renderTo === container.current
    );
    if (!chart || chart?.renderTo !== container.current) {
      // needs to be done because container ref is null on first load.
      setForceRender(true);
    }
    return () => {
      Highcharts.charts
        .find(chart => chart?.renderTo === container.current)
        ?.destroy();
    };
  }, []);

  return <div className={Styles.PriceHistory} ref={container} />;
};

export default PriceHistory;
// helper functions:
const handleSeries = (
  priceTimeArray,
  selectedOutcomeId,
  mostRecentTradetime = 0,
  isTrading
) => {
  const series = [];
  priceTimeArray.forEach((priceTimeData, index) => {
    const length = priceTimeData.length;
    const isInvalidEmpty =
      index === 0 && !isTrading && priceTimeData[length - 1].price === '0';
    const isSelected = selectedOutcomeId == index;
    if (
      length > 0 &&
      priceTimeData[length - 1].timestamp > mostRecentTradetime
    ) {
      mostRecentTradetime = priceTimeData[length - 1].timestamp;
    }
    const data = priceTimeData.map(pts => [
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
      visible: !isInvalidEmpty,
    };

    series.push({ ...baseSeriesOptions });
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
    seriesObject.data.sort((a, b) => a[0] - b[0]);
  });
  return series;
};

const getOptions = ({
  maxPrice,
  pricePrecision,
  minPrice,
  isScalar,
  isArchived,
  isTrading,
  is24hr,
  scalarDenomination,
}) => ({
  lang: {
    noData: isArchived ? 'Data Archived' : 'Loading...',
  },
  title: {
    text: isScalar && !isArchived ? scalarDenomination : '',
  },
  chart: {
    type: 'line',
    styledMode: false,
    animation: false,
    reflow: true,
    marginTop: 20,
    spacing: [0, 8, 10, 4],
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
        units: [['minute', [1]]],
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
    lineWidth: isTrading ? 1 : 0,
    labels: {
      style: null,
      format: isTrading ? '{value:%H:%M}' : '{value:%l:%M %p}',
      y: isTrading ? undefined : 27,
    },
    crosshair: {
      snap: true,
      label: {
        enabled: true,
        shape: 'square',
        padding: 2,
        format: is24hr ? '{value:%b %d %H:%M}' : '{value:%b %d %l:%M %p}',
      },
    },
  },
  yAxis: {
    showEmpty: true,
    opposite: isTrading,
    max: maxPrice.toFixed(pricePrecision),
    min: minPrice.toFixed(pricePrecision),
    showFirstLabel: !isTrading,
    showLastLabel: true,
    offset: 2,
    labels: {
      align: isTrading ? 'right' : 'left',
      format: isScalar ? '{value:.4f}' : '${value:.2f}',
      style: null,
      reserveSpace: isTrading,
      y: isTrading ? 16 : -4,
      x: isTrading ? -15 : 0,
    },
    crosshair: {
      snap: true,
      label: {
        padding: 2,
        enabled: true,
        style: {},
        borderRadius: 5,
        shape: 'square',
        format: isScalar ? '{value:.4f}' : '${value:.2f}',
      },
    },
  },
  tooltip: { enabled: false },
  rangeSelector: {
    enabled: false,
  },
});
