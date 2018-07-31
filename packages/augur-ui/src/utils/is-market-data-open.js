export function isMarketDataOpen(marketData) {
  return marketData.consensus === null
}

export function isMarketDataExpired(marketData, currentTime) {
  if (!marketData || !marketData.endTime || !currentTime) {
    return false
  }
  return marketData.endTime < parseInt(currentTime, 10)
}

export function isMarketDataPreviousReportPeriod(marketData, currentPeriod, reportingPeriodDurationInSeconds) {
  return parseInt(marketData.endTime, 10) <= (currentPeriod - 2) * reportingPeriodDurationInSeconds
}
