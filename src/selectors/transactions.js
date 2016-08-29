import { BINARY, CATEGORICAL, SCALAR } from '../modules/markets/constants/market-types';

export default [
	{
		type: 'buy',
		data: {
			marketID: '0xbbfac7f7ac337fab85d67bb8a3061413271c1bc68b1da47fa7cbb53031c78fc8',
			outcomeID: '7',
			marketType: CATEGORICAL,
			marketDescription: 'Which Jess coordinations clap Dwight Mission cube?',
			outcomeName: 'follow',
			numShares: {
				value: 100,
				formattedValue: 100,
				formatted: '100',
				roundedValue: 100,
				rounded: '100',
				minimized: '100',
				denomination: 'shares',
				full: '100shares'
			},
			avgPrice: {
				value: 0.36,
				formattedValue: 0.36,
				formatted: '0.36',
				roundedValue: 0.4,
				rounded: '0.4',
				minimized: '0.36',
				denomination: ' ETH',
				full: '0.36 ETH'
			}
		},
		status: 'processing buy...',
		message: 'buying 10 shares @ 0.67 ETH',
		id: '1385867-1469682892056'
	},
	{
		type: 'buy',
		data: {
			marketID: '0xbbfac7f7ac337fab85d67bb8a3061413271c1bc68b1da47fa7cbb53031c78fc8',
			outcomeID: '1',
			marketType: BINARY,
			marketDescription: 'Which Jess coordinations clap Dwight Mission cube?',
			outcomeName: 'blast',
			numShares: {
				value: 100,
				formattedValue: 100,
				formatted: '100',
				roundedValue: 100,
				rounded: '100',
				minimized: '100',
				denomination: 'shares',
				full: '100shares'
			},
			avgPrice: {
				value: 0.68,
				formattedValue: 0.68,
				formatted: '0.68',
				roundedValue: 0.7,
				rounded: '0.7',
				minimized: '0.68',
				denomination: ' ETH',
				full: '0.68 ETH'
			}
		},
		status: 'failed',
		id: '1385816-1469682185277',
		message: 'some dobble was turned up too far'
	},
	{
		type: 'buy',
		data: {
			marketID: '0x3dc3d2eab74ea5b8fea409c5fbb8240a6fa88b3387c26ebcb467911cb8653027',
			outcomeID: '1',
			marketType: SCALAR,
			marketDescription: 'Which political party\'s candidate will win the 2016 U.S. Presidential Election?',
			outcomeName: 'Democratic',
			numShares: {
				value: 100,
				formattedValue: 100,
				formatted: '100',
				roundedValue: 100,
				rounded: '100',
				minimized: '100',
				denomination: 'shares',
				full: '100shares'
			},
			avgPrice: {
				value: 0.01,
				formattedValue: 0.01,
				formatted: '0.01',
				roundedValue: 0,
				rounded: '0.0',
				minimized: '0.01',
				denomination: ' ETH',
				full: '0.01 ETH'
			}
		},
		status: 'interrupted',
		id: '1385720-1469680903926',
		message: 'unknown if completed'
	},
	{
		type: 'fund_account',
		address: '0xbf824e58631c5f8a8d3c2dca4dc1e5b99852ecd0',
		message: 'loaded free ether and rep',
		status: 'success',
		id: '1385715-1469680758488'
	}
];
