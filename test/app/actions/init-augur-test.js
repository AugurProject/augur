import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import mocks from '../../mockStore';

describe(`modules/app/actions/init-augur.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let action, out;
	const { store } = mocks;

	let mockAugurJS = {
		augur: {
			loadBranch: () => {}
		}
	};
	let mockLoginAcc = {};
	let mockReportingTestSetup = {};

	mockAugurJS.connect = sinon.stub().yields(null, {
		connect: 'test'
	});
	mockLoginAcc.loadLoginAccount = sinon.stub().returns({
		type: 'LOAD_LOGIN_ACCOUNT'
	});
	sinon.stub(mockAugurJS.augur, 'loadBranch', (branchID, cb) => {
		cb(null, 'testBranch');
	});
	mockReportingTestSetup.reportingTestSetup = sinon.stub().returns({
		type: 'REPORTING_TEST_SETUP'
	});

	action = proxyquire('../../../src/modules/app/actions/init-augur.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../auth/actions/load-login-account': mockLoginAcc,
		'../../reports/actions/reportingTestSetup': mockReportingTestSetup
	});

	beforeEach(() => {
		store.clearActions();
		global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
		const requests = global.requests = [];
		global.XMLHttpRequest.onCreate = function (xhr) {
			requests.push(xhr);
		};
	});

	afterEach(() => {
		global.XMLHttpRequest.restore();
		store.clearActions();
	});

	it(`should initiate the augur app`, () => {
		out = [{type: 'UPDATE_ENV', env: { reportingTest: false } }, {
			isConnected: {
				connect: 'test'
			},
			type: 'UPDATE_CONNECTION_STATUS'
		}, {
			type: 'LOAD_LOGIN_ACCOUNT'
		}, {
			type: 'CLEAR_MARKETS_DATA'
		}];

		store.dispatch(action.initAugur());

		global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reportingTest": false }`);

		assert(mockAugurJS.connect.calledOnce, `Didn't call AugurJS.connect() exactly once`);
		assert(mockLoginAcc.loadLoginAccount.calledOnce, `Didn't call loadLoginAccount() exactly once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`);
	});
});
