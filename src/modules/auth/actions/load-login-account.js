import * as AugurJS from '../../../services/augurjs';

import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { loadReports, clearReports } from '../../reports/actions/update-reports';

export function loadLoginAccount() {
	return (dispatch, getState) => {
		AugurJS.loadLoginAccount(true, (err, loginAccount) => {
			if (err) {
				return console.error('ERR loadLoginAccount():', err);
			}
			if (!loginAccount) {
				return;
			}
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());
			return;
		});
	};
}

export function loadLoginAccountDependents() {
	return (dispatch, getState) => {
		var { marketsData } = getState();

		//dispatch(loadMeanTradePrices());
		dispatch(updateAssets());
		dispatch(loadAccountTrades());

		dispatch(clearReports());
		dispatch(loadReports(marketsData));
	};
}