function randomShares(n) { return (n * Math.random()).toString(); }

export default [{
	id: '123',
	outcomes: [{
		id: '1',
		shares: randomShares(10)
	}, {
		id: '2',
		shares: randomShares(1)
	}]
}, {
	id: '456',
	outcomes: [{
		id: '1',
		shares: randomShares(10)
	}, {
		id: '2',
		shares: '0'
	},
	{
		id: '3',
		shares: '0'
	},
	{
		id: '4',
		shares: randomShares(100)
	},
	{
		id: '5',
		shares: randomShares(10)
	},
	{
		id: '6',
		shares: randomShares(10)
	}]
}];
