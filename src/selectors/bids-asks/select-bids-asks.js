import { makeNumber } from '../../utils/make-number';

export default function selectOrderBook() {
	return {
		bids: [
			{
				shares: makeNumber(10, 'Shares'),
				price: makeNumber(0.5, 'eth')
			},
			{
				shares: makeNumber(20, 'Shares'),
				price: makeNumber(0.45, 'eth')
			},
			{
				shares: makeNumber(30, 'Shares'),
				price: makeNumber(0.35, 'eth')
			},
			{
				shares: makeNumber(40, 'Shares'),
				price: makeNumber(0.25, 'eth')
			}
		],
		asks: [
			{
				shares: makeNumber(10, 'Shares'),
				price: makeNumber(0.6, 'eth')
			},
			{
				shares: makeNumber(20, 'Shares'),
				price: makeNumber(0.7, 'eth')
			},
			{
				shares: makeNumber(30, 'Shares'),
				price: makeNumber(0.8, 'eth')
			},
			{
				shares: makeNumber(40, 'Shares'),
				price: makeNumber(0.9, 'eth')
			}
		]
	};
}
