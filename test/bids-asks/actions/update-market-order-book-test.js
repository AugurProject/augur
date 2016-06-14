import {
	assert
} from 'chai';
import { UPDATE_MARKET_ORDER_BOOK, updateMarketOrderBook } from '../../../src/modules/bids-asks/actions/update-market-order-book';

describe(`modules/bids-asks/actions/update-market-order-book.js`, () => {
	it(`should fire the UPDATE_MARKET_ORDER_BOOK action with data`, () => {
		const marketId = "test_id";
		const marketOrderBook = {
			hello: 'world! [test data]'
		};

		const expectedOutput = {
			type: UPDATE_MARKET_ORDER_BOOK,
			marketId,
			marketOrderBook
		};
		assert.deepEqual(updateMarketOrderBook(marketId, marketOrderBook), expectedOutput, `Updating market order book didn't return the correct action!`);
	});
});
