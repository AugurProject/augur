import secureRandom from 'secure-random';
import { augur } from '../../../services/augurjs';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { authError } from '../../auth/actions/auth-error';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';

const walletType = 'wallet:repo:ethereum';

function loginWithEthereumWallet(dispatch, airbitzAccount, ethereumWallet) {
	const { links } = require('../../../selectors');

	const masterPrivateKey = ethereumWallet.keys.ethereumKey;
	augur.web.loginWithMasterKey(airbitzAccount.username, masterPrivateKey, (account) => {
		console.log(account);
		if (!account) {
			return dispatch(authError({ code: 0, message: 'failed to login' }));
		} else if (account.error) {
			return dispatch(authError({ code: account.error, message: account.message }));
		}
		const loginAccount = { ...account, airbitzAccount };
		if (!loginAccount || !loginAccount.address) {
			return;
		}
		dispatch(loadLoginAccountLocalStorage(loginAccount.address));
		dispatch(updateLoginAccount(loginAccount));
		dispatch(loadLoginAccountDependents((err, balances) => {
			if (err || !balances) {
				return console.error('loadLoginAccountDependents:', err);
			}
			if (balances.ether === '0') {
				dispatch(addFundNewAccount(loginAccount.address));
			}
		}));
		if (links && links.marketsLink)	{
			links.marketsLink.onClick(links.marketsLink.href);
		}
	});
}

export function loginWithAirbitz(airbitzAccount) {
	return (dispatch, getState) => {
		const ethereumWallet = airbitzAccount.getFirstWallet(walletType);
		if (ethereumWallet == null) {
			// Create an ethereum wallet if one doesn't exist:
			const keys = {
				ethereumKey: new Buffer(secureRandom(32)).toString('hex')
			};
			airbitzAccount.createWallet(walletType, keys, (err, id) => {
				if (err) return dispatch(authError({ code: 0, message: 'could not create wallet' }));
				loginWithEthereumWallet(dispatch, airbitzAccount, airbitzAccount.getWallet(id));
			});
		} else {
			loginWithEthereumWallet(dispatch, airbitzAccount, ethereumWallet);
		}
	};
}
