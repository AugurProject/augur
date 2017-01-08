import { abi, augur } from '../../../services/augurjs';
import { updateAssets } from '../../auth/actions/update-assets';

export function transferFunds(amount, currency, toAddress) {
	return (dispatch, getState) => {
		const { branch, loginAccount } = getState();
		const fromAddress = loginAccount.address;
		const to = abi.format_address(toAddress);
		const onSent = r => console.log('transfer', currency, 'sent:', r);
		const onSuccess = (r) => {
			dispatch(updateAssets());
			console.log('transfer', currency, 'success:', r);
		};
		const onFailed = e => console.error('transfer', currency, 'failed:', e);
		switch (currency) {
			case 'ETH':
				return augur.sendCashFrom(to, amount, fromAddress, onSent, onSuccess, onFailed);
			case 'real ETH':
				return augur.sendEther(to, amount, fromAddress, onSent, onSuccess, onFailed);
			case 'REP':
				return augur.sendReputation(branch.id, to, amount, onSent, onSuccess, onFailed);
			default:
				console.error('transferFunds: unknown currency', currency);
		}
	};
}
