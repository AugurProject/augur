import { formatRep, formatEther } from '../../../utils/format-number';
import store from '../../../store';

export default function () {
	const { loginAccount } = store.getState();
	return {
		...loginAccount,
		rep: formatRep(loginAccount.rep || 0, { zero: true, decimalsRounded: 0 }),
		ether: formatEther(loginAccount.ether || 0, { zero: true, decimalsRounded: 0 }),
		realEther: formatEther(loginAccount.realEther || 0, { zero: true, decimalsRounded: 0 })
	};
}
