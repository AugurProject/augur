/*
 * Author: priecint
 */
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

describe(`modules/user-open-orders/selectors/user-open-orders.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const state = {
		loginAccount: {
			id: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c'
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
				'order1': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1' }
			},
			sell: {
				'order4': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1' }
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
				'order1': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '2' },
				'order2': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '3' },
				'order3': { owner: 'some other address', outcome: '1' }
			},
			sell: {
				'order7': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '3' },
				'order8': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1', isCancelled: true }
			}
		};
		assert.lengthOf(selectUserOpenOrders('1', nonMatchingMarketOrderBook), 0);
	});

	it(`should return user open orders for logged-in user who has orders`, () => {
		const nonMatchingMarketOrderBook = {
			buy: {
				'order1': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1' },
				'order2': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1' },
				'order3': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '2' },
				'order4': { owner: 'some other address', outcome: '1' }
			},
			sell: {
				'order7': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1' },
				'order8': { owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c', outcome: '1', isCancelled: true }
			}
		};
		assert.lengthOf(selectUserOpenOrders('1', nonMatchingMarketOrderBook), 3);
	});
});
