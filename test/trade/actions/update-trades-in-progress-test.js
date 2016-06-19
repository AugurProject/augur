import {
	assert
} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {BID, ASK} from '../../../src/modules/bids-asks/constants/bids-asks-types';

describe(`modules/trade/actions/update-trades-in-progress.js`, () => {
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	let actions = require('../../../src/modules/trade/actions/update-trades-in-progress');

	const state = {
		tradesInProgress: {
			noActionDispatchedMarket: {
				testOutcomeID: {
					limitPrice: 1,
					numShares: 4,
					totalCost: 4,
					side: ASK
				}
			},
			testMarketID9: {
				testOutcomeID: {
					limitPrice: 1,
					numShares: 4,
					totalCost: 4,
					side: ASK
				}
			}
		}
	};

	describe('updateTradesInProgress', function () {
		let store;
		beforeEach(function () {
			store = mockStore({...state});
		});

		const tests = [
			{
				title: 'shouldn\'t emit action when there is no change',
				params: {
					marketID: 'noActionDispatchedMarket',
					outcomeID: 'testOutcomeID',
					numShares: 4,
					limitPrice: 1,
					side: ASK
				},
				expectedOutput: []
			},
			{
				title: 'should update whole trade',
				params: {
					marketID: 'test_market_id',
					outcomeID: 'testOutcomeID',
					numShares: 4,
					limitPrice: 0.5,
					side: BID
				},
				expectedOutput: [{
					type: actions.UPDATE_TRADE_IN_PROGRESS,
					data: {
						marketID: 'test_market_id',
						outcomeID: 'testOutcomeID',
						details: {
							numShares: 4,
							limitPrice: 0.5,
							totalCost: 2,
							side: BID
						}
					}
				}]
			},
			{
				title: 'should update only limit price',
				params: {
					marketID: 'test_market_id_5',
					outcomeID: 'testOutcomeID',
					numShares: undefined,
					limitPrice: 0.5,
					side: undefined
				},
				expectedOutput: [{
					type: actions.UPDATE_TRADE_IN_PROGRESS,
					data: {
						marketID: 'test_market_id_5',
						outcomeID: 'testOutcomeID',
						details: {
							numShares: undefined,
							limitPrice: 0.5,
							totalCost: null,
							side: undefined
						}
					}
				}]
			},
			{
				title: 'should update only shares',
				params: {
					marketID: 'test_market_id_2',
					outcomeID: 'testOutcomeID',
					numShares: 4,
					limitPrice: undefined,
					side: undefined
				},
				expectedOutput: [{
					type: actions.UPDATE_TRADE_IN_PROGRESS,
					data: {
						marketID: 'test_market_id_2',
						outcomeID: 'testOutcomeID',
						details: {
							numShares: 4,
							limitPrice: undefined,
							totalCost: null,
							side: undefined
						}
					}
				}]
			},
			{
				title: 'should update only side',
				params: {
					marketID: 'test_market_id_3',
					outcomeID: 'testOutcomeID',
					numShares: undefined,
					limitPrice: undefined,
					side: ASK
				},
				expectedOutput: [{
					type: actions.UPDATE_TRADE_IN_PROGRESS,
					data: {
						marketID: 'test_market_id_3',
						outcomeID: 'testOutcomeID',
						details: {
							numShares: undefined,
							limitPrice: undefined,
							totalCost: null,
							side: ASK
						}
					}
				}]
			},
			{
				title: 'should update shares and total cost',
				params: {
					marketID: 'testMarketID9',
					outcomeID: 'testOutcomeID',
					numShares: 2,
					limitPrice: undefined,
					side: undefined
				},
				expectedOutput: [{
					type: actions.UPDATE_TRADE_IN_PROGRESS,
					data: {
						marketID: 'testMarketID9',
						outcomeID: 'testOutcomeID',
						details: {
							numShares: 2,
							limitPrice: 1,
							totalCost: 2,
							side: ASK
						}
					}
				}]
			}
		];

		tests.forEach(function (test) {
			it(test.title, function () {
				store.dispatch(
					actions.updateTradesInProgress(test.params.marketID, test.params.outcomeID, test.params.numShares, test.params.limitPrice, test.params.side)
				);

				assert.deepEqual(store.getActions(), test.expectedOutput, test.failureMessage);
			});

		});
	});

	describe('clearTradeInProgress', function () {
		it(`should dispatch clear market`, () => {
			const expectedOutput = {
				type: 'CLEAR_TRADE_IN_PROGRESS',
				marketID: 'test'
			};
			assert.deepEqual(actions.clearTradeInProgress('test'), expectedOutput, `actions.clearTradeInProgress doesn't produce the expected output.`);
		});
	});
});
