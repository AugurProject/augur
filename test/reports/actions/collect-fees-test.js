import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/collect-fees.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockAugurJS = { augur: { collectFees: () => {} } };
	const mockUpdateAssets = {};

	sinon.stub(mockAugurJS.augur, 'collectFees', (o) => {
		o.onSuccess({ callReturn: '1' });
	});
	mockUpdateAssets.updateAssets = sinon.stub().returns({
		type: 'UPDATE_ASSETS'
	});

	const action = proxyquire('../../../src/modules/reports/actions/collect-fees', {
		'../../../services/augurjs': mockAugurJS,
		'../../auth/actions/update-assets': mockUpdateAssets
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should dispatch an updateAssets action after called collectFees from augur.js', () => {
		const out = [{
			type: 'UPDATE_ASSETS'
		}];

		store.dispatch(action.collectFees());
		assert(mockAugurJS.augur.collectFees.calledOnce, `Didn't call augur.collectFees() only once as expected.`);
		assert(mockUpdateAssets.updateAssets.calledOnce, `Didn't call updateAssets() only once as expected.`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`);
	});

});
