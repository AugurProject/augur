import { makeNumber } from '../../utils/make-number';

export default function selectOrderBook() {
	return {
		bids: [
			{
				shares: makeNumber(10, 'Shares'),
				price: makeNumber(.5, 'eth')
			},
			{
				shares: makeNumber(20, 'Shares'),
				price: makeNumber(.45, 'eth')
			},
			{
				shares: makeNumber(30, 'Shares'),
				price: makeNumber(.35, 'eth')
			},
			{
				shares: makeNumber(40, 'Shares'),
				price: makeNumber(.25, 'eth')
			}
		],
		asks: [
			{
				shares: makeNumber(10, 'Shares'),
				price: makeNumber(.6, 'eth')
			},
			{
				shares: makeNumber(20, 'Shares'),
				price: makeNumber(.7, 'eth')
			},
			{
				shares: makeNumber(30, 'Shares'),
				price: makeNumber(.8, 'eth')
			},
			{
				shares: makeNumber(40, 'Shares'),
				price: makeNumber(.9, 'eth')
			}
		]
	};
}