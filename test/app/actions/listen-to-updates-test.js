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
		listenToUpdates: () => {}
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
	sinon.stub(mockAugurJS, 'listenToUpdates', (cb1, cb2, cb3, cb4) => {
		cb1(null, 'blockhash');
		// cb2 doesn't do anything so i'm going to skip for now.
		cb3(null, {
			marketId: 'testMarketID',
			outcome: 'testOutcome',
			price: 123.44250502560001
		});
		cb4(null, {
			marketId: 'testID1'
		});
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
			marketID: 'testID1'
		}];

		assert(mockAugurJS.listenToUpdates.calledOnce, `Didn't call AugurJS.listenToUpdates() exactly 1 time as expected`);
		assert(mockUpBlockchain.updateBlockchain.calledOnce, `Didn't call updateBlockchain() once as expected`);
		assert(mockUpdateAssets.updateAssets.calledOnce, `Didn't call updateAssets() once as expected`);
		assert(mockOutcomePrice.updateOutcomePrice.calledOnce, `Didn't call updateOutcomePrice() once as expected`);
		assert(mockLoadMarketsInfo.loadMarketsInfo.calledOnce, `Didn't call loadMarketsInfo() once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
