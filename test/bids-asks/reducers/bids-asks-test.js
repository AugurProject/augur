import {
	assert
} from 'chai';
import testState from '../../testState';
import {
	UPDATE_BIDSASKS_DATA
} from '../../../src/modules/bids-asks/actions/update-bids-asks';
import reducer from '../../../src/modules/bids-asks/reducers/bids-asks';

describe(`modules/bids-asks/reducers/bids-asks.js`, () => {
	let action, expectedOutput;
	let thisTestState = Object.assign({}, testState);

	it(`Should execute a bid for 100 shares`, () => {
		action = {
			type: UPDATE_BIDSASKS_DATA,
			bidsAsksData: {
				test: {
					id: 'test',
					marketID: 'testMarketID',
					outcomeID: 'testOutcomeID',
					action: 'executed',
					accountID: thisTestState.loginAccount.id,
					bidOrAsk: 'bid',
					numShares: 100,
					limitPrice: 5
				}
			}
		};
		expectedOutput = {
			testMarketID: {
				id: 'test',
				testOutcomeID: {
					ask: {
						'3': {
							'0xtest123': 500
						}
					},
					bid: {
						'5': {
							'0xtest123': 900
						}
					}
				}
			}
		};
		assert.deepEqual(reducer(thisTestState.bidsAsks, action), expectedOutput, `Didn't properly updated an execute bid for 100 shares`);

	});

	it(`Should cancel a bid for 100 shares`, () => {
		action.bidsAsksData.test.action = 'canceled';
		expectedOutput = {
			testMarketID: {
				id: 'test',
				testOutcomeID: {
					ask: {
						'3': {
							'0xtest123': 500
						}
					},
					bid: {
						'5': {
							'0xtest123': 1000
						}
					}
				}
			}
		};

		assert.deepEqual(reducer(thisTestState.bidsAsks, action), expectedOutput, `Didn't properly updated an execute bid for 100 shares`);
	});

	it(`Should execute a ask for 100 shares`, () => {
		action = {
			type: UPDATE_BIDSASKS_DATA,
			bidsAsksData: {
				test: {
					id: 'test',
					marketID: 'testMarketID',
					outcomeID: 'testOutcomeID',
					action: 'executed',
					accountID: thisTestState.loginAccount.id,
					bidOrAsk: 'ask',
					numShares: 100,
					limitPrice: 3
				}
			}
		};
		expectedOutput = {
			testMarketID: {
				id: 'test',
				testOutcomeID: {
					ask: {
						'3': {
							'0xtest123': 400
						}
					},
					bid: {
						'5': {
							'0xtest123': 900
						}
					}
				}
			}
		};

		assert.deepEqual(reducer(thisTestState.bidsAsks, action), expectedOutput, `Didn't properly updated an execute bid for 100 shares`);
	});

	it(`Should cancel a ask for 100 shares`, () => {
		action.bidsAsksData.test.action = 'canceled';
		expectedOutput = {
			testMarketID: {
				id: 'test',
				testOutcomeID: {
					ask: {
						'3': {
							'0xtest123': 500
						}
					},
					bid: {
						'5': {
							'0xtest123': 900
						}
					}
				}
			}
		};

		assert.deepEqual(reducer(thisTestState.bidsAsks, action), expectedOutput, `Didn't properly updated an execute bid for 100 shares`);

	});

});
