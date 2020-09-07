import React, { useRef, useMemo, useEffect, useState } from 'react';
import { createBigNumber } from 'utils/create-big-number';
import Highcharts from 'highcharts/highstock';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
import Styles from 'modules/market-charts/components/candlestick/candlestick.styles.less';
import { DAI } from 'modules/common/constants';
import { PriceTimeSeriesData } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface HighChartsWrapperProps {
  priceTimeSeries: PriceTimeSeriesData[];
  selectedPeriod: number;
  pricePrecision: number;
  updateHoveredPeriod: Function;
  marketMax: BigNumber;
  marketMin: BigNumber;
  volumeType: string;
  isArchived?: boolean;
}

const GROUPING_UNITS = [
  ['minute', [1]],
  ['hour', [1]],
  ['day', [1]],
  ['week', [1]],
  ['month', [1]],
  ['year', [1]],
];

export const PERIOD_RANGES = {
  3600: {
    period: 3600,
    format: '{value:%b %d}',
    crosshair: '{value:%H:%M}',
    range: 24 * 3600 * 1000, // 1 day
  },
  43200: {
    period: 43200,
    format: '{value:%b %d}',
    crosshair: '{value:%H:%M}',
    range: 7 * 24 * 3600 * 1000, // 1 week
  },
  86400: {
    period: 86400,
    format: '{value:%b %d}',
    crosshair: '{value:%b %d }',
    range: 30 * 24 * 3600 * 1000, // month
  },
  604800: {
    period: 604800,
    format: '{value:%b %d}',
    crosshair: '{value:%b %d }',
    range: 6 * 30 * 24 * 3600 * 1000, // 6 months
  },
};

function handleVolumeBarUpdate(chart, isHover, timestamp) {
  const groupData = chart.yAxis[1].series[0].groupedData;
  const isGroupedData = groupData && groupData.length > 0;
  const data = !isGroupedData ? chart.yAxis[1].series[0].data : groupData;

  const bar = data.find(d => d && d.x === timestamp);

  const color = isHover ? '#0E0E0F' : '#3C3B43';

  if (isGroupedData) {
    const index = data.indexOf(bar);
    if (groupData[index]) {
      groupData[index].graphic.css({
        color,
      });
    }
  } else if (bar) {
    const currentColor = bar.color;
    if (currentColor !== color) {
      bar.update({
        color,
      });
    }
  }
}

const getChartData = (
  priceTimeSeries,
  selectedPeriod,
  volumeType,
  currentTimeInSeconds
) => {
  const candlestickData = [];
  const volumeData = [];
  const priceBuckets = [];
  const start =
    priceTimeSeries.length > 0 && priceTimeSeries[0].period
      ? priceTimeSeries[0].period
      : 0;
  const end = currentTimeInSeconds * 1000;
  const fullRange = end - start;
  const period = selectedPeriod * 1000;
  if (
    fullRange > 0 &&
    priceTimeSeries.length > 0 &&
    currentTimeInSeconds > 1000
  ) {
    console.log(1);
    const num = fullRange / period;
    for (let i = 0; i <= num; i++) {
      priceBuckets.push(start + i * period);
    }
    // use the first found trade to indicate -
    let lastPrice = priceTimeSeries[0].open;
    priceBuckets.forEach(timestamp => {
      const index = priceTimeSeries.findIndex(
        item => item.period === timestamp
      );
      if (index >= 0) {
        const price = priceTimeSeries[index];
        lastPrice = price.close;
        const {
          open,
          high,
          low,
          close,
          period,
          volume: daiVolume,
          shareVolume,
        } = price;
        candlestickData.push({ x: period, open, high, low, close });
        volumeData.push([period, volumeType === DAI ? daiVolume : shareVolume]);
      } else {
        candlestickData.push({
          x: timestamp,
          open: lastPrice,
          high: lastPrice,
          low: lastPrice,
          close: lastPrice,
          colorIndex: 3,
        });
        volumeData.push([timestamp, 0]);
      }
    });
  } else {
    console.log(2);
    priceTimeSeries.forEach(price => {
      const {
        open,
        high,
        low,
        close,
        period,
        volume: daiVolume,
        shareVolume,
      } = price;
      candlestickData.push({ x: period, open, high, low, close });
      volumeData.push([period, volumeType === DAI ? daiVolume : shareVolume]);
    });
  }
  return {
    candlestickData,
    volumeData,
  };
}

