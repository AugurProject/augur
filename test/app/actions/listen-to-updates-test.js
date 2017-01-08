import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/app/actions/listen-to-updates.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockAugurJS = {
		augur: {
			filters: { listen: () => {} },
			CompositeGetters: { getPositionInMarket: () => {} }
		},
		abi: {
			number: () => {},
			bignum: () => {}
		}
	};
	const mockUpdateBlockchain = {};
	const mockUpdateBranch = {};
	const mockUpdateAssets = {};
	const mockOutcomePrice = {};
	const mockLoadBidsAsks = {};
	const mockLoadAccountTrades = {};
	const mockLoadMarketsInfo = {
		loadMarketsInfo: () => {}
	};
	mockUpdateAssets.updateAssets = sinon.stub().returns({
		type: 'UPDATE_ASSETS'
	});
	mockUpdateBlockchain.syncBlockchain = sinon.stub().returns({
		type: 'SYNC_BLOCKCHAIN'
	});
	mockUpdateBranch.syncBranch = sinon.stub().returns({
		type: 'SYNC_BRANCH'
	});
	mockUpdateBranch.updateBranch = sinon.stub().returns({
		type: 'UPDATE_BRANCH'
	});
	mockOutcomePrice.updateOutcomePrice = sinon.stub().returns({
		type: 'UPDATE_OUTCOME_PRICE'
	});
	mockLoadBidsAsks.loadBidsAsks = sinon.stub().returns({
		type: 'UPDATE_MARKET_ORDER_BOOK'
	});
	mockLoadAccountTrades.loadAccountTrades = sinon.stub().returns({
		type: 'UPDATE_ACCOUNT_TRADES_DATA'
	});
	sinon.stub(mockLoadMarketsInfo, 'loadMarketsInfo', marketID => ({
		type: 'LOAD_BASIC_MARKET',
		marketID
	}));
	mockAugurJS.abi.number = sinon.stub().returns([0, 1]);
	sinon.stub(mockAugurJS.augur.filters, 'listen', (cb) => {
		cb.block('blockhash');
		cb.log_fill_tx({
			market: 'testMarketID',
			outcome: 'testOutcome',
			price: 123.44250502560001
		});
		cb.log_add_tx({ market: 'testMarketID' });
		cb.log_cancel({ market: 'testMarketID' });
		cb.marketCreated({ marketID: 'testID1' });
		cb.tradingFeeUpdated({ marketID: 'testID1' });
	});
	sinon.stub(mockAugurJS.augur.CompositeGetters, 'getPositionInMarket', (market, trader, cb) => {
		cb(['0x0', '0x1']);
	});

	const action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../app/actions/update-branch': mockUpdateBranch,
		'../../app/actions/update-blockchain': mockUpdateBlockchain,
		'../../auth/actions/update-assets': mockUpdateAssets,
		'../../markets/actions/update-outcome-price': mockOutcomePrice,
		'../../markets/actions/load-markets-info': mockLoadMarketsInfo,
		'../../bids-asks/actions/load-bids-asks': mockLoadBidsAsks,
		'../../my-positions/actions/load-account-trades': mockLoadAccountTrades
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should listen for new updates`, () => {
		store.dispatch(action.listenToUpdates());
		const out = [{
			type: 'UPDATE_ASSETS'
		}, {
			type: 'SYNC_BLOCKCHAIN'
		}, {
			type: 'SYNC_BRANCH'
		}, {
			type: 'UPDATE_OUTCOME_PRICE'
		}, {
			type: 'UPDATE_MARKET_TRADES_DATA',
			data: {
				testMarketID: {
					testOutcome: [
						{
							market: 'testMarketID',
							outcome: 'testOutcome',
							price: 123.44250502560001
						}
					]
				}
			}
		}, {
			type: 'UPDATE_MARKET_PRICE_HISTORY',
			marketID: 'testMarketID',
			priceHistory: {
				testOutcome: [
					{
						market: 'testMarketID',
						outcome: 'testOutcome',
						price: 123.44250502560001
					}
				]
			}
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: [
				'testID1'
			]
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: [
				'testID1'
			]
		}, {
			type: 'UPDATE_ASSETS'
		}];
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
