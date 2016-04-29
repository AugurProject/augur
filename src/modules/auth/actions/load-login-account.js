import * as AugurJS from '../../../services/augurjs';

import { SUCCESS, FAILED, PENDING, INTERRUPTED } from '../../transactions/constants/statuses';

import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { loadReports, clearReports } from '../../reports/actions/update-reports';
import { updateFavorites } from '../../markets/actions/update-favorites';
import { updateAccountTradesData } from '../../positions/actions/update-account-trades-data';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function loadLoginAccount() {
	return (dispatch, getState) => {
		AugurJS.loadLoginAccount(true, (err, loginAccount) => {
			if (err) {
				return console.error('ERR loadLoginAccount():', err);
			}
			if (!loginAccount || !loginAccount.id) {
				return;
			}

			dispatch(loadLoginAccountLocalStorage(loginAccount.id));
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

export function loadLoginAccountLocalStorage(accountID) {
	return (dispatch, getState) => {
		var localStorageRef = typeof window !== 'undefined' && window.localStorage,
			localState;

		if (!localStorageRef || !localStorageRef.getItem || !accountID) {
			return;
		}

		localState = JSON.parse(localStorageRef.getItem(accountID));

		if (!localState) {
			return;
		}

		if (localState.favorites) {
			dispatch(updateFavorites(localState.favorites));
		}
		if (localState.accountTrades) {
			dispatch(updateAccountTradesData(localState.accountTrades));
		}
		if (localState.transactionsData) {
			Object.keys(localState.transactionsData).forEach(key => {
				if ([SUCCESS, FAILED, PENDING, INTERRUPTED].indexOf(localState.transactionsData[key].status) < 0) {
					localState.transactionsData[key].status = INTERRUPTED;
					localState.transactionsData[key].message = 'unknown if completed';
				}
			});
			dispatch(updateTransactionsData(localState.transactionsData));
		}
	}
}
