import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';
import { updateEnv } from '../../app/actions/update-env';
import { updateConnectionStatus } from '../../app/actions/update-connection';
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
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4 && xhttp.status === 200) {
				const env = JSON.parse(xhttp.responseText);
				dispatch(updateEnv(env));
				AugurJS.connect(env, (err, connected) => {
					if (err) return console.error('connect failure:', err);
					dispatch(updateConnectionStatus(connected));
					dispatch(registerTransactionRelay());
					dispatch(loadChatMessages('augur'));
					dispatch(loadLoginAccount());
					if (env.reportingTest) {
						dispatch(reportingTestSetup(env.branchID));
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
