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
	let store, action, clock;
	let state = Object.assign({}, testState, {
		blockchain: {...testState.blockchain,
			isReportConfirmationPhase: false
		},
		loginAccount: {...testState.loginAccount,
			rep: 100
		}
	});
	store = mockStore(state);
	let mockAugurJS = {};
	let mockIsMarketData = {
		isMarketDataPreviousReportPeriod: () => {}
	};
	mockAugurJS.penalizeWrong = sinon.stub().yields(null, 'TEST RESPONSE!');

	sinon.stub(mockIsMarketData, 'isMarketDataPreviousReportPeriod', () => false);

	action = proxyquire('../../../src/modules/reports/actions/check-period.js', {
		'../../../services/augurjs': mockAugurJS
	});

	beforeEach(() => {
		store.clearActions();
		clock = sinon.useFakeTimers();
	});

	afterEach(() => {
		store.clearActions();
		clock.restore();
	});

	it('should penalize wrong reports', () => {
		store.dispatch(action.checkPeriod());
		clock.tick(4000);
		assert(mockAugurJS.penalizeWrong.calledThrice);
	});

});
