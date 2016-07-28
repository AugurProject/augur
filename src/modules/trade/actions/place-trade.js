import { addTradeTransaction } from '../../transactions/actions/add-trade-transaction';
import { selectMarket } from '../../market/selectors/market';
import { clearTradeInProgress } from '../../trade/actions/update-trades-in-progress';
import { selectTransactionsLink } from '../../link/selectors/links';

export function placeTrade(marketID) {
	return (dispatch, getState) => {
		const { tradesInProgress, outcomes } = getState();
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
			dispatch(addTradeTransaction(
				outcomeTradeInProgress.side,
				marketID,
				outcomeID,
				market.description,
				outcomes[marketID][outcomeID].name,
				outcomeTradeInProgress));
		});

		dispatch(clearTradeInProgress(marketID));

		selectTransactionsLink(dispatch).onClick();
	};
}
