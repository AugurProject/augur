import { assert } from 'chai';
import { selectTradeSummary } from '../../../src/modules/trade/selectors/trade-summary';
import { assertions } from 'augur-ui-react-components';

describe(`modules/trade/selectors/trade-summary.js`, () => {
	let tradeSummary;

	const tradeOrders = [{
		shares: {
			value: 5
		},
		ether: {
			value: 500
		},
		gas: {
			value: 1000
		}
	}, {
		shares: {
			value: 1
		},
		ether: {
			value: 50
		},
		gas: {
			value: 100
		}
	}, {
		shares: {
			value: 80
		},
		ether: {
			value: 120
		},
		gas: {
			value: 200
		}
	}, {
		shares: {
			value: 500
		},
		ether: {
			value: 5000
		},
		gas: {
			value: 100000
		}
	}];

	before(() => {
		tradeSummary = selectTradeSummary(tradeOrders);
	});

	it(`should select trade summary correctly`, () => {
		const out = {
			totalShares: {
				value: -586,
				formattedValue: -586,
				formatted: '-586',
				roundedValue: -586,
				rounded: '-586',
				minimized: '-586',
				denomination: 'shares',
				full: '-586shares'
			},
			totalFee: {
				denomination: "eth",
				formatted: "0.00",
				formattedValue: 0,
				full: "0.00eth",
				minimized: "0",
				rounded: "0.0",
				roundedValue: 0,
				value: 0
			},
			totalEth: {
				value: 5670,
				formattedValue: 5670,
				formatted: '+5,670.00',
				roundedValue: 5670,
				rounded: '+5,670.0',
				minimized: '+5,670',
				denomination: 'eth',
				full: '+5,670.00eth'
			},
			totalGas: {
				value: 101300,
				formattedValue: 101300,
				formatted: '+101,300.00',
				roundedValue: 101300,
				rounded: '+101,300.0',
				minimized: '+101,300',
				denomination: 'eth',
				full: '+101,300.00eth'
			},
			tradeOrders
		};
		assert.deepEqual(tradeSummary, out, `Didn't produce the correct trade summary info`);
	});
});
