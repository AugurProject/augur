import * as AugurJS from '../../../services/augurjs';

import { BRANCH_ID } from '../../app/constants/network';

import { updateAssets } from '../../auth/actions/update-assets';

export function collectFees() {
	return function (dispatch, getState) {
		var { blockchain } = getState(),
			branchID = BRANCH_ID;

		if (!blockchain.isReportConfirmationPhase) {
			return;
		}

		AugurJS.collectFees(branchID, (err, res) => {
console.log('------> collectFees result', err, res);
			dispatch(updateAssets());
		});
	};
}