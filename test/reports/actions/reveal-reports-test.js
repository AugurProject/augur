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
				isCommitted: false,
				reportedOutcomeID: 'testOutcomeID1',
				isUnethical: false,
				isIndeterminate: true,
				isScalar: false
			},
			test2: {
				_id: 'test2',
				reportHash: '0xtesthash123456789testhash2',
				isCommitted: false,
				reportedOutcomeID: 'testOutcomeID2',
				isUnethical: false,
				isIndeterminate: false,
				isScalar: true
			},
			test3: {
				_id: 'test3',
				reportHash: '0xtesthash123456789testhash3',
				isCommitted: false,
				reportedOutcomeID: 'testOutcomeID3',
				isUnethical: true,
				isIndeterminate: false,
				isScalar: false
			}
		}
	});
	store = mockStore(state);
	let mockAugurJS = {
		submitReport: () => {}
	};

	mockAugurJS.getEventIndex = sinon.stub().yields({
		err: null,
		index: 'test'
	});

	sinon.stub(mockAugurJS, 'submitReport', (argObj) => {
		argObj.onSuccess('test response!');
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

	it('should commit reports', () => {
		let out = [{
			type: 'UPDATE_REPORTS',
			reports: {
				test3: {
					isCommited: true
				}
			}
		}, {
			type: 'UPDATE_REPORTS',
			reports: {
				test2: {
					isCommited: true
				}
			}
		}, {
			type: 'UPDATE_REPORTS',
			reports: {
				test1: {
					isCommited: true
				}
			}
		}];

		store.dispatch(action.commitReports());

		clock.tick(6000);

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
		assert(mockAugurJS.submitReport.calledThrice, `Didn't call submitReport 3 times as expected`);
		assert(mockAugurJS.getEventIndex.calledThrice, `Didn't call getEventIndex 3 times as expected`);
	});

});
