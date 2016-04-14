import { formatNone } from '../../../utils/format-number';

import store from '../../../store';

export default function() {
	var { loginAccount } = store.getState();
	return {
		rep: formatNone(),
		ether: formatNone(),
		realEther: formatNone(),
		...loginAccount
	};
}