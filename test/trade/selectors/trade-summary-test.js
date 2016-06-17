import {
	assert
} from 'chai';
import {
	selectTradeSummary
} from '../../../src/modules/trade/selectors/trade-summary';

describe(`modules/trade/selectors/trade-summary.js`, () => {
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

	it(`should select trade summary correctly`, () => {
		const out = { totalShares:
   { value: -586,
     formattedValue: -586,
     formatted: '-586.00',
     roundedValue: -586,
     rounded: '-586',
     minimized: '-586.00',
     denomination: 'Shares',
     full: '-586.00Shares' },
  totalEther:
   { value: 5670,
     formattedValue: 5670,
     formatted: '+5670.00',
     roundedValue: 5670,
     rounded: '+5670.0',
     minimized: '+5670.00',
     denomination: 'Eth',
     full: '+5670.00Eth' },
  totalGas:
   { value: 101300,
     formattedValue: 101300,
     formatted: '+101300.00',
     roundedValue: 101300,
     rounded: '+101300.0',
     minimized: '+101300.00',
     denomination: 'Eth',
     full: '+101300.00Eth' },
  tradeOrders };
		console.log(selectTradeSummary(tradeOrders));
		console.log(tradeOrders);
		assert.deepEqual(selectTradeSummary(tradeOrders), out, `Didn't produce the correct trade summary info`);
	});
});
