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

	return {
		...loginAccount,
		prettySecureLoginID,
		prettyAddress,
		editName: (name) => dispatch(changeAccountName(name)),
		linkText: loginAccount.name || prettySecureLoginID || prettyAddress,
		rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 0 }),
		ether: formatEther(loginAccount.ether, { zeroStyled: false, decimalsRounded: 0 }),
		realEther: formatEther(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 0 })
	};
};
