import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function collectFees() {
	return (dispatch, getState) => {
		const { blockchain, branch, loginAccount } = getState();
		if (blockchain.isReportConfirmationPhase) {
			augur.collectFees({
				branch: branch.id,
				sender: loginAccount.id,
				periodLength: branch.periodLength,
				onSent: (res) => {
					console.log('collectFees sent:', res);
				},
				onSuccess: (res) => {
					console.log('collectFees success:', res.callReturn);
					dispatch(updateAssets());
				},
				onFailed: (err) => {
					console.error('collectFees failed:', err);
				}
			});
		}
	};
}
