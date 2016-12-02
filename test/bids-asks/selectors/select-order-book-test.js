import { describe, it } from 'mocha';
import { assert } from 'chai';

import { formatShares, formatEther } from '../../../src/utils/format-number';

describe(`modules/bids-asks/helpers/select-order-book.js`, () => {
	const selectAggregateOrderBook = require('../../../src/modules/bids-asks/helpers/select-order-book').selectAggregateOrderBook;

	it(`should return empty order book for no orders`, () => {
		const orderBook = selectAggregateOrderBook('1', null, {});

		assert.isArray(orderBook.bids);
		assert.isArray(orderBook.asks);
		assert.lengthOf(orderBook.bids, 0);
		assert.lengthOf(orderBook.asks, 0);
	});

	it(`should return aggregate sorted orders for specified outcome`, () => {
		const orderBook = selectAggregateOrderBook('1', {
			buy: {
				order1: { amount: '8', price: '0.3', outcome: '2' },
				order2: { amount: '4', price: '0.2', outcome: '1' },
				order3: { amount: '6', price: '0.2', outcome: '1' },
				order4: { amount: '2', price: '0.1', outcome: '1' },
				order5: { amount: '7', price: '0.2', outcome: '2' },
				order6: { amount: '10', price: '0.4', outcome: '1' },
				order7: { amount: '12', price: '0.1', outcome: '3' },
				order8: { amount: '14', price: '0.1', outcome: '1' }
			},
			sell: {
				order10: { amount: '6', price: '0.7', outcome: '1' },
				order20: { amount: '4', price: '0.7', outcome: '1' },
				order30: { amount: '2', price: '0.8', outcome: '1' },
				order40: { amount: '7', price: '0.8', outcome: '2' },
				order50: { amount: '8', price: '0.6', outcome: '2' },
				order60: { amount: '10', price: '0.6', outcome: '1' },
				order70: { amount: '12', price: '0.7', outcome: '3' },
				order80: { amount: '13', price: '0.6', outcome: '1' },
				order90: { amount: '14', price: '0.5', outcome: '1' }
			}
		}, {});

		assert.lengthOf(orderBook.bids, 3);
		assert.lengthOf(orderBook.asks, 4);

		assert.deepEqual(orderBook.bids[0], { price: formatEther(0.4), shares: formatShares(10), isOfCurrentUser: false }, 'first bid');
		assert.deepEqual(orderBook.bids[1], { price: formatEther(0.2), shares: formatShares(10), isOfCurrentUser: false }, 'second bid');
		assert.deepEqual(orderBook.bids[2], { price: formatEther(0.1), shares: formatShares(16), isOfCurrentUser: false }, 'third bid');

		assert.deepEqual(orderBook.asks[0], { price: formatEther(0.5), shares: formatShares(14), isOfCurrentUser: false }, 'first ask');
		assert.deepEqual(orderBook.asks[1], { price: formatEther(0.6), shares: formatShares(23), isOfCurrentUser: false }, 'second ask');
		assert.deepEqual(orderBook.asks[2], { price: formatEther(0.7), shares: formatShares(10), isOfCurrentUser: false }, 'third ask');
		assert.deepEqual(orderBook.asks[3], { price: formatEther(0.8), shares: formatShares(2), isOfCurrentUser: false }, 'fourth ask');
	});
});
