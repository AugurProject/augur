import { augur } from '../../../services/augurjs';
import { updateAccountTradesData } from '../../../modules/my-positions/actions/update-account-trades-data';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';
import { sellCompleteSets } from '../../../modules/my-positions/actions/sell-complete-sets';

export function loadAccountTrades(skipSellCompleteSets) {
	return (dispatch, getState) => {
		augur.getAccountTrades(getState().loginAccount.id, null, (accountTrades) => {
			if (accountTrades) {
				if (accountTrades.error) {
					return console.warn('ERROR loadAccountTrades', accountTrades);
				}
				dispatch(clearAccountTrades());
				dispatch(updateAccountTradesData(accountTrades));
				if (!skipSellCompleteSets) dispatch(sellCompleteSets());
			}
		});
	};
}
