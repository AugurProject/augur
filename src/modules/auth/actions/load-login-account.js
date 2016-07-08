import * as AugurJS from '../../../services/augurjs';

import { SUCCESS, FAILED, PENDING, INTERRUPTED } from '../../transactions/constants/statuses';

import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadAccountTrades } from '../../positions/actions/load-account-trades';
import { loadReports } from '../../reports/actions/load-reports';
import { clearReports } from '../../reports/actions/update-reports';
import { updateFavorites } from '../../markets/actions/update-favorites';
import { updateAccountTradesData } from '../../positions/actions/update-account-trades-data';
import { updateTransactionsData } from '../../transactions/actions/update-transactions-data';

// import { commitReports } from '../../reports/actions/commit-reports';
import { penalizeWrongReports } from '../../reports/actions/penalize-wrong-reports';
import { collectFees } from '../../reports/actions/collect-fees';
import { closeMarkets } from '../../reports/actions/close-markets';

export function loadLoginAccountDependents() {
	return (dispatch, getState) => {
		const { marketsData } = getState();

		// dispatch(loadMeanTradePrices());
		dispatch(updateAssets());
		dispatch(loadAccountTrades());
		console.log('in loadLoginAccountDependents, updateAssets and LoadAccountTrades have been called');
		// clear and load reports for any markets that have been loaded
		// (partly to handle signing out of one account and into another)
		dispatch(clearReports());
		console.log('clear reports called in loadLoginAccountDependents');
		dispatch(loadReports(marketsData));
		console.log('load Reports called in loadLoginAccountDependents');

		// dispatch(commitReports());
		// dispatch(collectFees());
		// console.log('collectFees() called.');
		dispatch(penalizeWrongReports(marketsData));
		console.log('penalized Wrong Reports called');
		dispatch(closeMarkets(marketsData));
		console.log('leaving loadLoginAccountDependents');
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
				if ([SUCCESS, FAILED, PENDING, INTERRUPTED]
						.indexOf(localState.transactionsData[key].status) < 0) {
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
		AugurJS.loadLoginAccount((err, loginAccount) => {
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
