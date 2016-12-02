import { describe, it } from 'mocha';
import { assert } from 'chai';
import marketDataTimestampsReducer from '../../../src/modules/markets/reducers/market-data-timestamps';
import { UPDATE_MARKET_DATA_TIMESTAMP } from '../../../src/modules/market/actions/update-market-data-timestamp';

describe('modules/markets/reducers/market-data-timestamps.js', () => {
	it('should react to default action', () => {
		const newState = marketDataTimestampsReducer(undefined, {
			type: '@@INIT'
		});

		assert.deepEqual(newState, {});
	});

	it('should react to UPDATE_MARKET_DATA_TIMESTAMP action', () => {
		const currentState = {};

		const newState = marketDataTimestampsReducer(currentState, {
			type: UPDATE_MARKET_DATA_TIMESTAMP,
			marketID: 'marketID',
			timestamp: 123456
		});

		assert.deepEqual(newState, { marketID: 123456 });
		assert.notStrictEqual(currentState, newState);
	});
});
