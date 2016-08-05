import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { updateEnv } from '../../app/actions/update-env';
import { updateConnectionStatus } from '../../app/actions/update-connection';
import { loadLoginAccount } from '../../auth/actions/load-login-account';
import { loadBranch } from '../../app/actions/load-branch';

// for testing only
import { reportify } from '../../reports/actions/reportify';

export function initAugur() {
	return (dispatch, getState) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4 && xhttp.status === 200) {
				dispatch(updateEnv(JSON.parse(xhttp.responseText)));
				AugurJS.connect(getState().env, (err, connected) => {
					if (err) return console.error('connect failure:', err);

					dispatch(updateConnectionStatus(connected));
					dispatch(loadLoginAccount());
					dispatch(loadBranch(BRANCH_ID));

					// for testing only
					dispatch(reportify());
				});
			}
		};
		xhttp.open('GET', '/env.json', true);
		xhttp.send();
	};
}
