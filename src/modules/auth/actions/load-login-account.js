import * as AugurJS from '../../../services/augurjs';
import { loadAccountTrades } from '../../../modules/my-positions/actions/load-account-trades';
import { loadBidsAsksHistory } from '../../../modules/bids-asks/actions/load-bids-asks-history';
import { loadCreateMarketHistory } from '../../../modules/create-market/actions/load-create-market-history';
import { loadFundingHistory, loadTransferHistory } from '../../../modules/account/actions/load-funding-history';
import { loadReportingHistory } from '../../../modules/my-reports/actions/load-reporting-history';
import { syncBranch } from '../../../modules/app/actions/update-branch';
import { loadEventsWithSubmittedReport } from '../../../modules/my-reports/actions/load-events-with-submitted-report';
import { updateReports, clearReports } from '../../../modules/reports/actions/update-reports';
import { updateLoginAccount } from '../../../modules/auth/actions/update-login-account';
import { updateAssets } from '../../../modules/auth/actions/update-assets';
import { updateFavorites } from '../../../modules/markets/actions/update-favorites';
import updateUserLoginMessageVersionRead from '../../../modules/login-message/actions/update-user-login-message-version-read';
import { updateAccountSettings } from '../../../modules/auth/actions/update-account-settings';
import { updateScalarMarketShareDenomination } from '../../../modules/market/actions/update-scalar-market-share-denomination';

export function loadLoginAccountDependents(cb) {
	return (dispatch, getState) => {
		const { loginAccount } = getState();
		AugurJS.augur.getRegisterBlockNumber(loginAccount.address, (err, blockNumber) => {
			if (!err && blockNumber) {
				loginAccount.registerBlockNumber = blockNumber;
				dispatch(updateLoginAccount(loginAccount));
			}
			dispatch(updateAssets(cb));

			dispatch(loadAccountTrades());
			dispatch(loadBidsAsksHistory());
			dispatch(loadFundingHistory());
			dispatch(loadTransferHistory());
			dispatch(loadCreateMarketHistory());

			// clear and load reports for any markets that have been loaded
			// (partly to handle signing out of one account and into another)
			dispatch(clearReports());
			dispatch(loadReportingHistory());
			dispatch(loadEventsWithSubmittedReport());
			dispatch(syncBranch((err) => {
				if (err) console.error('syncBranch:', err);
			}));
		});
	};
}

export function loadLoginAccountLocalStorage(accountID) {
	return (dispatch) => {
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
		if (localState.scalarMarketsShareDenomination) {
			Object.keys(localState.scalarMarketsShareDenomination).forEach((marketID) => {
				dispatch(updateScalarMarketShareDenomination(marketID, localState.scalarMarketsShareDenomination[marketID]));
			});
		}
		if (localState.reports && Object.keys(localState.reports).length) {
			dispatch(updateReports(localState.reports));
		}
		if (localState.settings) {
			dispatch(updateAccountSettings(localState.settings));
		}

		if (localState.loginMessageVersionRead && !isNaN(parseInt(localState.loginMessageVersionRead, 10))) {
			dispatch(updateUserLoginMessageVersionRead(parseInt(localState.loginMessageVersionRead, 10)));
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
				if (account !== null) {
					localLoginAccount = JSON.parse(account);
				}
			}

			if (!localLoginAccount || !localLoginAccount.address) {
				return;
			}
			localLoginAccount.onUpdateAccountSettings = settings => dispatch(updateAccountSettings(settings));

			dispatch(loadLoginAccountLocalStorage(localLoginAccount.address));
			dispatch(updateLoginAccount(localLoginAccount));
			dispatch(loadLoginAccountDependents());

		});
	};
}
