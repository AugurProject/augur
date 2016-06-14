import { BID, ASK } from '../../bids-asks/constants/bids-asks-types'
export default function () {
	return [
		{value: BID, label: 'Buy'},
		{value: ASK, label: 'Sell'}
	]
}