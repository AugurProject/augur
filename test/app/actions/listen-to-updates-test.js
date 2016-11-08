import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/app/actions/listen-to-updates.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {
		augur: {
			filters: { listen: () => {} },
			CompositeGetters: { getPositionInMarket: () => {} }
		},
		abi: {
			number: () => {},
			bignum: () => {}
		}
	};
	let mockUpdateBlockchain = {};
	let mockUpdateBranch = {};
	let mockUpdateAssets = {};
	let mockOutcomePrice = {};
	let mockLoadBidsAsks = {};
	let mockLoadAccountTrades = {};
	let mockLoadMarketsInfo = {
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
	sinon.stub(mockLoadMarketsInfo, 'loadMarketsInfo', (marketID) => {
		return {
			type: 'LOAD_BASIC_MARKET',
			marketID
		};
	});
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

	action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
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
		out = [{
			type: 'UPDATE_ASSETS'
		}, {
			type: 'SYNC_BLOCKCHAIN'
		}, {
			type: 'SYNC_BRANCH'
		}, {
			type: 'UPDATE_OUTCOME_PRICE'
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: ['testMarketID']
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: ['testID1']
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: ['testID1']
		}];

		assert(mockAugurJS.augur.filters.listen.calledOnce, `Didn't call AugurJS.augur.filters.listen() exactly 1 time as expected`);
		assert(mockUpdateBranch.syncBranch.calledOnce, `Didn't call syncBranch() once as expected`);
		assert(mockUpdateBlockchain.syncBlockchain.calledOnce, `Didn't call syncBlockchain() once as expected`);
		assert(mockUpdateAssets.updateAssets.calledOnce, `Didn't call updateAssets() once as expected`);
		assert(mockOutcomePrice.updateOutcomePrice.calledOnce, `Didn't call updateOutcomePrice() once as expected`);
		assert(mockLoadMarketsInfo.loadMarketsInfo.calledThrice, `Didn't call loadMarketsInfo() three times as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
