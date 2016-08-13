export function isMarketDataOpen(marketData) {
	return marketData.reportedOutcome === undefined;
}

export function isMarketDataExpired(marketData) {
	return parseInt(marketData.endDate, 10) > new Date().getTime() / 1000;
}

export function isMarketDataPreviousReportPeriod(marketData, currentPeriod, periodLength) {
	return parseInt(marketData.endDate, 10) <= (currentPeriod - 2) * periodLength;
}
