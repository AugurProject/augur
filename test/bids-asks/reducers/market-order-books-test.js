import {
	assert
} from 'chai';
import testState from '../../testState';
import {
	UPDATE_MARKET_ORDER_BOOK
} from '../../../src/modules/bids-asks/actions/update-market-order-book';
import {
	UPDATE_ORDER_STATUS
} from '../../../src/modules/bids-asks/actions/update-order';
import reducer from '../../../src/modules/bids-asks/reducers/market-order-books';

describe(`modules/bids-asks/reducers/market-order-books.js`, () => {
	let thisTestState;

	beforeEach(() => {
		thisTestState = Object.assign({}, testState);
	});

	it(`Should set market order book`, () => {
		const action = {
			type: UPDATE_MARKET_ORDER_BOOK,
			marketId: 'testMarketID',
			marketOrderBook: {
				buy: {
					"0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3": {
						amount: "50",
						block: 1125453,
						id: "0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
						market: "testMarketID",
						outcome: "2",
						owner: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
						price: "0.35000000000000000002",
						type: "buy"
					}
				},
				sell: {
					"0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb": {
						amount: "50",
						block: 1127471,
						id: "0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb",
						market: "testMarketID",
						outcome: "1",
						owner: "0x457435fbcd49475847f69898f933ffefc33388fc",
						price: "0.25",
						type: "sell"
					}
				}
			}
		};
		const expectedOutput = {
			testMarketID: {
				buy: {
					"0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3": {
						amount: "50",
						block: 1125453,
						id: "0xdbd821cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3",
						market: "testMarketID",
						outcome: "2",
						owner: "0x7c0d52faab596c08f484e3478aebc6205f3f5d8c",
						price: "0.35000000000000000002",
						type: "buy"
					}
				},
				sell: {
					"0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb": {
						amount: "50",
						block: 1127471,
						id: "0x8ef900c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb",
						market: "testMarketID",
						outcome: "1",
						owner: "0x457435fbcd49475847f69898f933ffefc33388fc",
						price: "0.25",
						type: "sell"
					}
				}
			}
		};

		assert.deepEqual(reducer(thisTestState.bidsAsks, action), expectedOutput, `Didn't properly set market order book`);
	});

	it(`should update order`, () => {
		const action = {
			type: UPDATE_ORDER_STATUS,
			orderID: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
			status: 'CANCELLING',
			marketID: 'testMarketID',
			orderType: 'buy',
		};
		const newBidsAsks = {
			testMarketID: {
				buy: {
					'0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3': {
						amount: '10',
						block: 1234,
						id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
						market: 'testMarketID',
						outcome: '2',
						owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
						price: '0.42',
						type: 'buy',
						status: 'CANCELLING',
					}
				},
				sell: {
					'0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb': {
						amount: '20',
						block: 1235,
						id: '0x8ef100c8aad3c4f7b65a055643d54db7b9a506a542b1270047a314da931e37fb',
						market: 'testMarketID',
						outcome: '1',
						owner: '0x457435fbcd49475847f64898f933ffefc33388fc',
						price: '0.58',
						type: 'sell'
					}
				}
			}
		};
		assert.deepEqual(reducer(thisTestState.bidsAsks, action), newBidsAsks, `Didn't properly update order`);
	});
});
