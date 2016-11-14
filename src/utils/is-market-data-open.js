export function isMarketDataOpen(marketData) {
	return marketData.reportedOutcome === undefined;
}

export function isMarketDataExpired(marketData, currentTime) {
	return marketData.endDate.value.getTime() < currentTime;
}

export function isMarketDataPreviousReportPeriod(marketData, currentPeriod, periodLength) {
	return parseInt(marketData.endDate, 10) <= (currentPeriod - 2) * periodLength;
}
