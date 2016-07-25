import { formatRep, formatEther } from '../../../utils/format-number';
import store from '../../../store';
import { changeAccountName } from '../../auth/actions/change-account-name';

export default function () {
	const { loginAccount } = store.getState();
	return setupLoginAccount(loginAccount, store.dispatch);
}

export const setupLoginAccount = (loginAccount, dispatch) => {
	const prettyAddress = loginAccount.id ? `${loginAccount.id.substring(0, 4)}...${loginAccount.id.substring(loginAccount.id.length - 4)}` : undefined;

	const prettySecureLoginID = loginAccount.secureLoginID ? `${loginAccount.secureLoginID.substring(0, 4)}...${loginAccount.secureLoginID.substring(loginAccount.secureLoginID.length - 4)}` : undefined;

	// if secureLoginID is not defined it must be a local geth node account, otherwise it's a hosted node.
	const localNode = !loginAccount.secureLoginID;

	const linkText = localNode ? prettyAddress : loginAccount.name || prettySecureLoginID;

	const downloadAccount = () => {
		const theDocument = typeof document !== 'undefined' && document;
		const link = theDocument.createElement('a');
		const date = new Date()
			.toISOString()
			.split(':')
			.join('-');
		const filename = `UTC--${date}--${loginAccount.address}`;
		const accountData = encodeURIComponent(JSON.stringify({
			...loginAccount.keystore
		}));
		const accountFile = `data:text/json;charset=utf-8,${accountData}`;
		link.download = filename;
		link.href = accountFile;
		link.click();
	};

	return {
		...loginAccount,
		prettySecureLoginID,
		prettyAddress,
		localNode,
		linkText,
		editName: (name) => dispatch(changeAccountName(name)),
		downloadAccount: () => downloadAccount(),
		rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 0 }),
		ether: formatEther(loginAccount.ether, { zeroStyled: false, decimalsRounded: 0 }),
		realEther: formatEther(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 0 })
	};
};
