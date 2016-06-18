import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/penalize-too-few-reports.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState, {
		blockchain: {...testState.blockchain,
			isReportConfirmationPhase: false
		},
		loginAccount: {...testState.loginAccount,
			rep: 100
		}
	});
	store = mockStore(state);

	let mockAugurJS = {
		getReportedPeriod: sinon.stub().yields('1'),
		penalizeNotEnoughReports: sinon.stub().yields(null, 'TEST RESPONSE!'),
		penalizationCatchup: sinon.stub().yields(null, 'TEST RESPONSE!')
	};
	let mockUpdate = {};
	mockAugurJS.getReportedPeriod.onCall(0).yields('0');
	mockAugurJS.getReportedPeriod.onCall(2).yields('10');
	mockUpdate.updateAssets = sinon.stub().returns({
		type: 'UPDATE_ASSETS'
	});

	action = proxyquire('../../../src/modules/reports/actions/penalize-too-few-reports.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../auth/actions/update-assets': mockUpdate
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should penalize too few reports', () => {
		out = [{
			type: 'UPDATE_ASSETS'
		}, {
			type: 'UPDATE_ASSETS'
		}, {
			type: 'UPDATE_ASSETS'
		}];

		// store.dispatch(action.penalizeTooFewReports());
		// store.dispatch(action.penalizeTooFewReports());
		// store.dispatch(action.penalizeTooFewReports());

		// assert(mockAugurJS.getReportedPeriod.calledThrice, `Didn't call getReportedPeriod 3 times as expected`);
		// assert(mockAugurJS.penalizeNotEnoughReports.calledOnce, `Didn't call penalizeNotEnoughReports once as expected`);
		// assert(mockAugurJS.penalizationCatchup.calledTwice, `Didn't call penalizationCatchup twice as expected`);
		// assert(mockUpdate.updateAssets.calledThrice, `Didn't call updateAssets 3 times as expected`);
		// assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});

});
