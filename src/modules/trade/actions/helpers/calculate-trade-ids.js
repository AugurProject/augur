export function calculateBuyTradeIDs(marketID, outcomeID, limitPrice, marketOrderBooks) {
	const marketOrderBookSells = marketOrderBooks[marketID] && marketOrderBooks[marketID].sell || {};

	const matchingIDs = Object.keys(marketOrderBookSells)
		.map(orderID => { return { ...marketOrderBookSells[orderID], price: parseFloat(marketOrderBookSells[orderID].price) }})
		.filter(order => order.outcome === outcomeID && order.price <= limitPrice)
		.sort((order1, order2) => (order1.price < order2.price ? -1 : 0))
		.map(order => order.id);

	return matchingIDs;
}

export function calculateSellTradeIDs(marketID, outcomeID, limitPrice, marketOrderBooks) {
	const marketOrderBookBuys = marketOrderBooks[marketID] && marketOrderBooks[marketID].buy || {};

	const matchingIDs = Object.keys(marketOrderBookBuys)
		.map(orderID => { return { ...marketOrderBookBuys[orderID], price: parseFloat(marketOrderBookBuys[orderID].price) }})
		.filter(order => order.outcome === outcomeID && parseFloat(order.price) >= limitPrice)
		.sort((order1, order2) => (order1.price > order2.price ? -1 : 0))
		.map(order => order.id);

	return matchingIDs;
}