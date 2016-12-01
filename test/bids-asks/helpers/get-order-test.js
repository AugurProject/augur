import { assert } from 'chai';
import { BID } from "../../../src/modules/bids-asks/constants/bids-asks-types";

describe('modules/bids-asks/helpers/get-order.js', () => {
	const getOrder = require('../../../src/modules/bids-asks/helpers/get-order').default;
	it(`shouldn't return order if it's not there`, () => {
		assert.isNull(getOrder('orderID', 'marketID', BID, {}));
		assert.isNull(getOrder('orderID', 'marketID', BID, {sell: {}}));
		assert.isNull(getOrder('orderID', 'marketID', BID, {buy: {}}));
	});

	it(`should return order if it's there`, () => {
		const order = getOrder('0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3', 'testMarketID', BID, {
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
							type: 'buy'
						}
					}
				}
			}
		);
		assert.deepEqual(order, {
				amount: '10',
				block: 1234,
				id: '0xdbd851cc394595f9c50f32c1554059ec343471b49f84a4b72c44589a25f70ff3',
				market: 'testMarketID',
				outcome: '2',
				owner: '0x7c0d52faab596c08f423e3478aebc6205f3f5d8c',
				price: '0.42',
				type: 'buy'
			}
		);
	});
});
