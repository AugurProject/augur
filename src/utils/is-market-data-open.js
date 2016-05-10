export function isMarketDataOpen(marketData, currentBlockNumber) {
	return parseInt(marketData.endDate, 10) > currentBlockNumber;
}

export function isMarketDataPreviousReportPeriod(marketData, currentPeriod, periodLength) {
	return parseInt(marketData.endDate, 10) <= (currentPeriod - 2) * periodLength;
}
