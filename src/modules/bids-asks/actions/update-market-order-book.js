import BigNumber from 'bignumber.js';
import { abi, augur, constants } from '../../../services/augurjs';
import { updateMarketPriceHistory } from '../../market/actions/update-market-price-history';
import { updateMarketTradesData } from '../../portfolio/actions/update-market-trades-data';

export const UPDATE_MARKET_ORDER_BOOK = 'UPDATE_MARKET_ORDER_BOOK';
export const CLEAR_MARKET_ORDER_BOOK = 'CLEAR_MARKET_ORDER_BOOK';

export function updateMarketOrderBook(marketId, marketOrderBook) {
	return { type: UPDATE_MARKET_ORDER_BOOK, marketId, marketOrderBook };
}

export function clearMarketOrderBook(marketId) {
	return { type: CLEAR_MARKET_ORDER_BOOK, marketId };
}

export function addOrder(log) {
	return (dispatch, getState) => {
		const orderBook = { ...getState().orderBooks[log.market] };
		if (orderBook) {
			const orderBookSide = orderBook[log.type];
			if (orderBookSide) {
				orderBookSide[log.tradeid] = convertAddTxLogToOrder(log, getState().marketsData[log.market]);
				dispatch(updateMarketOrderBook(log.market, orderBook));
			}
		}
	};
}

export function removeOrder(log) {
	return (dispatch, getState) => {
		const orderBook = { ...getState().orderBooks[log.market] };
		if (orderBook) {
			const orderBookSide = orderBook[log.type];
			if (orderBookSide) {
				if (orderBookSide[log.tradeid]) {
					delete orderBookSide[log.tradeid];
					dispatch(updateMarketOrderBook(log.market, orderBook));
				}
			}
		}
	};
}

export function fillOrder(log) {
	return (dispatch, getState) => {
		const { orderBooks, priceHistory } = getState();
		const orderBook = { ...orderBooks[log.market] };
		if (orderBook) {
			const matchedType = log.type === 'buy' ? 'sell' : 'buy';
			const orderBookSide = orderBook[matchedType];
			if (orderBookSide) {
				const order = orderBookSide[log.tradeid];
				if (order) {
					const updatedAmount = abi.bignum(order.fullPrecisionAmount).minus(abi.bignum(log.amount));
					if (updatedAmount.lte(constants.PRECISION.zero)) {
						delete orderBookSide[log.tradeid];
					} else {
						order.fullPrecisionAount = updatedAmount.toFixed();
						order.amount = augur.roundToPrecision(updatedAmount, constants.MINIMUM_TRADE_SIZE);
					}
					dispatch(updateMarketOrderBook(log.market, orderBook));
				}
			}
		}
		const marketPriceHistory = priceHistory[log.market] ? { ...priceHistory[log.market] } : {};
		if (!marketPriceHistory[log.outcome]) marketPriceHistory[log.outcome] = [];
		marketPriceHistory[log.outcome].push(log);
		dispatch(updateMarketTradesData({ [log.market]: marketPriceHistory }));
		dispatch(updateMarketPriceHistory(log.market, marketPriceHistory));
	};
}

function convertAddTxLogToOrder(log, market) {
	let round;
	let roundingMode;
	if (log.type === 'buy') {
		round = 'floor';
		roundingMode = BigNumber.ROUND_DOWN;
	} else {
		round = 'ceil';
		roundingMode = BigNumber.ROUND_UP;
	}
	const adjustedLog = market.type === 'scalar' ? augur.adjustScalarOrder({ ...log }, market.minValue) : { ...log };
	return {
		id: adjustedLog.tradeid,
		type: adjustedLog.type,
		market: adjustedLog.market,
		amount: augur.roundToPrecision(abi.bignum(adjustedLog.amount), constants.MINIMUM_TRADE_SIZE),
		fullPrecisionAmount: adjustedLog.amount,
		price: augur.roundToPrecision(abi.bignum(adjustedLog.price), constants.PRECISION.zero, round, roundingMode),
		fullPrecisionPrice: adjustedLog.price,
		owner: adjustedLog.sender,
		block: adjustedLog.blockNumber,
		outcome: adjustedLog.outcome.toString()
	};
}
