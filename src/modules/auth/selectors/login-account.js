import memoizerific from 'memoizerific';

import { formatRep, formatEther } from '../../../utils/format-number';
import store from '../../../store';
import { changeAccountName } from '../../auth/actions/change-account-name';
import { transferFunds } from '../../auth/actions/transfer-funds';

export default function () {
	const { loginAccount } = store.getState();
	return setupLoginAccount(loginAccount, store.dispatch);
}

export const setupLoginAccount = memoizerific(1)((loginAccount, dispatch) => {
	const cleanAddress = loginAccount.address ? loginAccount.address.replace('0x', '') : undefined;

	const prettyAddress = cleanAddress ? `${cleanAddress.substring(0, 4)}...${cleanAddress.substring(cleanAddress.length - 4)}` : undefined;

	const prettyLoginID = loginAccount.loginID ? `${loginAccount.loginID.substring(0, 4)}...${loginAccount.loginID.substring(loginAccount.loginID.length - 4)}` : undefined;

	// if loginID is not defined it must be a local geth node account, otherwise it's a hosted node.
	const localNode = !loginAccount.loginID;

	const linkText = localNode ? prettyAddress : loginAccount.name || prettyLoginID;

	const date = new Date()
		.toISOString()
		.split(':')
		.join('-');
	const downloadAccountFileName = `UTC--${date}--${loginAccount.address}`;
	const accountData = encodeURIComponent(JSON.stringify({
		...loginAccount.keystore
	}));
	const downloadAccountDataString = `data:,${accountData}`;

	if (loginAccount.airbitzAccount) {
		loginAccount.onAirbitzManageAccount = () => {
			require('../../../selectors').abc.openManageWindow(loginAccount.airbitzAccount, (result, account) => {
				// Possibly update the loginAccount
			});
		};
	}

	return {
		...loginAccount,
		prettyLoginID,
		prettyAddress,
		localNode,
		linkText,
		downloadAccountFileName,
		downloadAccountDataString,
		transferFunds: (amount, currency, toAddress) => dispatch(transferFunds(amount, currency, toAddress)),
		editName: name => dispatch(changeAccountName(name)),
		rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 1 }),
		ether: formatEther(loginAccount.ether, { zeroStyled: false, decimalsRounded: 2 }),
		realEther: formatEther(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 2 })
	};
});
