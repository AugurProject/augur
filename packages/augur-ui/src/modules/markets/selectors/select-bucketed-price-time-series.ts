import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import {
  convertUnixToFormattedDate,
  roundTimestampToPastDayMidnight,
} from 'utils/format-date';
import { selectPriceTimeSeries } from 'modules/markets/selectors/price-time-series';
import { AppStatus } from 'modules/app/store/app-status';
import { Markets } from '../store/markets';

export const getBucketedPriceTimeSeries = (marketId, rangeValue = 0) => {
  const { marketInfos, marketTradingHistory } = Markets.get();
  const marketData = marketInfos[marketId];
  const marketTradeHistory = marketTradingHistory[marketId];
  if (marketData === null || !marketData.creationTime) return { priceTimeSeries: {},
priceTimeArray: [] };
  const {
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
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
  const currentTime = currentAugurTimestamp * 1000 || Date.now();
  const startTime = rangeValue === 0 ? creationTime : currentTime - (rangeValue * 1000);

  return bucketedPriceTimeSeriesInternal(
    startTime <= creationTime ? creationTime : startTime,
    currentTime,
    outcomes,
    marketData.minPrice
  );
};

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
  const priceTimeArray = outcomes.reduce((p, o) => {
    const lastTrade =
      o.priceTimeSeries.length > 0 &&
      o.priceTimeSeries[o.priceTimeSeries.length - 1];
    const priceTimeSeries = [
      {
        price: minPrice,
        amount: '0',
        logIndex: 0,
        timestamp: creationTime,
      },
      ...o.priceTimeSeries,
      {
        price: lastTrade ? lastTrade.price : minPrice,
        amount: '0',
        logIndex: 0,
        timestamp: currentTimestamp,
      },
    ];
    // p[o.id] = splitTradesByTimeBucket(priceTimeSeries, timeBuckets);
    p.push(splitTradesByTimeBucket(priceTimeSeries, timeBuckets));
    return p;
  }, [])
  return {
    priceTimeArray,
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
