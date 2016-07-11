import { BID, ASK } from '../../../modules/transactions/constants/types';

export default function () {
	return [
		{ value: BID, label: 'Buy' },
		{ value: ASK, label: 'Sell' }
	];
}
