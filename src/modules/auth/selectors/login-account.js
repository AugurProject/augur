import { formatNone } from '../../../utils/format-number';

import store from '../../../store';

export default function() {
	var { loginAccount } = store.getState();
	return {
		...loginAccount,
		rep: loginAccount.rep && loginAccount.rep.formattedValue && loginAccount.rep.formattedValue !== 0 && loginAccount.rep || formatNone(),
		ether: loginAccount.ether && loginAccount.ether.formattedValue && loginAccount.ether.formattedValue !== 0 && loginAccount.ether || formatNone(),
		realEther: loginAccount.realEther && loginAccount.realEther.formattedValue && loginAccount.realEther.formattedValue !== 0 && loginAccount.realEther || formatNone()
	};
}