import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/reveal-reports.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out, clock;
	let state = Object.assign({}, testState, {
		loginAccount: {
			...testState.loginAccount,
			ether: 100,
			rep: 100,
			realEther: 100
		},
		reports: {
			test1: {
				_id: 'test1',
				reportHash: '0xtesthash123456789testhash1',
				isRevealed: false,
				reportedOutcomeID: 'testOutcomeID1',
				isUnethical: false,
				isIndeterminate: true,
				isScalar: false
			},
			test2: {
				_id: 'test2',
				reportHash: '0xtesthash123456789testhash2',
				isRevealed: false,
				reportedOutcomeID: 'testOutcomeID2',
				isUnethical: false,
				isIndeterminate: false,
				isScalar: true
			},
			test3: {
				_id: 'test3',
				reportHash: '0xtesthash123456789testhash3',
				isRevealed: false,
				reportedOutcomeID: 'testOutcomeID3',
				isUnethical: true,
				isIndeterminate: false,
				isScalar: false
			}
		}
	});
	store = mockStore(state);

	// let revealReport = sinon.stub();
	// revealReport.onFirstCall().returns(null, { test3: { isRevealed: true } });
	// revealReport.onSecondCall().returns(null, { test2: { isRevealed: true } });
	// revealReport.onThirdCall().returns(null, { test1: { isRevealed: true } });
	// let mockAugurJS = {revealReport};
	let mockAugurJS = {revealReport: () => {}};
	sinon.stub(mockAugurJS, 'revealReport', (event, salt, report, isScalar, isUnethical, cb) => {
		return cb(null, { [event]: { isRevealed: true } });
	});

	action = proxyquire('../../../src/modules/reports/actions/reveal-reports.js', {
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

	it('should reveal reports', () => {
		let out = [{
			type: 'UPDATE_REPORTS',
			reports: { test3: { isRevealed: true } }
		}, {
			type: 'UPDATE_REPORTS',
			reports: { test2: { isRevealed: true } }
		}, {
			type: 'UPDATE_REPORTS',
			reports: { test1: { isRevealed: true } }
		}];

		store.dispatch(action.revealReports());

		clock.tick(6000);

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
		assert(mockAugurJS.revealReport.calledThrice, `Didn't call revealReport 3 times as expected`);
	});

});
