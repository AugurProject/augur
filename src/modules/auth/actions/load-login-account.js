import * as AugurJS from '../../../services/augurjs';

import { SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
// import { updateReports, clearReports } from '../../reports/actions/update-reports';
import { loadReports } from '../../reports/actions/load-reports';
import { updateReports } from '../../reports/actions/update-reports';
import { updateFavorites } from '../../markets/actions/update-favorites';
import { updateAccountTradesData } from '../../../modules/my-positions/actions/update-account-trades-data';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

export function loadLoginAccountDependents() {
	return (dispatch, getState) => {
		dispatch(updateAssets());
		dispatch(loadAccountTrades());

		// clear and load reports for any markets that have been loaded
		// (partly to handle signing out of one account and into another)
		// dispatch(clearReports());
	};
}

export function loadLoginAccountLocalStorage(accountID) {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;

		if (!localStorageRef || !localStorageRef.getItem || !accountID) {
			return;
		}

		const localState = JSON.parse(localStorageRef.getItem(accountID));

		if (!localState) {
			return;
		}

		if (localState.favorites) {
			dispatch(updateFavorites(localState.favorites));
		}
		if (localState.accountTrades) {
			dispatch(updateAccountTradesData(localState.accountTrades));
		}
		if (localState.reports && Object.keys(localState.reports).length) {
			dispatch(updateReports(localState.reports));
		}
		if (localState.transactionsData) {
			Object.keys(localState.transactionsData).forEach(key => {
				if ([SUCCESS, FAILED, INTERRUPTED].indexOf(localState.transactionsData[key].status) < 0) {
					localState.transactionsData[key].status = INTERRUPTED;
					localState.transactionsData[key].message = 'unknown if completed';
				}
			});
			dispatch(updateTransactionsData(localState.transactionsData));
		}
	};
}

export function loadLoginAccount() {
	return (dispatch, getState) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		const { env } = getState();

		AugurJS.loadLoginAccount(env, (err, loginAccount) => {
			let localLoginAccount = loginAccount;

			if (err) {
				return console.error('ERR loadLoginAccount():', err);
			}

			if (!localLoginAccount && localStorageRef && localStorageRef.getItem) {
				const account = localStorageRef.getItem('account');
				if (account !== null)	localLoginAccount = JSON.parse(account);
			}

			dispatch(loadLoginAccountLocalStorage(localLoginAccount.id));

			if (!localLoginAccount || !localLoginAccount.id) {
				return;
			}

			dispatch(updateLoginAccount(localLoginAccount));
			dispatch(loadLoginAccountDependents());
			return;
		});
	};
}
