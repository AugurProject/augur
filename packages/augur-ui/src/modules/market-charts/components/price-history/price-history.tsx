import React, { useEffect, useRef } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/price-history/price-history.styles.less';

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
  priceTimeSeries?: PriceTimeSeriesObject;
}

interface PriceHistoryProps {
  maxPrice: number;
  minPrice: number;
  bucketedPriceTimeSeries: BucketedPriceTimeSeries;
  isScalar: boolean;
  scalarDenomination: string;
  selectedOutcomeId: number;
  pricePrecision: number;
  isTradingTutorial?: boolean;
  isArchived?: boolean;
}

const PriceHistory = ({
  maxPrice,
  minPrice,
  bucketedPriceTimeSeries,
  isScalar = false,
  scalarDenomination = '',
  selectedOutcomeId,
  pricePrecision,
  isArchived
}: PriceHistoryProps) => {
  const container = useRef(null);
  const options = getOptions({ maxPrice, minPrice, isScalar, pricePrecision, isArchived });
  const { priceTimeSeries } = bucketedPriceTimeSeries;
  const hasPriceTimeSeries = !!priceTimeSeries && !!Object.keys(priceTimeSeries);
  useEffect(() => {
    if (!hasPriceTimeSeries) return NoDataToDisplay(Highcharts);
    const hasData =
      !isArchived &&
      priceTimeSeries &&
      Object.keys(priceTimeSeries) &&
      Object.keys(priceTimeSeries).filter(
        key => priceTimeSeries[key].length > 0
      ).length;
    const series = hasData && handleSeries(priceTimeSeries, selectedOutcomeId, 0);

    if (isScalar && hasData) {
      options.title.text = scalarDenomination;
    }
    options.plotOptions.line.dataGrouping = {
      ...options.plotOptions.line.dataGrouping,
      forced: true,
      units: [['minute', [1]]],
    };

    const newOptions = Object.assign(options, { series });
    Highcharts.stockChart(container.current, newOptions);
  }, [selectedOutcomeId, hasPriceTimeSeries]);

  useEffect(() => {
    Highcharts.charts.forEach(chart => {
      if (chart) {
        const seriesUpdated = handleSeries(
          priceTimeSeries,
          selectedOutcomeId,
          0
        );
        seriesUpdated.forEach(({ data }, index) => {
          chart.series[index] && chart.series[index].setData(data, false, false);
        });
        chart.redraw();
      }
    });
  }, [priceTimeSeries]);

  return <div className={Styles.PriceHistory} ref={container} />;
};

export default PriceHistory;
// helper functions:
const getOptions = ({ maxPrice, pricePrecision, minPrice, isScalar, isArchived }) => ({
  lang: {
    noData: isArchived ? 'Data Archived' : 'No Completed Trades',
  },
  title: {
    text: '',
  },
  chart: {
    type: 'line',
    styledMode: false,
    animation: false,
    reflow: true,
    marginTop: 20,
    spacing: [0, 8, 10, 0],
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
        units: [['day', [1]]],
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
    labels: {
      style: null,
    },
    crosshair: {
      snap: true,
      label: {
        enabled: true,
        shape: 'square',
        padding: 2,
        format: '{value:%b %d %H:%M}',
      },
    },
  },
  yAxis: {
    showEmpty: true,
    opposite: true,
    max: createBigNumber(maxPrice).toFixed(pricePrecision),
    min: createBigNumber(minPrice).toFixed(pricePrecision),
    showFirstLabel: false,
    showLastLabel: true,
    offset: 2,
    labels: {
      format: isScalar ? '{value:.4f}' : '${value:.2f}',
      style: null,
      reserveSpace: true,
      y: 16,
    },
    crosshair: {
      label: {
        padding: 2,
        enabled: true,
        style: null,
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

const handleSeries = (
  priceTimeSeries,
  selectedOutcomeId,
  mostRecentTradetime = 0
) => {
  const series = [];
  priceTimeSeries && Object.keys(priceTimeSeries).forEach(id => {
    const isSelected = selectedOutcomeId && selectedOutcomeId == id;
    const length = priceTimeSeries[id].length;
    if (
      length > 0 &&
      priceTimeSeries[id][length - 1].timestamp > mostRecentTradetime
    ) {
      mostRecentTradetime = priceTimeSeries[id][length - 1].timestamp;
    }
    const data = priceTimeSeries[id].map(pts => [
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
    };

    series.push({
      ...baseSeriesOptions,
    });
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
