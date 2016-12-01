import { assert } from 'chai';
import requestsReducer from '../../../src/modules/app/reducers/requests';
import { MARKET_DATA_LOADING } from '../../../src/modules/market/actions/load-full-market';
import { UPDATE_MARKET_DATA_TIMESTAMP } from "../../../src/modules/market/actions/update-market-data-timestamp";

describe('modules/app/reducers/requests.js', () => {
	it('should react to default action', () => {
		const newState = requestsReducer(undefined, {
			type: '@@INIT'
		});

		assert.deepEqual(newState, {});
	});

	it('should react to MARKET_DATA_LOADING action', () => {
		const currentState = {};

		const newState = requestsReducer(currentState, {
			type: MARKET_DATA_LOADING,
			marketID: 'marketID'
		});

		assert.deepEqual(newState, {
			'MARKET_DATA_LOADING': {
				'marketID': true
			}
		});
		assert.notStrictEqual(currentState, newState);
	});

	it('should react to UPDATE_MARKET_DATA_TIMESTAMP action', () => {
		const currentState = {
			'MARKET_DATA_LOADING': {
				'marketID': true
			}
		};

		const newState = requestsReducer(currentState, {
			type: UPDATE_MARKET_DATA_TIMESTAMP,
			marketID: 'marketID',
			timestamp: 1000
		});

		assert.deepEqual(newState, {
			'MARKET_DATA_LOADING': {}
		});
		assert.notStrictEqual(currentState, newState);
	});

	it('shouldn\'t react to UPDATE_MARKET_DATA_TIMESTAMP action if there is no state value', () => {
		const currentState = {
			'MARKET_DATA_LOADING': {
				'marketID': true
			}
		};

		const newState = requestsReducer(currentState, {
			type: UPDATE_MARKET_DATA_TIMESTAMP,
			marketID: 'non existing marketID',
			timestamp: 1000
		});

		assert.deepEqual(newState, currentState);
		assert.strictEqual(currentState, newState);
	});
});
