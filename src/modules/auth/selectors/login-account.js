import { formatRep, formatEther } from '../../../utils/format-number';
import store from '../../../store';

export default function () {
	const { loginAccount } = store.getState();
	const prettySecureLoginID = loginAccount.secureLoginID ?  `${loginAccount.secureLoginID.substring(0, 4)}...${loginAccount.secureLoginID.substring(loginAccount.secureLoginID.length - 4)}` : undefined;
	return {
		...loginAccount,
		prettySecureLoginID,
		linkText: loginAccount.name || prettySecureLoginID,
		rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 0 }),
		ether: formatEther(loginAccount.ether, { zeroStyled: false, decimalsRounded: 0 }),
		realEther: formatEther(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 0 })
	};
}
