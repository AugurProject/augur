import { augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function collectFees(cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => e && console.log('collectFees:', e));
		const { branch, loginAccount } = getState();
		if (!loginAccount.address || !branch.isReportRevealPhase) {
			return callback(null);
		}
		augur.collectFees({
			branch: branch.id,
			sender: loginAccount.address,
			periodLength: branch.periodLength,
			onSent: (res) => {
				console.log('collectFees sent:', res);
			},
			onSuccess: (res) => {
				console.log('collectFees success:', res.callReturn);
				if (res.callReturn === '1') dispatch(updateAssets());
				callback(null);
			},
			onFailed: (err) => {
				if (err.error === '-1') {
					console.info('collectFees:', err.message);
					return callback(null);
				}
				callback(err);
			}
		});
	};
}
