import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/actions/load-markets-info.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	const { loginAccount } = store.getState();
	let mockAugurJS = {
		augur: { batchGetMarketInfo: () => {} }
	};
	const mockPortfolioAction = {};
	mockPortfolioAction.loadFullLoginAccountMarkets = sinon.stub().returns({ type: 'MOCK_LOAD_FULL_LOGIN_ACCOUNT_MARKETS' });

	const mockSelectors = {
		loginAccount
	};

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	sinon.stub(mockAugurJS.augur, `batchGetMarketInfo`, (marketIDs, account, cb) => {
		cb({
			test123: {
				author: '0xtest123',
				branchId: testState.branch.id,
				events: [{
					id: 'event1',
					minValue: 1,
					maxValue: 3,
					numOutcomes: 3,
					outcome: 2
				}],
				tags: ['test', 'testtag'],
				outcomes: [{
					id: 1
				}, {
					id: 2
				}],
				type: 'binary'
			}
		});
	});

	action = proxyquire('../../../src/modules/markets/actions/load-markets-info', {
		'../../portfolio/actions/load-full-login-account-markets': mockPortfolioAction,
		'../../../selectors': mockSelectors,
		'../../../services/augurjs': mockAugurJS
	});

	it(`should load markets info`, () => {
		out = [
			{
				type: 'UPDATE_MARKETS_DATA',
				marketsData: {
					test123: {
						author: '0xtest123',
						branchId: testState.branch.id,
						events: [{
							id: 'event1',
							minValue: 1,
							maxValue: 3,
							numOutcomes: 3,
							outcome: 2
						}],
						tags: ['test', 'testtag'],
						outcomes: [{
							id: 1
						}, {
							id: 2
						}],
						type: 'binary'
					}
				}
			},
			{
				type: 'MOCK_LOAD_FULL_LOGIN_ACCOUNT_MARKETS'
			}
		];
		store.dispatch(action.loadMarketsInfo(['test123']));

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
		assert(mockPortfolioAction.loadFullLoginAccountMarkets.calledOnce, `loadFullLoginAccountMarkets wasn't called once as expected`);
	});
});
