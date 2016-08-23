import { makeNumber } from '../../utils/make-number';

export default function selectOrderBook() {
	return {
		bids: [
			{
				shares: makeNumber(776, 'Shares'),
				price: makeNumber(0.5, ' ETH'),
				isOfCurrentUser: true
			},
			{
				shares: makeNumber(87, 'Shares'),
				price: makeNumber(0.45, ' ETH')
			},
			{
				shares: makeNumber(2.22, 'Shares'),
				price: makeNumber(0.35, ' ETH')
			},
			{
				shares: makeNumber(6544.43, 'Shares'),
				price: makeNumber(0.25, ' ETH')
			}
		],
		asks: [
			{
				shares: makeNumber(180, 'Shares'),
				price: makeNumber(0.63, ' ETH')
			},
			{
				shares: makeNumber(2000, 'Shares'),
				price: makeNumber(0.72, ' ETH'),
				isOfCurrentUser: Math.random() > 0.3
			},
			{
				shares: makeNumber(5, 'Shares'),
				price: makeNumber(0.82, ' ETH')
			},
			{
				shares: makeNumber(888, 'Shares'),
				price: makeNumber(0.99, ' ETH')
			}
		]
	};
}
