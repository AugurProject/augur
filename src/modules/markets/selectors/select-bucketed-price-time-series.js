import { createBigNumber } from "utils/create-big-number";
import { head, each, pullAll } from "lodash";
import { ZERO } from "modules/common-elements/constants";
import { roundTimestampToPastDayMidnight } from "utils/format-date";

export const selectBucketedPriceTimeSeries = (
  creationTime,
  currentTimestamp,
  outcomes
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
    p[o.id] = splitTradesByTimeBucket(o.priceTimeSeries, timeBuckets);
    return p;
  }, {});

  return {
    priceTimeSeries
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
    if (result.trades.length > 0)
      series.push({ ...head(result.trades), timestamp: start });
    timeSeries = result.trimmedTimeSeries;
  }
  return series;
}

function getTradeInTimeRange(timeSeries, startTime, endTime) {
  const bucket = [];
  if (!timeSeries || timeSeries.length === 0) {
    return {
      trades: bucket,
      trimmedTimeSeries: timeSeries
    };
  }

  each(timeSeries, p => {
    const timestamp = createBigNumber(p.timestamp);
    if (timestamp.gt(createBigNumber(endTime))) return;
    if (timestamp.gte(startTime)) {
      bucket.push(p);
    }
  });

  return {
    trimmedTimeSeries: pullAll(timeSeries, bucket),
    trades: bucket
      .sort((a, b) => b.logIndex - a.logIndex)
      .sort((a, b) => b.timestamp - a.timestamp)
  };
}
