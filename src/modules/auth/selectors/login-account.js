import { formatRep, formatEther } from '../../../utils/format-number';
import store from '../../../store';

export default function () {
	const { loginAccount } = store.getState();
	return {
		...loginAccount,
		rep: formatRep(loginAccount.rep, { zeroStyled: false, decimalsRounded: 0 }),
		ether: formatEther(loginAccount.ether, { zeroStyled: false, decimalsRounded: 0 }),
		realEther: formatEther(loginAccount.realEther, { zeroStyled: false, decimalsRounded: 0 })
	};
}
