import { BUY, SELL } from '../../trade/constants/types';

export default function () {
	return {
		[BUY]: {
			label: BUY
		},
		[SELL]: {
			label: SELL
		}
	};
}
