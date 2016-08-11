import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/check-period.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action;
	let state = Object.assign({}, testState, {
		blockchain: {...testState.blockchain,
			isReportConfirmationPhase: false
		},
		loginAccount: {...testState.loginAccount,
			rep: 100
		}
	});
	store = mockStore(state);
	let mockAugurJS = { augur: {} };
	mockAugurJS.augur.checkPeriod = sinon.stub().yields(null, 'TEST RESPONSE!');
	mockAugurJS.augur.penalizeWrong = sinon.stub().yields(null, 'TEST RESPONSE!');
	mockAugurJS.augur.incrementPeriodAfterReporting = sinon.stub().yields(null, 'TEST RESPONSE!');

	action = proxyquire('../../../src/modules/reports/actions/check-period.js', {
		'../../../services/augurjs': mockAugurJS
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should check for increment period / penalize wrong', () => {
		store.dispatch(action.checkPeriod());
		assert(mockAugurJS.augur.checkPeriod.calledOnce);
	});

});
