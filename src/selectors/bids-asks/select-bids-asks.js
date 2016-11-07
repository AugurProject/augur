import makeNumber from 'utils/make-number';

function selectOrderBook() {
	return {
		bids: [
			{
				shares: makeNumber(776, ' shares'),
				price: makeNumber(0.5, ' ETH'),
				isOfCurrentUser: true
			},
			{
				shares: makeNumber(87, ' shares'),
				price: makeNumber(0.45, ' ETH')
			},
			{
				shares: makeNumber(2.22, ' shares'),
				price: makeNumber(0.35, ' ETH')
			},
			{
				shares: makeNumber(6544.43, ' shares'),
				price: makeNumber(0.25, ' ETH')
			},
			{
				shares: makeNumber(1234567.987654321, ' shares', null, true),
				price: makeNumber(0.123456789, ' ETH', null, true)
			}
		],
		asks: [
			{
				shares: makeNumber(10000000000, ' shares', null, true),
				price: makeNumber(0.9, ' ETH', null, true)
			},
			{
				shares: makeNumber(180, ' shares'),
				price: makeNumber(0.63, ' ETH')
			},
			{
				shares: makeNumber(2000, ' shares'),
				price: makeNumber(0.72, ' ETH'),
				isOfCurrentUser: Math.random() > 0.3
			},
			{
				shares: makeNumber(5, ' shares'),
				price: makeNumber(0.82, ' ETH')
			},
			{
				shares: makeNumber(888, ' shares'),
				price: makeNumber(0.99, ' ETH')
			}
		]
	};
}

export default selectOrderBook;
