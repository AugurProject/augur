import { augur } from '../../../../services/augurjs';

export function calculateBuyTradeIDs(marketID, outcomeID, limitPrice, orderBooks, takerAddress) {
	const orders = (orderBooks[marketID] && orderBooks[marketID].sell) || {};
	return augur.filterByPriceAndOutcomeAndUserSortByPrice(orders, 'buy', limitPrice, outcomeID, takerAddress).map(order => order.id);
}

export function calculateSellTradeIDs(marketID, outcomeID, limitPrice, orderBooks, takerAddress) {
	const orders = (orderBooks[marketID] && orderBooks[marketID].buy) || {};
	return augur.filterByPriceAndOutcomeAndUserSortByPrice(orders, 'sell', limitPrice, outcomeID, takerAddress).map(order => order.id);
}
