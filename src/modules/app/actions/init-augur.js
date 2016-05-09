import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { updateBranch } from '../../app/actions/update-branch';
import { updateBlockchain } from '../../app/actions/update-blockchain';
import { listenToUpdates } from '../../app/actions/listen-to-updates';
import { loadLoginAccount } from '../../auth/actions/load-login-account';
import { loadMarkets } from '../../markets/actions/load-markets';

export function initAugur() {
	return (dispatch, getState) => {
		AugurJS.connect(function (err, connected) {
			if (err) {
				return console.error('connect failure:', err);
			}

			dispatch(loadLoginAccount());

			AugurJS.loadBranch(BRANCH_ID, (err, branch) => {
				if (err) {
					return console.log('ERROR loadBranch', err);
				}

				dispatch(updateBranch(branch));

				dispatch(updateBlockchain(() => {
					dispatch(loadMarkets());
					dispatch(listenToUpdates());
				}));
			});
		});
	};
}
