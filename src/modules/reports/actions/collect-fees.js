import * as AugurJS from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function collectFees() {
	return (dispatch, getState) => {
		const { blockchain, branch } = getState();

		if (!blockchain.isReportConfirmationPhase) {
			return;
		}

		AugurJS.collectFees(branch.id, (err, res) => {
			console.log('collectFees result', err, res);
			dispatch(updateAssets());
		});
	};
}
