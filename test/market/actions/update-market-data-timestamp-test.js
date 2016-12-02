import { describe, it } from 'mocha';
import { assert } from 'chai';
import mocks from '../../mockStore';
import { UPDATE_MARKET_DATA_TIMESTAMP } from '../../../src/modules/market/actions/update-market-data-timestamp';

describe('modules/market/actions/update-market-data-timestamp.js', () => {
	const store = mocks.mockStore({});

	it('should dispatch UPDATE_MARKET_DATA_TIMESTAMP action', () => {
		const updateMarketDataTimestamp = require('../../../src/modules/market/actions/update-market-data-timestamp').updateMarketDataTimestamp;

		store.dispatch(updateMarketDataTimestamp('marketID', 10));

		const expected = [{
			type: UPDATE_MARKET_DATA_TIMESTAMP,
			marketID: 'marketID',
			timestamp: 10
		}];
		assert.deepEqual(store.getActions(), expected, `Didn't properly dispatch UPDATE_MARKET_DATA_TIMESTAMP action`);
	});
});
