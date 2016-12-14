import { describe, it } from 'mocha';
import { assert } from 'chai';
import reducer from 'modules/trade/reducers/trades-in-progress';
import { UPDATE_TRADE_IN_PROGRESS, CLEAR_TRADE_IN_PROGRESS } from 'modules/trade/actions/update-trades-in-progress';
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account';
import { UPDATE_URL } from 'modules/link/actions/update-url';

describe(`modules/trade/reducers/trade-in-progress.js`, () => {
	const testState = {
		MarketID: {
			MarketID: 'testStateMarketID',
			OutcomeID: {
				test: 1
			}
		},
		MarketID2: {
			MarketID2: 'testStateMarketID2',
			OutcomeID: {
				test: 2
			}
		}
	};

	it('should be able to handle UPDATE_URL', () => {
		const testAction = {
			type: UPDATE_URL,
			parsedURL: {
				searchParams: { page: 'register' }
			}
		};

		const expectedState = {
			MarketID: {
				MarketID: 'testStateMarketID',
				OutcomeID: {
					test: 1
				}
			},
			MarketID2: {
				MarketID2: 'testStateMarketID2',
				OutcomeID: {
					test: 2
				}
			}
		};

		assert.deepEqual(reducer(testState, testAction), expectedState);
	});

	it(`should clear the login account `, () => {
		const testAction = {
			type: CLEAR_LOGIN_ACCOUNT
		};

		const expectedState = {};

		assert.deepEqual(reducer(testState, testAction), expectedState, `reducer doesn't produce the expected state`);
	});

	it(`should be able to update a trade in progress`, () => {
		const testAction = {
			type: UPDATE_TRADE_IN_PROGRESS,
			data: {
				marketID: 'MarketID',
				outcomeID: 'OutcomeID',
				details: {
					details: 'something here'
				}
			}
		};

		const expectedState = {
			MarketID: {
				MarketID: 'testStateMarketID',
				OutcomeID: {
					details: 'something here'
				}
			},
			MarketID2: {
				MarketID2: 'testStateMarketID2',
				OutcomeID: {
					test: 2
				}
			}
		};

		assert.deepEqual(reducer(testState, testAction), expectedState, `reducer doesn't produce the expected state`);
	});

	it(`should be able to clear a trade in progress`, () => {
		const testAction = {
			type: CLEAR_TRADE_IN_PROGRESS,
			marketID: 'MarketID2',
		};

		const expectedState = {
			MarketID: {
				MarketID: 'testStateMarketID',
				OutcomeID: {
					test: 1
				}
			},
			MarketID2: {}
		};

		assert.deepEqual(reducer(testState, testAction), expectedState, `reducer doesn't produce the expected state`);
	});

});
