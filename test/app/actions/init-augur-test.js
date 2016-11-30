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
	const mockLoadLoginAccount = {};
	const mockReportingTestSetup = {};
	const mockRegisterTransactionRelay = {};
	const mockLoadChatMessages = { loadChatMessages: () => {} };
	const mockLoadBranch = { loadBranch: () => {} };
	const mockCurrentMessage = sinon.stub().returns(true);
	const mockUserLogin = sinon.stub().returns(false);

	mockLoadBranch.loadBranch = sinon.stub().returns({ type: 'LOAD_BRANCH' });
	mockLoadChatMessages.loadChatMessages = sinon.stub().returns({ type: 'LOAD_CHAT_MESSAGES' });

	mockAugurJS.connect = sinon.stub().yields(null, {
		connect: 'test'
	});
	mockLoadLoginAccount.loadLoginAccount = sinon.stub().returns({
		type: 'LOAD_LOGIN_ACCOUNT'
	});
	mockLoadChatMessages.loadChatMessages = sinon.stub().returns({
		type: 'LOAD_CHAT_MESSAGES'
	});
	sinon.stub(mockAugurJS.augur, 'loadBranch', (branchID, cb) => {
		cb(null, 'testBranch');
	});
	mockReportingTestSetup.reportingTestSetup = sinon.stub().returns({
		type: 'REPORTING_TEST_SETUP'
	});
	mockRegisterTransactionRelay.registerTransactionRelay = sinon.stub().returns({
		type: 'REGISTER_TRANSACTION_RELAY'
	});

	action = proxyquire('../../../src/modules/app/actions/init-augur.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../auth/actions/load-login-account': mockLoadLoginAccount,
		'../../reports/actions/reporting-test-setup': mockReportingTestSetup,
		'../../transactions/actions/register-transaction-relay': mockRegisterTransactionRelay,
		'../../chat/actions/load-chat-messages': mockLoadChatMessages,
		'../../app/actions/load-branch': mockLoadBranch,
		'../../login-message/helpers/is-current-login-message-read': mockCurrentMessage,
		'../../auth/helpers/is-user-logged-in': mockUserLogin
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
			type: 'REGISTER_TRANSACTION_RELAY'
		}, {
			type: 'LOAD_CHAT_MESSAGES'
		}, {
			type: 'LOAD_LOGIN_ACCOUNT'
		}, {
			type: 'LOAD_BRANCH'
		}];

		store.dispatch(action.initAugur());

		global.requests[0].respond(200, { contentType: 'text/json' }, `{ "reportingTest": false }`);

		assert(mockAugurJS.connect.calledOnce, `Didn't call AugurJS.connect() exactly once`);
		assert(mockRegisterTransactionRelay.registerTransactionRelay.calledOnce, `Didn't call registerTransactionRelay exactly once as expected`);
		assert(mockLoadLoginAccount.loadLoginAccount.calledOnce, `Didn't call loadLoginAccount exactly once as expected`);
		assert(mockLoadChatMessages.loadChatMessages.calledOnce, `Didn't call loadChatMessages exactly once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct action objects`);
	});
});
