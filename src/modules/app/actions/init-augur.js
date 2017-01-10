import { augur, connect } from '../../../services/augurjs';
import { BRANCH_ID } from '../../app/constants/network';
import { updateEnv } from '../../app/actions/update-env';
import { updateConnectionStatus } from '../../app/actions/update-connection';
import { updateAssets } from '../../auth/actions/update-assets';
import { loadChatMessages } from '../../chat/actions/load-chat-messages';
import { loadLoginAccount } from '../../auth/actions/load-login-account';
import { loadBranch } from '../../app/actions/load-branch';
import { registerTransactionRelay } from '../../transactions/actions/register-transaction-relay';
import isCurrentLoginMessageRead from '../../login-message/helpers/is-current-login-message-read';
import isUserLoggedIn from '../../auth/helpers/is-user-logged-in';

// for testing only
import { reportingTestSetup } from '../../reports/actions/reporting-test-setup';

// fixes Reflect not being recognized in test or node 4.2
require('core-js/es6/reflect');

export function initAugur() {
	return (dispatch, getState) => {
		console.info(`Running Augur.js Version: ${AugurJS.augur.version}`);

		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4 && xhttp.status === 200) {
				const env = JSON.parse(xhttp.responseText);
				dispatch(updateEnv(env));
				connect(env, (err, connected) => {
					if (err) return console.error('connect failure:', err);
					dispatch(updateConnectionStatus(connected));
					dispatch(registerTransactionRelay());
					dispatch(loadChatMessages('augur'));
					dispatch(loadLoginAccount());
					if (env.reportingTest) {

						// 127.0.0.1 only: configure for follow-on (multi-user) reporting testing
						if (typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' && env.reportingTest === true) {
							augur.getBranches((branches) => {
								console.debug(window.location.hostname, branches[branches.length - 1]);
								env.branchID = branches[branches.length - 1];
								env.reportingTest = false;
								if (getState().loginAccount.address) {
									augur.fundNewAccount(env.branchID, augur.utils.noop, () => {
										dispatch(updateAssets());
										dispatch(loadBranch(env.branchID || BRANCH_ID));
										const { loginAccount, loginMessage } = getState();
										if (isUserLoggedIn(loginAccount) && !isCurrentLoginMessageRead(loginMessage)) {
											const { links } = require('../../../selectors');
											links.loginMessageLink.onClick();
										}
									}, e => console.error(e));
								} else {
									dispatch(loadBranch(env.branchID || BRANCH_ID));
								}
							});

						} else {
							dispatch(reportingTestSetup(env.branchID));
						}
					} else {
						dispatch(loadBranch(env.branchID || BRANCH_ID));
						const { loginAccount, loginMessage } = getState();
						if (isUserLoggedIn(loginAccount) && !isCurrentLoginMessageRead(loginMessage)) {
							const { links } = require('../../../selectors');
							links.loginMessageLink.onClick();
						}
					}
				});
			}
		};
		xhttp.open('GET', '/config/env.json', true);
		xhttp.send();
	};
}
