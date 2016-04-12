import memoizerific from 'memoizerific';

import { BUY_SHARES, SELL_SHARES, BID_SHARES, ASK_SHARES } from '../../transactions/constants/types';

import store from '../../../store';

import * as TradeActions from '../../trade/actions/trade-actions';
import * as TransactionsActions from '../../transactions/actions/transactions-actions';

export default function() {
	var { market, tradeOrders, links } = require('../../../selectors');
	return selectPlaceTradeHandler(market.id, tradeOrders, links.transactionsLink, store.dispatch);
}

export const selectPlaceTradeHandler = memoizerific(1)(function(marketID, tradeOrders, transactionsLink, dispatch) {
	return function() {
		dispatch(TransactionsActions.addTransactions(tradeOrders));
		dispatch(TradeActions.clearTradeInProgress(marketID));
		transactionsLink.onClick();
	};
});