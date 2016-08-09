import {
	assert
} from 'chai';
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
			filters: {
				listen: () => {}
			}
		}
	};
	let mockUpBlockchain = {};
	let mockUpdateAssets = {};
	let mockOutcomePrice = {};
	let mockLoadMarketsInfo = {
		loadMarketsInfo: () => {}
	};
	mockUpdateAssets.updateAssets = sinon.stub().returns({
		type: 'UPDATE_ASSETS'
	});
	mockUpBlockchain.updateBlockchain = sinon.stub().returns({
		type: 'UPDATE_BLOCKCHAIN'
	});
	mockOutcomePrice.updateOutcomePrice = sinon.stub().returns({
		type: 'UPDATE_OUTCOME_PRICE'
	});
	sinon.stub(mockLoadMarketsInfo, 'loadMarketsInfo', (marketID) => {
		return {
			type: 'LOAD_BASIC_MARKET',
			marketID
		};
	});
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

	action = proxyquire('../../../src/modules/app/actions/listen-to-updates.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../app/actions/update-blockchain': mockUpBlockchain,
		'../../auth/actions/update-assets': mockUpdateAssets,
		'../../markets/actions/update-outcome-price': mockOutcomePrice,
		'../../markets/actions/load-markets-info': mockLoadMarketsInfo
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
			type: 'UPDATE_BLOCKCHAIN'
		}, {
			type: 'UPDATE_OUTCOME_PRICE'
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: 'testMarketID'
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: 'testMarketID'
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: 'testID1'
		}, {
			type: 'LOAD_BASIC_MARKET',
			marketID: 'testID1'
		}];

		assert(mockAugurJS.augur.filters.listen.calledOnce, `Didn't call AugurJS.augur.filters.listen() exactly 1 time as expected`);
		assert(mockUpBlockchain.updateBlockchain.calledOnce, `Didn't call updateBlockchain() once as expected`);
		assert(mockUpdateAssets.updateAssets.calledOnce, `Didn't call updateAssets() once as expected`);
		assert(mockOutcomePrice.updateOutcomePrice.calledOnce, `Didn't call updateOutcomePrice() once as expected`);
		assert(mockLoadMarketsInfo.loadMarketsInfo.callCount === 4, `Didn't call loadMarketsInfo() four times as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
