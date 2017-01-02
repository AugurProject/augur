import { augur, accounts, utils } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function fundNewAccount(cb) {
	return (dispatch, getState) => {
		const callback = cb || (e => console.log('fundNewAccount:', e));
		const { env, branch, loginAccount } = getState();
		if (env.fundNewAccountFromAddress && env.fundNewAccountFromAddress.amount) {
			const fromAddress = env.fundNewAccountFromAddress.address || augur.from;
			const amount = env.fundNewAccountFromAddress.amount;
			accounts.fundNewAccountFromAddress(fromAddress, amount, loginAccount.address, branch.id, utils.noop, (r) => {
				console.log('fundNewAccount success:', r);
				dispatch(updateAssets());
				callback(null);
			}, e => callback(e));
		} else {
			accounts.fundNewAccountFromFaucet(loginAccount.address, branch.id, utils.noop, (r) => {
				console.log('fundNewAccount success:', r);
				dispatch(updateAssets());
				callback(null);
			}, e => callback(e));
		}
	};
}
