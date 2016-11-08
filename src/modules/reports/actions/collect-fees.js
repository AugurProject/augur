import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function collectFees() {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		if (branch.isReportRevealPhase) {
			augur.collectFees({
				branch: branch.id,
				sender: loginAccount.address,
				periodLength: branch.periodLength,
				onSent: (res) => {
					console.log('collectFees sent:', res);
				},
				onSuccess: (res) => {
					console.log('collectFees success:', res.callReturn);
					dispatch(updateAssets());
				},
				onFailed: (err) => {
					if (err.error === '-1') return console.info('collectFees:', err.message);
					console.error('collectFees failed:', err);
				}
			});
		}
	};
}
