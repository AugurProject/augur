import { formatRep, formatEther } from '../../../utils/format-number';


import store from '../../../store';

export default function() {
	var { loginAccount } = store.getState();
	return {
		...loginAccount,
		rep: formatRep(loginAccount.rep, { zero: true, decimalsRounded: 0 }),
		ether: formatEther(loginAccount.ether, { zero: true, decimalsRounded: 0 }),
		realEther: formatEther(loginAccount.realEther, { zero: true, decimalsRounded: 0 })
	};
}