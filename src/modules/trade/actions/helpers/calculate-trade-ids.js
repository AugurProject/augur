export function calculateBuyTradeIDs(marketID, outcomeID, limitPrice, accountAddress, orderBooks) {
	const marketOrderBookSells = orderBooks[marketID] && orderBooks[marketID].sell || {};
console.log('!!!', accountAddress);
	const matchingIDs = Object.keys(marketOrderBookSells)
		.map(orderID => ({ ...marketOrderBookSells[orderID], price: parseFloat(marketOrderBookSells[orderID].price) }))
		.filter(order => order.outcome === outcomeID && order.owner !== accountAddress && order.price <= limitPrice)
		.sort((order1, order2) => (order1.price < order2.price ? -1 : 0))
		.map(order => order.id);

	return matchingIDs;
}

export function calculateSellTradeIDs(marketID, outcomeID, limitPrice, accountAddress, orderBooks) {
	const marketOrderBookBuys = orderBooks[marketID] && orderBooks[marketID].buy || {};
	const matchingIDs = Object.keys(marketOrderBookBuys)
		.map(orderID => ({ ...marketOrderBookBuys[orderID], price: parseFloat(marketOrderBookBuys[orderID].price) }))
		.filter(order => order.outcome === outcomeID && order.owner !== accountAddress && order.price >= limitPrice)
		.sort((order1, order2) => (order1.price > order2.price ? -1 : 0))
		.map(order => order.id);

console.log('!!!', accountAddress, matchingIDs);
	return matchingIDs;
}
