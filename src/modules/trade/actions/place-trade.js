import { BUY, SELL } from '../../trade/constants/types';

import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const { tradesInProgress, outcomesData } = getState();
		const marketTradeInProgress = tradesInProgress[marketID];
		const market = selectMarket(marketID);

		if (!marketTradeInProgress || !market) {
			return;
		}

		let outcomeTradeInProgress;

		Object.keys(marketTradeInProgress).forEach((outcomeID, i) => {
			outcomeTradeInProgress = marketTradeInProgress[outcomeID];
			if (!outcomeTradeInProgress || !outcomeTradeInProgress.limitPrice || !outcomeTradeInProgress.numShares || !outcomeTradeInProgress.totalCost) {
				return;
			}

			const totalCost = Math.abs(outcomeTradeInProgress.totalCost);

			if (outcomeTradeInProgress.side === BUY) {
				dispatch(addTradeTransaction(
					BUY,
					i,
					marketID,
					outcomeID,
					market.description,
					outcomesData[marketID][outcomeID].name,
					outcomeTradeInProgress.numShares,
					outcomeTradeInProgress.limitPrice,
					totalCost));

			} else if (outcomeTradeInProgress.side === SELL) {
				dispatch(addTradeTransaction(
					SELL,
					i,
					marketID,
					outcomeID,
					market.description,
					outcomesData[marketID][outcomeID].name,
					outcomeTradeInProgress.numShares,
					outcomeTradeInProgress.limitPrice,
					totalCost));
/*
				const tradeIDs = calculateSellTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks, loginAccount.id);

				// check if user has position
				//  - if so, sell/ask
				//  - if not, short sell/short sell risky
				if (accountTrades && accountTrades[marketID] && accountTrades[marketID][outcomeID] && accountTrades[marketID][outcomeID].qtyShares) {
					if (tradeIDs && tradeIDs.length) {
						dispatch(addTradeTransaction(
							SELL,
							marketID,
							outcomeID,
							market.description,
							outcomesData[marketID][outcomeID].name,
							outcomeTradeInProgress.numShares,
							outcomeTradeInProgress.limitPrice,
							totalCost));
					} else {
						dispatch(addAskTransaction(
							marketID,
							outcomeID,
							market.description,
							outcomesData[marketID][outcomeID].name,
							outcomeTradeInProgress.numShares,
							outcomeTradeInProgress.limitPrice,
							totalCost));
					}
				} else {
					if (tradeIDs && tradeIDs.length) {
						dispatch(addShortSellTransaction(
							marketID,
							outcomeID,
							market.description,
							outcomesData[marketID][outcomeID].name,
							outcomeTradeInProgress.numShares,
							outcomeTradeInProgress.limitPrice,
							totalCost));
					} else {
						dispatch(addShortSellRiskyTransaction(
							marketID,
							outcomeID,
							market.description,
							outcomesData[marketID][outcomeID].name,
							outcomeTradeInProgress.numShares,
							outcomeTradeInProgress.limitPrice,
							totalCost));
					}
				}
*/
			}
		});

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}
