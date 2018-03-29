import derivePeriodTimeSeries from 'modules/market/helpers/derive-period-time-series'

onmessage = (event) => {
  const periodTimeSeries = derivePeriodTimeSeries(event)

  postMessage(periodTimeSeries)
}
