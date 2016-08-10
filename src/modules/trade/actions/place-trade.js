import { BUY, SELL } from '../../trade/constants/types';

import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { selectTransactionsLink } from '../../link/selectors/links';
import { calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const { tradesInProgress, outcomesData, orderBooks } = getState();
		const marketTradeInProgress = tradesInProgress[marketID];
		const market = selectMarket(marketID);

		if (!marketTradeInProgress || !market) {
			return;
		}

		let outcomeTradeInProgress;
		Object.keys(marketTradeInProgress).forEach(outcomeID => {
			outcomeTradeInProgress = marketTradeInProgress[outcomeID];
			if (!outcomeTradeInProgress || !outcomeTradeInProgress.limitPrice || !outcomeTradeInProgress.numShares || !outcomeTradeInProgress.totalCost) {
				return;
			}

			const totalCost = Math.abs(outcomeTradeInProgress.totalCost);

			if (outcomeTradeInProgress.side === BUY) {
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks);
				if (tradeIDs && tradeIDs.length) {
					dispatch(addTradeTransaction(
						BUY,
						marketID,
						outcomeID,
						market.description,
						outcomesData[marketID][outcomeID].name,
						outcomeTradeInProgress.numShares,
						outcomeTradeInProgress.limitPrice,
						totalCost));
				} else {
					dispatch(addBidTransaction(
						marketID,
						outcomeID,
						market.description,
						outcomesData[marketID][outcomeID].name,
						outcomeTradeInProgress.numShares,
						outcomeTradeInProgress.limitPrice,
						totalCost));
				}
			} else if (outcomeTradeInProgress.side === SELL) {
				dispatch(addTradeTransaction(
					SELL,
					marketID,
					outcomeID,
					market.description,
					outcomesData[marketID][outcomeID].name,
					outcomeTradeInProgress.numShares,
					outcomeTradeInProgress.limitPrice,
					totalCost));
			}
		});

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}
