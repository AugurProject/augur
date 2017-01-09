import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/markets/actions/load-markets-info.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockAugurJS = {
		augur: { batchGetMarketInfo: () => {} }
	};
	const mockLoadFullMarket = {};
	const mockLoadMarketCreatorFees = {};
	const mockLoadCreatedMarketInfo = {};
	mockLoadFullMarket.loadFullMarket = sinon.stub().returns({ type: 'MOCK_LOAD_FULL_MARKET' });
	mockLoadMarketCreatorFees.loadMarketCreatorFees = sinon.stub().returns({ type: 'MOCK_LOAD_MARKET_CREATOR_FEES' });
	mockLoadCreatedMarketInfo.loadCreatedMarketInfo = sinon.stub().returns({ type: 'MOCK_LOAD_CREATED_MARKET_INFO' });

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	sinon.stub(mockAugurJS.augur, `batchGetMarketInfo`, (marketIDs, account, cb) => {
		cb({
			test123: {
				author: '0x0000000000000000000000000000000000000001',
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

	const action = proxyquire('../../../src/modules/markets/actions/load-markets-info', {
		'../../market/actions/load-full-market': mockLoadFullMarket,
		'../../my-markets/actions/load-created-market-info': mockLoadCreatedMarketInfo,
		'../../my-markets/actions/load-market-creator-fees': mockLoadMarketCreatorFees,
		'../../../services/augurjs': mockAugurJS
	});

	it(`should load markets info`, () => {
		const out = [{
			type: 'UPDATE_MARKETS_DATA',
			marketsData: {
				test123: {
					author: '0x0000000000000000000000000000000000000001',
					branchId: '0xf69b5',
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
		}, {
			type: 'UPDATE_EVENT_MARKETS_MAP',
			eventID: 'event1',
			marketIDs: [
				'test123'
			]
		}, {
			type: 'MOCK_LOAD_CREATED_MARKET_INFO'
		}];
		store.dispatch(action.loadMarketsInfo(['test123']));
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