export const CandlestickHighchart = ({
  priceTimeSeries,
  selectedPeriod,
  pricePrecision,
  marketMin,
  marketMax,
  volumeType,
  isArchived,
  updateHoveredPeriod,
}: HighChartsWrapperProps) => {
  const {
    blockchain: { currentAugurTimestamp: currentTimeInSeconds },
  } = useAppStatusStore();
  const container = useRef(null);
  const [forceRender, setForceRender] = useState(false);
  const chart = Highcharts.charts.find(
    chart => chart?.renderTo === container.current
  );
  const mouseOut = evt => {
    const { x: timestamp } = evt.target;
    if (chart?.xAxis && !chart.xAxis[0].isDirty) {
      chart.xAxis[0].removePlotBand('new-plot-band');
      handleVolumeBarUpdate(chart, false, timestamp);
    }
    updateHoveredPeriod({
      open: '',
      close: '',
      high: '',
      low: '',
      volume: '',
    });
  };

  const mouseOver = evt => {
    const period = selectedPeriod * 1000;
    const { x: timestamp } = evt.target;
    const pts = priceTimeSeries.find(p => p.period === timestamp);
    if (pts) {
      const { open, close, high, low } = pts;

      const mid = chart.xAxis[0].toPixels(timestamp, true);
      const scaledFrom = chart.xAxis[0].toPixels(
        timestamp - period * 0.25,
        true
      );
      const scaledTo = chart.xAxis[0].toPixels(timestamp + period * 0.25, true);
      // const maxFrom = mid - 10;
      // const maxTo = mid + 10;
      const scaledRange = scaledTo - scaledFrom;
      // make sure to never draw larger than 20 px as that's the max size of bars.
      const from = chart.xAxis[0].toValue(
        scaledRange < 20 ? scaledFrom : mid - 10,
        true
      );
      const to = chart.xAxis[0].toValue(
        scaledRange < 20 ? scaledTo : mid + 10,
        true
      );

      const plotBand = {
        id: 'new-plot-band',
        from,
        to,
      };

      chart.xAxis[0].addPlotBand(plotBand);
      handleVolumeBarUpdate(chart, true, timestamp);
      updateHoveredPeriod({
        open: open ? createBigNumber(open) : '',
        close: close ? createBigNumber(close) : '',
        high: high ? createBigNumber(high) : '',
        low: low ? createBigNumber(low) : '',
        volume: pts
          ? createBigNumber(volumeType === DAI ? pts.volume : pts.shareVolume)
          : '',
      });
    }
  };

  const { candlestickData, volumeData } = useMemo(() =>
    getChartData(
      priceTimeSeries,
      selectedPeriod,
      volumeType,
      currentTimeInSeconds
    ),
    [priceTimeSeries.flat().length, selectedPeriod, volumeType]
  );

  const options = useMemo(
    () =>
      getOptions({
        isArchived,
        min: createBigNumber(marketMin).toFixed(pricePrecision),
        max: createBigNumber(marketMax).toFixed(pricePrecision),
        peroidRangeOptions: PERIOD_RANGES[selectedPeriod],
        mouseOver,
        mouseOut,
        candlestickData,
        volumeData,
      }),
    [marketMax, marketMin, selectedPeriod, pricePrecision, isArchived]
  );

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

  useEffect(() => {
    function mouseWheelHandler(e) {
      e.preventDefault();
      if (!chart) return;
      const spinAmount = Math.ceil(e.wheelDelta / 100);
      const changeRate = spinAmount * chart.xAxis[0].minRange;
      const priceTimePeriod = (priceTimeSeries[0] && priceTimeSeries[0].period) || 0;
      const { dataMax } = chart.xAxis[0].getExtremes();
      const maxMin = dataMax - chart.xAxis[0].minRange;
      const xMin = isNaN((priceTimePeriod + changeRate)) ? priceTimePeriod : priceTimePeriod + changeRate;
      const dataMin = xMin > maxMin ? maxMin : xMin;
  
      chart.xAxis[0].setExtremes(dataMin, dataMax, false);
      chart.yAxis[0].setExtremes(
        chart.yAxis[0].dataMin * 0.95,
        chart.yAxis[0].dataMax * 1.05
      );
    };

    container.current.addEventListener(
      'mousewheel',
      mouseWheelHandler,
      false
    );
    return () => container.current.removeEventListener(
      'mousewheel',
      mouseWheelHandler,
      false
    );
  }, []);

  useMemo(() => {
    if (container.current && !chart) {
      Highcharts.stockChart(container.current, options);
      const chart = Highcharts.charts.find(
        chart => chart?.renderTo === container.current
      );
      chart.yAxis[0].setExtremes(
        chart.yAxis[0].dataMin * 0.95,
        chart.yAxis[0].dataMax * 1.05
      );
    }
  }, [options, container.current]);

  return <div className={Styles.Candlestick} ref={container} />;
};

