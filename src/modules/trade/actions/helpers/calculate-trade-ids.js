export function calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, takerAddress) {
	const marketOrderBookSells = orderBooks[marketID] && orderBooks[marketID].sell || {};

	const matchingIDs = Object.keys(marketOrderBookSells)
		.map(orderID => ({ ...marketOrderBookSells[orderID], price: parseFloat(marketOrderBookSells[orderID].price) }))
		.filter(order => order.outcome === outcomeID && order.owner !== takerAddress && order.price <= limitPrice)
		.sort((order1, order2) => (order1.price < order2.price ? -1 : 0))
		.map(order => order.id);

	return matchingIDs;
}

export function calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, takerAddress) {
	const marketOrderBookBuys = orderBooks[marketID] && orderBooks[marketID].buy || {};

	const matchingIDs = Object.keys(marketOrderBookBuys)
		.map(orderID => ({ ...marketOrderBookBuys[orderID], price: parseFloat(marketOrderBookBuys[orderID].price) }))
		.filter(order => order.outcome === outcomeID && order.owner !== takerAddress && parseFloat(order.price) >= limitPrice)
		.sort((order1, order2) => (order1.price > order2.price ? -1 : 0))
		.map(order => order.id);

	return matchingIDs;
}
