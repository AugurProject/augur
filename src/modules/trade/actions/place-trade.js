import { BUY, SELL } from '../../trade/constants/types';

import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { selectTransactionsLink } from '../../link/selectors/links';
import { calculateSellTradeIDs, calculateBuyTradeIDs } from '../../trade/actions/helpers/calculate-trade-ids';
import { addBidTransaction } from '../../transactions/actions/add-bid-transaction';
import { addAskTransaction } from '../../transactions/actions/add-ask-transaction';
import { addShortSellTransaction } from '../../transactions/actions/add-short-sell-transaction';
import { addShortSellRiskyTransaction } from '../../transactions/actions/add-short-sell-risky-transaction';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const { tradesInProgress, outcomesData, orderBooks, loginAccount, accountTrades } = getState();
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
				const tradeIDs = calculateBuyTradeIDs(marketID, outcomeID, outcomeTradeInProgress.limitPrice, orderBooks, loginAccount.id);
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
			}
		});

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}
