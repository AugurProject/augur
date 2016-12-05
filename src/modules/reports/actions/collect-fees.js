import { formatEther, formatRep } from '../../../utils/format-number';
import { abi, augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';
import { updateExistingTransaction } from '../../transactions/actions/update-existing-transaction';

export function collectFees(cb) {
	return (dispatch, getState) => {
		const callback = cb || ((e) => e && console.log('collectFees:', e));
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
				const { loginAccount } = getState();
				const initialRepBalance = loginAccount.rep;
				const initialEthBalance = loginAccount.ether;
				let repMessage;
				let ethMessage;
				dispatch(updateAssets((err, balances) => {
					console.log('update assets:', balances);
					if (err) return callback(err);
					if (balances.rep) {
						const changeRep = abi.bignum(balances.rep).minus(initialRepBalance);
						repMessage = `${formatRep(changeRep).full}`;
					} else if (balances.ether) {
						const changeEth = abi.bignum(balances.ether).minus(initialEthBalance);
						ethMessage = `${formatEther(changeEth).full}`;
					}
					if (repMessage && ethMessage) {
						dispatch(updateExistingTransaction(res.hash, {
							message: `${repMessage} and ${ethMessage}`
						}));
					}
				}));
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
