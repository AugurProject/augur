import { createBigNumber } from 'utils/create-big-number';
import createCachedSelector from 're-reselect';
import store from 'appStore';
import { ZERO } from 'modules/common/constants';
import {
  convertUnixToFormattedDate,
  roundTimestampToPastDayMidnight,
} from 'utils/format-date';
import {
  selectMarketInfosState,
  selectCurrentTimestamp,
  selectMarketTradingHistoryState,
} from 'appStore/select-state';
import { selectPriceTimeSeries } from 'modules/markets/selectors/price-time-series';

function selectMarketsDataStateMarket(state, marketId) {
  return selectMarketInfosState(state)[marketId];
}

function selectMarketTradingHistoryStateMarket(state, marketId) {
  return selectMarketTradingHistoryState(state)[marketId];
}

export default function(marketId) {
  return bucketedPriceTimeSeries(store.getState(), marketId);
}

export const bucketedPriceTimeSeries = createCachedSelector(
  selectCurrentTimestamp,
  selectMarketsDataStateMarket,
  selectMarketTradingHistoryStateMarket,
  (currentTimestamp, marketData, marketTradeHistory) => {
    if (marketData === null || !marketData.creationTime) return {};

    const creationTime = convertUnixToFormattedDate(
      marketData.creationTime
    ).value.getTime();

    const outcomes =
      Object.keys(marketData.outcomes).map(oId => ({
        ...marketData.outcomes[oId],
        priceTimeSeries: selectPriceTimeSeries(
          marketData.outcomes[oId],
          marketTradeHistory
        ),
      })) || [];
    const currentTime = currentTimestamp || Date.now();

    return bucketedPriceTimeSeriesInternal(creationTime, currentTime, outcomes, marketData.minPrice);
  }
)((state, marketId) => marketId);

const bucketedPriceTimeSeriesInternal = (
  creationTime,
  currentTimestamp,
  outcomes,
  minPrice
) => {
  const mmSecondsInHour = createBigNumber(3600 * 1000);
  const mmSecondsInDay = createBigNumber(24).times(mmSecondsInHour);
  const mmSecondsInWeek = createBigNumber(7).times(mmSecondsInDay);

  const bnCurrentTimestamp = createBigNumber(currentTimestamp);
  const startTime = roundTimestampToPastDayMidnight(creationTime);
  const bnCreationTimestamp = createBigNumber(startTime * 1000);
  const overWeekDuration = bnCurrentTimestamp
    .minus(bnCreationTimestamp)
    .gt(mmSecondsInWeek);

  let bucket = mmSecondsInDay;
  if (!overWeekDuration) {
    bucket = mmSecondsInHour;
  }

  const bnRange = bnCurrentTimestamp.minus(bnCreationTimestamp);
  const buckets = Math.ceil(bnRange.dividedBy(bucket).toNumber());
  const numBuckets = createBigNumber(buckets).gt(ZERO) ? buckets : 1;
  const timeBuckets = Array.from(new Array(numBuckets), (val, index) =>
    Math.ceil(
      bnCreationTimestamp.plus(createBigNumber(index).times(bucket)).toNumber()
    )
  );

  timeBuckets.push(currentTimestamp);
  const priceTimeSeries = outcomes.reduce((p, o) => {
    const lastTrade = o.priceTimeSeries.length > 0 && o.priceTimeSeries[o.priceTimeSeries.length -1];
    const priceTimeSeries = [
      {
        price: minPrice,
        amount: "0",
        logIndex: 0,
        timestamp: creationTime
      },
      ...o.priceTimeSeries,
      {
        price: lastTrade ? lastTrade.price : minPrice,
        amount: "0",
        logIndex: 0,
        timestamp: currentTimestamp
      }
    ]
    p[o.id] = splitTradesByTimeBucket(priceTimeSeries, timeBuckets);
    return p;
  }, {});
  return {
    priceTimeSeries,
  };
};

function splitTradesByTimeBucket(priceTimeSeries, timeBuckets) {
  if (!priceTimeSeries || priceTimeSeries.length === 0) return [];
  if (!timeBuckets || timeBuckets.length === 0) return [];
  let timeSeries = priceTimeSeries
    .sort((a, b) => b.logIndex - a.logIndex)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice();

  const series = [];
  for (let i = 0; i < timeBuckets.length - 1; i++) {
    const start = timeBuckets[i];
    const end = timeBuckets[i + 1];
    const result = getTradeInTimeRange(timeSeries, start, end);
    if (result.trades.length > 0) {
      const [head, ...rest] = result.trades;
      series.push({ ...head, timestamp: start });
    }
    timeSeries = result.trimmedTimeSeries;
  }
  return series;
}

function getTradeInTimeRange(timeSeries, startTime, endTime) {
  const bucket = [];
  if (!timeSeries || timeSeries.length === 0) {
    return {
      trades: bucket,
      trimmedTimeSeries: timeSeries,
    };
  }

  timeSeries.forEach(p => {
    const timestamp = createBigNumber(p.timestamp);
    if (timestamp.gt(createBigNumber(endTime))) return;
    if (timestamp.gte(startTime)) {
      bucket.push(p);
    }
  });

  return {
    trimmedTimeSeries: timeSeries.filter(v => !bucket.includes(v)),
    trades: bucket
      .sort((a, b) => b.logIndex - a.logIndex)
      .sort((a, b) => b.timestamp - a.timestamp),
  };
}