const getOptions = ({
  isArchived,
  max,
  min,
  candlestickData,
  volumeData,
  mouseOver,
  mouseOut,
  peroidRangeOptions: { range, format, crosshair },
}) => ({
  lang: {
    noData: isArchived ? 'Data Archived' : 'No Completed Trades',
  },
  credits: { enabled: false },
  tooltip: { enabled: false },
  scrollbar: { enabled: false },
  navigator: { enabled: false },
  rangeSelector: { enabled: false },
  plotOptions: {
    candlestick: {
      borderRadius: 5,
    },
    series: {
      point: {
        events: {
          mouseOver,
          mouseOut,
        },
      },
    },
  },
  chart: {
    type: 'candlestick',
    followTouchMove: true,
    panning: true,
    animation: false,
    spacing: [10, 8, 10, 0],
  },
  xAxis: {
    ordinal: false,
    tickLength: 7,
    gridLineWidth: 1,
    gridLineColor: null,
    labels: {
      format,
      align: 'center',
    },
    range,
    crosshair: {
      width: 0,
      className: Styles.Candlestick_display_none,
      label: {
        enabled: true,
        format: crosshair,
        shape: 'square',
        padding: 2,
      },
    },
  },
  yAxis: [
    // OHCL
    {
      showEmpty: true,
      max,
      min,
      showFirstLabel: false,
      showLastLabel: true,
      offset: 2,
      labels: {
        format: '${value:.2f}',
        style: Styles.Candlestick_display_yLables,
        reserveSpace: true,
        y: 16,
      },
      crosshair: {
        snap: false,
        label: {
          enabled: true,
          format: '${value:.2f}',
          borderRadius: 5,
          shape: 'square',
          padding: 2,
        },
      },
    },
    // VOLUME
    {
      min: 0,
      top: '85%',
      height: '15%',
      opposite: true,
      className: Styles.Candlestick_display_none, // Hide Volume Y-axis Scale
      labels: {
        enabled: false,
      },
    },
  ],

  series: [
    {
      // OHLC
      type: 'candlestick',
      name: 'ohlc',
      data: candlestickData,
      yAxis: 0,
      zIndex: 1,
      dataGrouping: {
        units: GROUPING_UNITS,
      },
      maxPointWidth: 20,
      minPointWidth: 10,
    },
    // VOLUME
    {
      type: 'column',
      name: 'volume',
      data: volumeData,
      yAxis: 1,
      maxPointWidth: 20,
      minPointWidth: 10,
      dataGrouping: {
        units: GROUPING_UNITS,
      },
    },
  ],
});
