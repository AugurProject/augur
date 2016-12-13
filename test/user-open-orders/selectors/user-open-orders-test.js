import { describe, it } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { CANCELLED } from 'modules/bids-asks/constants/order-status';
import { formatEther, formatShares, formatNone } from 'utils/format-number';

describe(`modules/user-open-orders/selectors/user-open-orders.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const state = {
		loginAccount: {
			address: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c'
		},
		orderCancellation: {
			order8: CANCELLED
		}
	};
	const store = mockStore(state);
	const selectUserOpenOrders = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
		'../../../store': store
	}).default;

	it(`should return no user open orders for not logged-in user`, () => {
		const state = {
			loginAccount: {}
		};
		const store = mockStore(state);
		const selectUserOpenOrders = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
			'../../../store': store
		}).default;

		const marketOrderBook = {
			buy: {
				order1: {
					id: 'order1',
					price: '10',
					amount: '1',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				}
			},
			sell: {
				order4: {
					id: 'order4',
					price: '40',
					amount: '4',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				}
			}
		};

		assert.lengthOf(selectUserOpenOrders('1', marketOrderBook), 0);
	});

	it(`should return no user open orders if there are no orders`, () => {
		assert.lengthOf(selectUserOpenOrders('1', {}), 0);
	});

	it(`should return empty user open orders if there are no matching orders`, () => {
		const nonMatchingMarketOrderBook = {
			buy: {
				order1: {
					id: 'order1',
					price: '10',
					amount: '1',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '2'
				},
				order2: {
					id: 'order2',
					price: '20',
					amount: '2',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '3'
				},
				order3: {
					id: 'order3',
					price: '30',
					amount: '3',
					owner: 'some other address',
					outcome: '1'
				}
			},
			sell: {
				order7: {
					id: 'order7',
					price: '70',
					amount: '7',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '3'
				},
				order8: {
					id: 'order8',
					price: '80',
					amount: '8',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				}
			}
		};
		assert.lengthOf(selectUserOpenOrders('1', nonMatchingMarketOrderBook), 0);
	});

	it(`should return user open orders for logged-in user who has orders`, () => {
		const marketOrderBook = {
			buy: {
				order2: {
					id: 'order2',
					market: 'testMarketId',
					price: '20',
					amount: '2',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				},
				order1: {
					id: 'order1',
					market: 'testMarketId',
					price: '10',
					amount: '1',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				},
				order4: {
					id: 'order4',
					market: 'testMarketId',
					price: '40',
					amount: '4',
					owner: 'some other address',
					outcome: '1'
				},
				order3: {
					id: 'order3',
					market: 'testMarketId',
					price: '30',
					amount: '3',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '2'
				},
				order5: {
					id: 'order5',
					market: 'testMarketId',
					price: '50',
					amount: '5',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				},
				order6: {
					id: 'order6',
					market: 'testMarketId',
					price: '60',
					amount: '6',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				}
			},
			sell: {
				order7: {
					id: 'order7',
					market: 'testMarketId',
					price: '70',
					amount: '7',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				},
				order10: {
					id: 'order10',
					market: 'testMarketId',
					price: '100',
					amount: '10',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				},
				order8: {
					id: 'order8',
					market: 'testMarketId',
					price: '80',
					amount: '8',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1',
				},
				order9: {
					id: 'order9',
					market: 'testMarketId',
					price: '90',
					amount: '9',
					owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
					outcome: '1'
				},
				order11: {
					id: 'order11',
					market: 'testMarketId',
					price: '110',
					amount: '11',
					owner: 'different owner',
					outcome: '1'
				}

			}
		};

		const userOpenOrders = selectUserOpenOrders('1', marketOrderBook);
		assert.lengthOf(userOpenOrders, 7);
		assert.deepEqual(userOpenOrders, [{
			id: 'order10',
			avgPrice: formatEther('100'),
			marketID: 'testMarketId',
			type: 'sell',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('10')
		}, {
			id: 'order9',
			avgPrice: formatEther('90'),
			marketID: 'testMarketId',
			type: 'sell',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('9')
		}, {
			id: 'order7',
			avgPrice: formatEther('70'),
			marketID: 'testMarketId',
			type: 'sell',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('7')
		}, {
			id: 'order6',
			avgPrice: formatEther('60'),
			marketID: 'testMarketId',
			type: 'buy',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('6')
		}, {
			id: 'order5',
			avgPrice: formatEther('50'),
			marketID: 'testMarketId',
			type: 'buy',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('5')
		}, {
			id: 'order2',
			avgPrice: formatEther('20'),
			marketID: 'testMarketId',
			type: 'buy',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('2')
		}, {
			id: 'order1',
			avgPrice: formatEther('10'),
			marketID: 'testMarketId',
			type: 'buy',
			matchedShares: formatNone(),
			originalShares: formatNone(),
			unmatchedShares: formatShares('1')
		}]);
	});
});
