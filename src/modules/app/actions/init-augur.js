import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { updateEnv } from '../../app/actions/update-env';
import { updateConnectionStatus } from '../../app/actions/update-connection';
import { updateBranch } from '../../app/actions/update-branch';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadLoginAccount } from '../../auth/actions/load-login-account';
import { loadMarkets } from '../../markets/actions/load-markets';
import { loadFullMarket } from '../../market/actions/load-full-market';

export function initAugur() {
	return (dispatch, getState) => {
		const xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState === 4 && xhttp.status === 200) {
				dispatch(updateEnv(JSON.parse(xhttp.responseText)));
				AugurJS.connect(getState().env, (err, connected) => {
					if (err) {
						return console.error('connect failure:', err);
					}

					dispatch(updateConnectionStatus(connected));
					dispatch(loadLoginAccount());

					AugurJS.loadBranch(BRANCH_ID, (error, branch) => {
						if (error) {
							return console.log('ERROR loadBranch', error);
						}

						dispatch(updateBranch(branch));

						dispatch(loadMarkets());

						const { selectedMarketID } = getState();
						if (selectedMarketID !== null) {
							dispatch(loadFullMarket(selectedMarketID));
						}

						dispatch(updateBlockchain(() => {
							dispatch(listenToUpdates());
						}));
					});
				});
			}
		};
		xhttp.open('GET', '/env.json', true);
		xhttp.send();
	};
}
