import { makeNumber } from '../utils/make-number';
import { randomNum } from '../../src/utils/random-number';
import { M } from '../modules/site/constants/views';

export default [
	{
		id: '123',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[0], url: '/m/0' })
		},
		description: 'will there be a referendum on may 1?',
		myPositionsSummary: {
			unrealizedNet: makeNumber(randomNum(), ' ETH'),
			realizedNet: makeNumber(randomNum(), ' ETH'),
			totalNet: makeNumber(randomNum(), ' ETH')
		},
		myPositionOutcomes: [
			{
				id: 1,
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					realizedNet: makeNumber(randomNum(900), ' ETH'),
					unrealizedNet: makeNumber(randomNum(100), ' ETH'),
					totalNet: makeNumber(randomNum(), ' ETH')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					realizedNet: makeNumber(randomNum(900), ' ETH'),
					unrealizedNet: makeNumber(randomNum(100), ' ETH'),
					totalNet: makeNumber(randomNum(), ' ETH')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			}
		]
	},
	{
		id: '234',
		marketLink: {
			text: 'Market',
			className: 'portfolio-row-link',
			onClick: () => require('../selectors').update({ activeView: M, market: require('../selectors').markets[1], url: '/m/1' })
		},
		description: 'Yoooooooooooooo, sup guy?',
		myPositionsSummary: {
			unrealizedNet: makeNumber(randomNum(), ' ETH'),
			realizedNet: makeNumber(randomNum(), ' ETH'),
			totalNet: makeNumber(randomNum(), ' ETH')
		},
		myPositionOutcomes: [
			{
				id: 1,
				name: 'outcome 1',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					realizedNet: makeNumber(randomNum(900), ' ETH'),
					unrealizedNet: makeNumber(randomNum(100), ' ETH'),
					totalNet: makeNumber(randomNum(), ' ETH')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			},
			{
				id: 2,
				name: 'outcome 2',
				position: {
					numPositions: makeNumber(randomNum(), 'Positions', true),
					qtyShares: makeNumber(randomNum(50), 'shares'),
					purchasePrice: makeNumber(randomNum(1), ' ETH'),
					realizedNet: makeNumber(randomNum(900), ' ETH'),
					unrealizedNet: makeNumber(randomNum(100), ' ETH'),
					totalNet: makeNumber(randomNum(), ' ETH')
				},
				lastPrice: makeNumber(randomNum(1), ' ETH')
			}
		]
	}
];
