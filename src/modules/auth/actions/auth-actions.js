import * as AugurJS from '../../../services/augurjs';

import { REGISTER } from '../../auth/constants/auth-types';
import { PASSWORDS_DO_NOT_MATCH, PASSWORD_TOO_SHORT, USERNAME_REQUIRED } from '../../auth/constants/form-errors';

import { PENDING, SUCCESS, FAILED } from '../../transactions/constants/statuses';
import { BRANCH_ID } from '../../app/constants/network';

import * as TransactionsActions from '../../transactions/actions/transactions-actions';
import * as PositionsActions from '../../positions/actions/positions-actions';
import * as ReportsActions from '../../reports/actions/reports-actions';

export const UPDATE_LOGIN_ACCOUNT = 'UPDATE_LOGIN_ACCOUNT';
export const CLEAR_LOGIN_ACCOUNT = 'CLEAR_LOGIN_ACCOUNT';

export const AUTH_ERROR = 'AUTH_ERROR';

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
		var { recentlyExpiredEvents } = getState(),
			recentlyExpiredEventsKeys = Object.keys(recentlyExpiredEvents);

		dispatch(PositionsActions.loadMeanTradePrices());
		dispatch(updateAssets());
		dispatch(PositionsActions.loadAccountTrades());

		if (recentlyExpiredEventsKeys.length) {
			dispatch(ReportsActions.loadPendingReports(recentlyExpiredEventsKeys));
		}
	};
}

export function updateLoginAccount(loginAccount) {
	return { type: UPDATE_LOGIN_ACCOUNT, data: loginAccount };
}

export function updateAssets() {
	return (dispatch, getState) => {
		var { loginAccount } = getState();
		if (!loginAccount.id) {
			return dispatch(updateLoginAccount({ ether: undefined, realEther: undefined, rep: undefined }));
		}
		AugurJS.loadAssets(BRANCH_ID, loginAccount.id,
			(err, ether) => {
				var { loginAccount } = getState();
				if (err) {
					console.info('!! ERROR updateAssets() ether', err);
					return;
				}

				if (!loginAccount.ether || loginAccount.ether.value !==  ether) {
					return dispatch(updateLoginAccount({ ether }));
				}
			},
			(err, rep) => {
				if (err) {
					console.info('!! ERROR updateAssets() rep', err);
					return;
				}
				if (!loginAccount.rep || loginAccount.rep.value !== rep) {
					return dispatch(updateLoginAccount({ rep }));
				}
			},
			(err, realEther) => {
				if (err) {
					console.info('!! ERROR updateAssets() real-ether', realEther);
					return;
				}

				if (!loginAccount.realEther || loginAccount.realEther.value !== realEther) {
					return dispatch(updateLoginAccount({ realEther }));
				}
			});
	};
}

export function login(username, password) {
	return (dispatch, getState) => {
		var { links } = require('../../../selectors');
		AugurJS.login(username, password, true, (err, loginAccount) => {
			if (err) {
				return dispatch(authError(err));
			}
			dispatch(updateLoginAccount(loginAccount));
			dispatch(loadLoginAccountDependents());
			links.marketsLink.onClick();
			return;
		});
	};
}

export function register(username, password, password2) {
	return (dispatch, getState) => {
		var { links } = require('../../../selectors'),
			transactionID = Date.now() + window.performance.now() * 1000,
			numAssetsLoaded = -1;

		if (!username || !username.length) {
			return dispatch(authError({ code: USERNAME_REQUIRED }));
		}

		if (password !== password2) {
			return dispatch(authError({ code: PASSWORDS_DO_NOT_MATCH }));
		}

		AugurJS.register(username, password, true, (err, loginAccount) => {
			if (err) {
				if (numAssetsLoaded === -1) {
					dispatch(authError(err));
				}
				else {
					dispatch(TransactionsActions.updateTransactions({ [transactionID]: { status: FAILED, message: err.message } }));
				}
				return;
			}
			numAssetsLoaded++;
			links.marketsLink.onClick();
			dispatch(TransactionsActions.updateTransactions(makeTransactionUpdate()));
			dispatch(updateLoginAccount(loginAccount));

		}, (res) => {
			numAssetsLoaded++;
			dispatch(updateAssets());
			dispatch(TransactionsActions.updateTransactions(makeTransactionUpdate()));
		});

		function makeTransactionUpdate() {
			var transactionObj = {};

			transactionObj.type = REGISTER;

			if (numAssetsLoaded < 3) {
				transactionObj.status = 'loading beta ether & rep...';
			}
			else {
				transactionObj.status = SUCCESS;
			}

			return {
				[transactionID]: transactionObj
			};
		}
	};
}

export function authError(err) { return { type: AUTH_ERROR, err }; }

export function logout() {
	return (dispatch, getState) => {
		AugurJS.logout();
		dispatch({ type: CLEAR_LOGIN_ACCOUNT });
	};
}