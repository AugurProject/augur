import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';
import {
	// PENDING,
	// SUCCESS,
	FAILED
} from '../../transactions/constants/statuses';
import { addTransactions } from '../../transactions/actions/add-transactions';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { selectMarket } from '../../market/selectors/market';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const market = selectMarket(marketID);
		const { marketOrderBooks } = getState();

		dispatch(addTransactions(market.tradeSummary.tradeOrders));

		dispatch(trade(marketID, marketOrderBooks[marketID], market.tradeSummary.tradeOrders, market.positionsSummary));

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}

export function trade(marketId, marketOrderBook, tradeOrders, positionsSummary) {
	return (dispatch, getState) => {
		AugurJS.trade(
			marketId, marketOrderBook, tradeOrders, positionsSummary,
			(data)=> console.log("onTradeHash %o", data),
			(data)=> console.log("onCommitSent %o", data),
			(data)=> console.log("onCommitSuccess %o", data),
			(data)=> console.log("onCommitFailed %o", data),
			(data)=> console.log("onNextBlock %o", data),
			(data)=> console.log("onTradeSent %o", data),
			(data)=> console.log("onTradeSuccess %o", data),
			(data)=> console.log("onTradeFailed %o", data)
		);
	};
}
