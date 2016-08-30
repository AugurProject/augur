import { augur } from '../../../services/augurjs';
import { updateAccountTradesData } from '../../../modules/my-positions/actions/update-account-trades-data';
import { clearAccountTrades } from '../../../modules/my-positions/actions/clear-account-trades';

export function loadAccountTrades() {
	return (dispatch, getState) => {
		augur.getAccountTrades(getState().loginAccount.id, null, (accountTrades) => {
			if (accountTrades) {
				if (accountTrades.error) {
					return console.warn('ERROR loadAccountTrades', accountTrades);
				}
				dispatch(clearAccountTrades());
				dispatch(updateAccountTradesData(accountTrades));
			}
		});
	};
}
