import secureRandom from 'secure-random';
import { abi, augur, constants } from '../../../services/augurjs';
import { AIRBITZ_WALLET_TYPE } from '../../auth/constants/auth-types';
import {
	loadLoginAccountDependents,
	loadLoginAccountLocalStorage
} from '../../auth/actions/load-login-account';
import { updateLoginAccount } from '../../auth/actions/update-login-account';
import { updateAssets } from '../../auth/actions/update-assets';
import { addFundNewAccount } from '../../transactions/actions/add-fund-new-account-transaction';
import { authError } from '../../auth/actions/auth-error';

export function loginWithEthereumWallet(airbitzAccount, ethereumWallet, isNewAccount) {
	return (dispatch, getState) => {
		const { links } = require('../../../selectors');

		const masterPrivateKey = ethereumWallet.keys.ethereumKey;
		augur.web.loginWithMasterKey(airbitzAccount.username, masterPrivateKey, (account) => {
			console.log('loginWithMasterKey:', account);
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
				if (!balances.ether || abi.bignum(balances.ether).eq(constants.ZERO)) {
					if (isNewAccount) {
						dispatch(addFundNewAccount(loginAccount.address));
					} else {
						augur.fundNewAccount(getState().branch.id, augur.utils.noop, () => dispatch(updateAssets()), e => console.error(e));
					}
				}
			}));
			if (links && links.marketsLink)	{
				links.marketsLink.onClick(links.marketsLink.href);
			}
		});
	};
}

export function loginWithAirbitz(airbitzAccount) {
	return (dispatch, getState) => {
		const ethereumWallet = airbitzAccount.getFirstWallet(AIRBITZ_WALLET_TYPE);

		// Create an ethereum wallet if one doesn't exist
		if (ethereumWallet == null) {
			const keys = {
				ethereumKey: new Buffer(secureRandom(32)).toString('hex')
			};
			airbitzAccount.createWallet(AIRBITZ_WALLET_TYPE, keys, (err, id) => {
				if (err) return dispatch(authError({ code: 0, message: 'could not create wallet' }));
				dispatch(loginWithEthereumWallet(airbitzAccount, airbitzAccount.getWallet(id)));
			});

		} else {
			dispatch(loginWithEthereumWallet(airbitzAccount, ethereumWallet));
		}
	};
}
