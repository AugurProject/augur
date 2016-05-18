import {
	assert
} from 'chai';
import * as selector from '../../../src/modules/positions/selectors/positions-summary';

describe(`modules/positions/selectors/positions-summary.js`, () => {
	let out, test;

	it(`should return a summary of positions`, () => {
		let numPositions = 100;
		let qtyShares = 500;
		let totalValue = 1000;
		let totalCost = 10000;
		let positions = 50;
		out = {
			numPositions: {
				value: 100,
				formattedValue: 100,
				formatted: '100',
				roundedValue: 100,
				rounded: '100',
				minimized: '100',
				denomination: 'Positions',
				full: '100Positions'
			},
			qtyShares: {
				value: 500,
				formattedValue: 500,
				formatted: '500',
				roundedValue: 500,
				rounded: '500',
				minimized: '500',
				denomination: 'Shares',
				full: '500Shares'
			},
			purchasePrice: {
				value: 20,
				formattedValue: 20,
				formatted: '+20.00',
				roundedValue: 20,
				rounded: '+20.0',
				minimized: '+20',
				denomination: 'Eth',
				full: '+20.00Eth'
			},
			totalValue: {
				value: 1000,
				formattedValue: 1000,
				formatted: '+1,000.00',
				roundedValue: 1000,
				rounded: '+1,000.0',
				minimized: '+1,000',
				denomination: 'Eth',
				full: '+1,000.00Eth'
			},
			totalCost: {
				value: 10000,
				formattedValue: 10000,
				formatted: '+10,000.00',
				roundedValue: 10000,
				rounded: '+10,000.0',
				minimized: '+10,000',
				denomination: 'Eth',
				full: '+10,000.00Eth'
			},
			shareChange: {
				value: -18,
				formattedValue: -18,
				formatted: '-18.00',
				roundedValue: -18,
				rounded: '-18.0',
				minimized: '-18',
				denomination: 'Eth',
				full: '-18.00Eth'
			},
			gainPercent: {
				value: -90,
				formattedValue: -90,
				formatted: '-90.0',
				roundedValue: -90,
				rounded: '-90',
				minimized: '-90',
				denomination: '%',
				full: '-90.0%'
			},
			netChange: {
				value: -9000,
				formattedValue: -9000,
				formatted: '-9,000.00',
				roundedValue: -9000,
				rounded: '-9,000.0',
				minimized: '-9,000',
				denomination: 'Eth',
				full: '-9,000.00Eth'
			},
			positions: 50
		};

		test = selector.selectPositionsSummary(numPositions, qtyShares, totalValue, totalCost, positions);

		assert.deepEqual(test, out, `Didn't produce the expected output`);
	});
});
