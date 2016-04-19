export function isMarketDataOpen(marketData, currentBlockNumber) {
	return parseInt(marketData.endDate, 10) > currentBlockNumber;
}
