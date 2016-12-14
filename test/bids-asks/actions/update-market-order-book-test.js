import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	UPDATE_MARKET_ORDER_BOOK,
	updateMarketOrderBook
} from 'modules/bids-asks/actions/update-market-order-book';

describe(`modules/bids-asks/actions/update-market-order-book.js`, () => {
	it(`should fire the UPDATE_MARKET_ORDER_BOOK action with data`, () => {
		const marketId = 'test_id';
		const marketOrderBook = {
			buy: {
				0x1dca8b5121a6e63228895359bebb3b7e863dcce38506e80e2c72f7aa45e6bf9a: {
					amount: '1028',
					block: 1376604,
					id: '0x1dca8b5121a6e63228895359bebb3b7e863dcce38506e80e2c72f7aa45e6bf9a',
					market: '0x116b6d85d4b3276ba6b09328e67d82588d9c7ccaa3b4200831e6e29a024eaa6f',
					outcome: '4',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					price: '0.343916363673535165',
					type: 'buy'
				},
				0x4e85b6494b827cf0eef1b4dab7945bc4a461041984f7a7321e1cce58d1b64e06: {
					amount: '1028',
					block: 1376605,
					id: '0x4e85b6494b827cf0eef1b4dab7945bc4a461041984f7a7321e1cce58d1b64e06',
					market: '0x116b6d85d4b3276ba6b09328e67d82588d9c7ccaa3b4200831e6e29a024eaa6f',
					outcome: '5',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					price: '0.141217647881372605',
					type: 'buy'
				}
			},
			sell: {
				0x3a18bf2f4c744ed7f26cf088a1fb21f44475598d831968496ed4ba0b10446845: {
					amount: '1028',
					block: 1376606,
					id: '0x3a18bf2f4c744ed7f26cf088a1fb21f44475598d831968496ed4ba0b10446845',
					market: '0x116b6d85d4b3276ba6b09328e67d82588d9c7ccaa3b4200831e6e29a024eaa6f',
					outcome: '6',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					price: '0.671751220348873435',
					type: 'sell'
				},
				0x3b3baab3fe94727e1be104b4b5152b36349abf729962f8a22e8e5059e8fe8133: {
					amount: '1028',
					block: 1376601,
					id: '0x3b3baab3fe94727e1be104b4b5152b36349abf729962f8a22e8e5059e8fe8133',
					market: '0x116b6d85d4b3276ba6b09328e67d82588d9c7ccaa3b4200831e6e29a024eaa6f',
					outcome: '2',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					price: '0.527504850931243185',
					type: 'sell'
				},
				0x3dbeec9f5521cac16843ba222c734d7988a0a36b1d232b67697e66a69710f954: {
					amount: '1028',
					block: 1376605,
					id: '0x3dbeec9f5521cac16843ba222c734d7988a0a36b1d232b67697e66a69710f954',
					market: '0x116b6d85d4b3276ba6b09328e67d82588d9c7ccaa3b4200831e6e29a024eaa6f',
					outcome: '5',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					price: '0.691246585827735975',
					type: 'sell'
				}
			}
		};

		const expectedOutput = {
			type: UPDATE_MARKET_ORDER_BOOK,
			marketId,
			marketOrderBook
		};
		assert.deepEqual(updateMarketOrderBook(marketId, marketOrderBook), expectedOutput, `Updating market order book didn't return the correct action!`);
	});
});
