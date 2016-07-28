import * as AugurJS from '../../../services/augurjs';

import { SUCCESS, FAILED, INTERRUPTED } from '../../transactions/constants/statuses';

import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { loadReports } from '../../reports/actions/load-reports';
import { clearReports } from '../../reports/actions/update-reports';
import { updateFavorites } from '../../markets/actions/update-favorites';
import { updateAccountTradesData } from '../../positions/actions/update-account-trades-data';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';
import env from '../../../env.json';

// import { commitReports } from '../../reports/actions/commit-reports';
import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
// import { collectFees } from '../../reports/actions/collect-fees';
import { closeMarkets } from '../../reports/actions/close-markets';

export function loadLoginAccountDependents() {
	return (dispatch, getState) => {
		const { marketsData } = getState();

		// dispatch(loadMeanTradePrices());
		dispatch(updateAssets());
		dispatch(loadAccountTrades());
		// clear and load reports for any markets that have been loaded
		// (partly to handle signing out of one account and into another)
		dispatch(clearReports());
		dispatch(loadReports(marketsData));

		// dispatch(commitReports());
		// dispatch(collectFees());
		dispatch(penalizeWrongReports(marketsData));
		dispatch(closeMarkets(marketsData));
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
	return (dispatch) => {
		const localStorageRef = typeof window !== 'undefined' && window.localStorage;
		console.log('in load login, env:');
		console.log(env);
		AugurJS.loadLoginAccount(env, (err, loginAccount) => {
			let localLoginAccount = loginAccount;

			if (err) {
				return console.error('ERR loadLoginAccount():', err);
			}

			if (!localLoginAccount && localStorageRef && localStorageRef.getItem) {
				const account = localStorageRef.getItem('account');
				if (account !== null)	localLoginAccount = JSON.parse(account);
			}

			if (!localLoginAccount || !localLoginAccount.id) {
				return;
			}

			dispatch(loadLoginAccountLocalStorage(localLoginAccount.id));
			dispatch(updateLoginAccount(localLoginAccount));
			dispatch(loadLoginAccountDependents());
			return;
		});
	};
}
